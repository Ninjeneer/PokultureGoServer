import getDistance from "geolib/es/getDistance";
import { StatusCodes } from "http-status-codes";
import Challenge, { ChallengeType } from "../models/Challenge";
import RecognitionFactory from "../modules/recognition/RecognitionFactory";
import POIStorage from "../storage/POIStorage";
import { AppError } from "../Types";

export default class ChallengeController {
  public static async validateChallenge(challengeID: string, payload: any) {
      const challenge = await Challenge.findById(challengeID);
      if (!challenge) {
        throw new AppError({
          message: 'Challenge does not exists',
          code: StatusCodes.NOT_FOUND
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
          if (results.some(challenge.allowedTags) && distanceFromPOI < 30) {
            // Challenge is validated
          }
          break;
        default:
          break;
      }
  }
}
