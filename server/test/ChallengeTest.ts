import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import Utils from "../src/Utils";
import HttpClient from "./HttpClient";
import chai from 'chai';
import chaiSubset from 'chai-subset';
import config from '../assets/config.json';
import ChallengeStorage from "../src/storage/ChallengeStorage";
import Database from "../src/Database";
import { IChallenge } from "../src/models/Challenge";
import POIStorage from "../src/storage/POIStorage";
import fs from 'fs';

const httpClient = new HttpClient();
const user = {} as { pseudo: string; password: string };

chai.use(chaiSubset);
const db = new Database();
let challenges: IChallenge[];

describe("Challenge tests", function () {
  this.timeout(20000);
  before(async () => {
    await httpClient.logAs(config.test.users.basic.pseudo, config.test.users.basic.password);
    await db.connect();
    challenges = await ChallengeStorage.getChallenges();
  });

  describe("Validation", () => {
    it("should not validate a challenge with a wrong id", async () => {
      const response = await httpClient.post(`${Utils.buildServerURL()}/challenges/validate`, { id: 'invalidID', payload: {} });
      expect(response.status).to.be.eq(StatusCodes.NOT_FOUND);
    });

    it("should not validate a challenge with a null payload", async () => {
      const response = await httpClient.post(`${Utils.buildServerURL()}/challenges/validate`, { id: challenges[0].id, payload: null });
      expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    });

    it("should not validate a challenge without payload", async () => {
      const response = await httpClient.post(`${Utils.buildServerURL()}/challenges/validate`, { id: challenges[0].id });
      expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    });

    it("should not validate a challenge with an empty payload", async () => {
      const response = await httpClient.post(`${Utils.buildServerURL()}/challenges/validate`, { id: challenges[0].id, payload: {} });
      expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    });

    it("should not validate a photo challenge with too far coordinates", async () => {
      const poi = await POIStorage.getPOI({ name: 'Château de Caen' });
      const challenge = await ChallengeStorage.getChallenge({ id: poi.challenge });
      const response = await httpClient.post(`${Utils.buildServerURL()}/challenges/validate`, {
        id: challenge.id,
        payload: {
          latitude: 0,
          longitude: 0,
          image: fs.readFileSync("test/assets/chateau-caen.jpg", { encoding: 'base64' })
        }
      });
      expect(response.status).to.be.eq(StatusCodes.OK);
      expect(response.data).to.be.deep.eq({ validated: false, score: 0 });
    });

    it("should validate a photo challenge", async () => {
      const poi = await POIStorage.getPOI({ name: 'Château de Caen' });
      const challenge = await ChallengeStorage.getChallenge({ id: poi.challenge });
      const response = await httpClient.post(`${Utils.buildServerURL()}/challenges/validate`, {
        id: challenge.id,
        payload: {
          latitude: Utils.locations(poi.location).latitude,
          longitude: Utils.locations(poi.location).longitude,
          image: fs.readFileSync("test/assets/chateau-caen.jpg", { encoding: 'base64' })
        }
      });
      expect(response.status).to.be.eq(StatusCodes.OK);
      expect(response.data).to.be.deep.eq({ validated: true, score: challenge.score });
    });
  });
});
