import axios from 'axios';
import base64 from 'react-native-base64';
import {store} from 'src/store';
import ENV from 'src/env/env.config';

const USERNAME = ENV.USERNAME;
const PASSWORD = ENV.PASSWORD;
export class ApiUtil {
  async getAppDeviceOnlineStatus() {
    const state = store.getState();
    if (state.userContext.isFlightModeEnabled) {
      return {status: false, errMsg: 'You are offline!'};
    }
    if (!state.userContext.isDeviceOnline) {
      return {status: false, errMsg: 'Please check your internet connection!'};
    }
    return {status: true, errMsg: ''};
  }

  async callPostApi(url: string, parameters: any, headers: any = {}) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD),
    };
    try {
      const response = await axios.post(url, parameters, {headers: headers});
      return response.data;
    } catch (error) {
      return error;
    }
  }

  async callGetApi(url: string, headers: any = {}) {
    headers = {
      ...headers,
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD),
    };

    try {
      const response = await axios.get(url, {headers: headers});
      return response.data;
    } catch (error) {
      return error;
    }
  }
}

export default new ApiUtil();
