import getDistance from "geolib/es/getDistance";
import { StatusCodes } from "http-status-codes";
import { ChallengeType } from "../models/Challenge";
import RecognitionFactory from "../modules/recognition/RecognitionFactory";
import ChallengeStorage from "../storage/ChallengeStorage";
import POIStorage from "../storage/POIStorage";
import { AppError } from "../Types";

export default class ChallengeController {
  public static async validateChallenge(challengeID: string, payload: any): Promise<{ validated: boolean, score: number }> {
      const challenge = await ChallengeStorage.getChallenge({ id: challengeID });
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
          if (results.some(r => challenge.allowedTags.includes(r)) && distanceFromPOI < 60) {
            // Challenge is validated
            // TODO update player score and achived challenges
            return { validated: true, score: challenge.score };
          } else {
            return { validated: false, score: 0 };
          }
        default:
          break;
      }
  }
}
