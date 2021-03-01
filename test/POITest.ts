import { expect } from "chai";
import { StatusCodes } from "http-status-codes";
import Utils from "../src/Utils";
import HttpClient from "./HttpClient";
import chai from 'chai';
import chaiSubset from 'chai-subset';
import config from '../assets/config.json';
import Database from "../src/Database";
import POIStorage from "../src/storage/POIStorage";
import { IPOI } from "../src/models/POI";

const httpClient = new HttpClient();

chai.use(chaiSubset);
const db = new Database();
let pois: IPOI[];

describe("POI tests", function () {
  this.timeout(20000);
  before(async () => {
    await httpClient.logAs(config.test.users.basic.pseudo, config.test.users.basic.password);
    await db.connect();
    pois = await POIStorage.getPOIs();
  });

  describe("Access", () => {
    it("should get a POI by ID", async () => {
      const response = await httpClient.get(`${Utils.buildServerURL()}/pois/${pois[0].id}`);
      expect(response.status).to.be.eq(StatusCodes.OK);
      pois[0].id = pois[0].id.toString();
      expect(response.data).to.be.deep.eq(pois[0]);
    });

    it("should not get a POI with invalid ID", async () => {
      const response = await httpClient.get(`${Utils.buildServerURL()}/pois/invalidID`);
      expect(response.status).to.be.eq(StatusCodes.BAD_REQUEST);
    });
  });
});
