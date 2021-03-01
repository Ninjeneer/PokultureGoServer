import getDistance from "geolib/es/getDistance";
import { StatusCodes } from "http-status-codes";
import { ChallengeType, IChallenge } from "../models/Challenge";
import { IUser } from "../models/User";
import RecognitionFactory from "../modules/recognition/RecognitionFactory";
import LocationIQ from "../modules/reversegeocoding/LocationIQ";
import ChallengeStorage from "../storage/ChallengeStorage";
import POIStorage from "../storage/POIStorage";
import UserStorage from "../storage/UserStorage";
import { AppError } from "../Types";
import Utils from "../Utils";

export default class ChallengeController {
  public static async getChallenge(id: IChallenge['id']): Promise<IChallenge> {
    let challenge: IChallenge;
    try {
      challenge = await ChallengeStorage.getChallenge({ id });
    } catch (e) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        message: e.message
      });
    }
    if (!challenge) {
      throw new AppError({
        code: StatusCodes.NOT_FOUND,
        message: 'Challenge does not exist'
      });
    }
    return challenge;
  }

  public static async validateChallenge(user: IUser, challengeID: IChallenge['id'], payload: any): Promise<{ validated: boolean, score: number }> {
    let challenge: IChallenge;
    try {
      challenge = await ChallengeStorage.getChallenge({ id: challengeID });
      if (!challenge) {
        throw new Error();
      }
    } catch (e) {
      throw new AppError({
        message: 'Challenge does not exists',
        code: StatusCodes.NOT_FOUND
      });
    }
    // Check payload content
    if (!payload || Utils.isEmptyObject(payload)) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Payload is missing or empty'
      });
    }
    // Check if the challenge is already done
    if (user.challengesDone && user.challengesDone.includes(challenge.id.toString())) {
      throw new AppError({
        code: StatusCodes.FORBIDDEN,
        message: 'Challenge is already validated'
      });
    }
    switch (challenge.type) {
      case ChallengeType.PHOTO:
        const poi = await POIStorage.getPOI({ challengeID });
        if (!poi) {
          throw new AppError({
            message: 'POI does not exists',
            code: StatusCodes.NOT_FOUND
          });
        }
        // Process image recognition
        const imageRecognition = RecognitionFactory.createTensorFlowrecognition();
        const results = await imageRecognition.recognizeImage(payload.image);
        const distanceFromPOI = getDistance({ latitude: poi.location[1], longitude: poi.location[0] }, { latitude: payload.latitude, longitude: payload.longitude });
        if (!results.some(r => challenge.allowedTags.includes(r)) && distanceFromPOI < 60) {
          // Challenge is validated
          const location = await (new LocationIQ()).reverseGeocoding(payload.latitude, payload.longitude);
          if (location && location.address && location.address.city) {
            const score = user.scores.find(s => s.city.toLowerCase() === location.address.city.toLowerCase());
            if (score) {
              // User has already a score for the given city
              score.score += challenge.score;
            } else {
              // Create a new entry for the city
              user.scores.push({ city: location.address.city, score: challenge.score });
            }
            try {
              // Update user
              if (user.challengesDone) {
                user.challengesDone.push(challenge.id);
              } else {
               user.challengesDone = [challenge.id];
              }
              await UserStorage.updateUser(user);
            } catch (e) {
              throw new AppError({
                message: 'Failed to update user after challenge validation',
                stack: e.stack
              });
            }
          } else {
            // Unable to find city
            throw new AppError({
              message: 'Unable to identify city'
            });
          }
          return { validated: true, score: challenge.score };
        } else {
          return { validated: false, score: 0 };
        }
      default:
        break;
    }
  }
}
