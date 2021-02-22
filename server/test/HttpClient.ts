/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios';
import { performance } from 'perf_hooks';
import { StatusCodes } from 'http-status-codes';
import { IUser } from '../src/models/User';
import Utils from '../src/Utils';

interface HttpResponse {
  executionTime: number,
  status: number,
  statusText: string,
  headers: any,
  data: any
}

export default class HttpClient {

  public authenticatedUser: IUser;
  private token: string;

  public async authenticate(path, params): Promise<HttpResponse> {
    const response = await this.post(path, params);
    if (response.status === StatusCodes.OK) {
      this.token = 'Bearer ' + response.data.token;
      this.authenticatedUser = response.data;
    }
    return response;
  }

  public async logAs(pseudo: string, password: string) {
    await this.authenticate(Utils.buildServerURL() + '/users/login', { pseudo: pseudo, password: password });
  }

  public async get(path, params?): Promise<HttpResponse> {
    return await this.send('GET', path, params ? params : '');
  }

  public async post(path, params?): Promise<HttpResponse> {
    return await this.send('POST', path, params ? params : '');
  }

  public async delete(path, params?): Promise<HttpResponse> {
    return await this.send('DELETE', path, params ? params : '');
  }

  public async put(path, params?): Promise<HttpResponse> {
    return await this.send('PUT', path, params ? params : '');
  }

  private async send(method, path, params): Promise<HttpResponse> {
    let httpResponse;

    const httpRequest = {
      method: method,
      url: path,
      port: 8080,
      host: '127.0.0.1',
      data: method !== 'GET' ? params : null,
      params: method === 'GET' ? params : null,
      headers: { authorization: this.token ? this.token : '' },
    } as AxiosRequestConfig;

    let t0 = 0;
    let t1 = 0;
    try {
      t0 = performance.now();
      // Execute with Axios
      httpResponse = await axios(httpRequest);
      t1 = performance.now();
    } catch (error) {
      // Handle errors
      if (error.response) {
        httpResponse = error.response;
      } else if (error.request) {
        throw error;
      } else {
        throw error;
      }
    }
    // Set response
    return {
      executionTime: (t1 - t0),
      status: httpResponse.status,
      statusText: httpResponse.statusText,
      headers: httpResponse.headers,
      data: httpResponse.data
    };
  }
}
