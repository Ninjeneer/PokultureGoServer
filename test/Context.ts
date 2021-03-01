import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import config from '../assets/config.json';
import Utils from '../src/Utils';

// Create admin account
axios.post(Utils.buildServerURL() + '/users/register', {
  pseudo: config.test.users.admin.pseudo,
  password: config.test.users.admin.password
}).then((response) => {
  console.log("User admin " + (response.status === StatusCodes.CREATED ? "registered" : "failed to register"))
}).catch((e) => {
  console.error("Failed to register admin : " + (e.data ? e.data.message : e));
});

// Create basic account
axios.post(Utils.buildServerURL() + '/users/register', {
  pseudo: config.test.users.basic.pseudo,
  password: config.test.users.basic.password
}).then((response) => {
  console.log("User basic " + (response.status === StatusCodes.CREATED ? "registered" : "failed to register"))
}).catch((e) => {
  console.error("Failed to register basic : " + (e.data ? e.data.message : e));
});
