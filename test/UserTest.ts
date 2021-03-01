import { expect } from "chai";
import * as faker from "faker";
import { StatusCodes } from "http-status-codes";
import Utils from "../src/Utils";
import HttpClient from "./HttpClient";
import fs from 'fs';
import chai from 'chai';
import chaiSubset from 'chai-subset';
import config from '../assets/config.json'

const httpClient = new HttpClient();
const user = {} as { pseudo: string; password: string };

chai.use(chaiSubset);

describe("User tests", function () {
  this.timeout(20000000);

  describe("Registration", () => {
    it("should register a valid user without avatar", async () => {
      const pseudo = faker.random.alphaNumeric(10);
      const password = faker.random.alphaNumeric(20);
      Object.assign(user, { pseudo, password });
      const response = await httpClient.post(`${Utils.buildServerURL()}/users/register`, { pseudo, password });
      expect(response.status).to.be.eq(StatusCodes.CREATED);
      expect(response.data.pseudo).to.be.eq(pseudo);
      expect(response.data.password).to.not.be.eq(password);
      expect(response.data.token).to.exist;
    });

    it("should register a valid user with an avatar", async () => {
      const pseudo = faker.random.alphaNumeric(10);
      const password = faker.random.alphaNumeric(20);
      const avatar = fs.readFileSync("test/assets/avatar.png", { encoding: 'base64' });
      const response = await httpClient.post(`${Utils.buildServerURL()}/users/register`, { pseudo, password, avatar });
      expect(response.status).to.be.eq(StatusCodes.CREATED);
      expect(response.data.pseudo).to.be.eq(pseudo);
      expect(response.data.password).to.not.be.eq(password);
      expect(response.data.token).to.exist;
      expect(response.data.avatar).to.exist;
    });

    it("should not register an already existing user", async () => {
      const pseudo1 = faker.random.alphaNumeric(10);
      const response1 = await httpClient.post(`${Utils.buildServerURL()}/users/register`, { pseudo: pseudo1, password: faker.random.alphaNumeric(20) });
      expect(response1.status).to.be.eq(StatusCodes.CREATED);

      const response2 = await httpClient.post(`${Utils.buildServerURL()}/users/register`, { pseudo: pseudo1, password: faker.random.alphaNumeric(20) });
      expect(response2.status).to.be.eq(StatusCodes.CONFLICT);
      expect(response2.data.token).to.not.exist;
    });
  });

  describe("Login", () => {
    it("should log in with valid credentials", async () => {
      const response = await httpClient.post(`${Utils.buildServerURL()}/users/login`, user);
      expect(response.status).to.be.eq(StatusCodes.OK);
      expect(response.data.pseudo).to.be.eq(user.pseudo);
      expect(response.data.token).to.exist;
    });

    it("should log in with token", async () => {
      let response = await httpClient.post(`${Utils.buildServerURL()}/users/login`, { pseudo: config.test.users.basic.pseudo, password: config.test.users.basic.password });
      expect(response.status).to.be.eq(StatusCodes.OK);
      expect(response.data.token).to.exist;
      const token = response.data.token;

      response = await httpClient.post(`${Utils.buildServerURL()}/users/login`, { token });
      expect(response.status).to.be.eq(StatusCodes.OK);
      expect(response.data.pseudo).to.be.eq(config.test.users.basic.pseudo);
      expect(response.data.token).to.be.eq(token);
    });

    it("should not log in with wrong credentials", async () => {
      const response = await httpClient.post(`${Utils.buildServerURL()}/users/login`, { pseudo: user.pseudo, password: 'wrong password' });
      expect(response.status).to.be.eq(StatusCodes.UNAUTHORIZED);
    });
  });
});
