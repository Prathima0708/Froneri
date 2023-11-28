import axios from 'axios';
import {SECURE_STORAGE, KEY_AUTH_USER_INFO} from 'src/storage/Storage';
import {authorize, revoke} from 'react-native-app-auth';
import {STRINGS} from 'src/utils/Strings';
import ENV from 'src/env/env.config';
import jwtDecode from 'jwt-decode';
import UserContextService from './UserContextService';

const MS_BASE_API_URL = ENV.MS_BASE_API_URL;
const TENANT_ID = ENV.TENANT_ID;
const APP_ID = ENV.APP_ID;
const REDIRECT_URL = ENV.REDIRECT_URL;
const APP_SCOPES = ENV.APP_SCOPES;
const GRAPH_API_URL = ENV.GRAPH_API_URL;
class LoginService {
  getAzureAuthConfig() {
    return {
      issuer: `${MS_BASE_API_URL}${TENANT_ID}/v2.0`,
      clientId: APP_ID,
      redirectUrl: REDIRECT_URL,
      scopes: APP_SCOPES,

      // additionalParameters: {prompt: 'select_account'},
      serviceConfiguration: {
        authorizationEndpoint: `${MS_BASE_API_URL}${TENANT_ID}/oauth2/v2.0/authorize`,
        tokenEndpoint: `${MS_BASE_API_URL}${TENANT_ID}/oauth2/v2.0/token`,
        revocationEndpoint: `${MS_BASE_API_URL}${TENANT_ID}/oauth2/v2.0/logout`,
      },
    };
  }

  // MS Auth signin method
  async signIn() {
    return authorize(this.getAzureAuthConfig()) // get the configs
      .then(async response => {
        if (response) {
          console.log('response', response);

          const decodedToken: any = jwtDecode(response.accessToken);
          console.log('the decodedToken Id', decodedToken);
          const tenantId = decodedToken.tid;
          console.log('the tenant Id', tenantId);

          if (tenantId === TENANT_ID) {
            // handle the successful login result
            let authInfo: any = {};
            authInfo.accessToken = response.accessToken;
            authInfo.refreshToken = response.refreshToken;
            authInfo.expiryTime = response.accessTokenExpirationDate;
            authInfo.emailId = decodedToken.upn ? decodedToken.upn : '';
            authInfo.displayName = decodedToken.name ? decodedToken.name : '';
            await SECURE_STORAGE.saveData(KEY_AUTH_USER_INFO, authInfo);

            // update user locale
            await UserContextService.updateLocaleIntoReduxStore();

            return authInfo;
          } else {
            // User is not belong to company's domain
            return Promise.reject(STRINGS.INVALID_USER);
          }
        }
      })
      .catch(error => {
        if (error && error.response) {
          return Promise.reject(error.response);
        }
        throw new Error(error);
      });
  }

  // Graph api to get user profile
  async getProfileFromGraphApi(accessToken: string) {
    const headers = {
      Authorization: 'Bearer ' + accessToken,
    };
    return axios
      .get(GRAPH_API_URL, {
        headers: headers,
      })
      .then(res => {
        return res;
      })
      .catch(err => {
        console.log('Graph API error...', err);
        if (err && err.response) {
          return Promise.reject(err.response);
        }
        throw new Error(err);
      });
  }

  // returns accessToken from keystore/keychain
  async getAccessTokenAsync() {
    const userInfo = await this.getUserInfo();
    return userInfo.accessToken;
  }

  // Get userinfo from keystore/keychain
  async getUserInfo() {
    return SECURE_STORAGE.getData(KEY_AUTH_USER_INFO)
      .then(res => {
        if (res) {
          return res;
        } else {
          let userInfo = {
            isDummyToken: true,
          };
          return userInfo;
        }
      })
      .catch(() => {
        let userInfo = {
          isDummyToken: true,
        };
        return userInfo;
      });
  }

  // revoke function
  async authRevoke() {
    let accessToken = await this.getAccessTokenAsync();
    await revoke(this.getAzureAuthConfig(), {
      tokenToRevoke: accessToken,
      includeBasicAuth: true,
    })
      .then(() => {
        // Cache cleared successfully
        console.log('Cache Cleared Successfully');
      })
      .catch(error => {
        console.log('Error revoking access token:', error.message);
      });
  }

  // revoke auth token & clear the data in keystore/keychain
  async logOut() {
    // await this.authRevoke();
    return SECURE_STORAGE.deleteData(KEY_AUTH_USER_INFO);
  }
}

export default new LoginService();
