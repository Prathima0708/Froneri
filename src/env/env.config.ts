export default {
  ENV: 'ENVIRONMENT_DEV',
  BASE_API_URL: 'https://tessmobile-test.froneri.com/',

  USERNAME: 'FroneriTESSApi',
  PASSWORD: 'FroneriTESS@456#!',

  // AZURE AD CONFIGS
  APP_ID: '229a8cf8-a3af-4e50-9051-c950dd6d406e',
  TENANT_ID: '5408a96d-412c-41f7-9f5c-958b28e7d8c5',
  // FRONERI AZURE AD CONFIGS
  // APP_ID: '4a60467f-5d74-4ec9-93d8-34aada1d265e',
  // TENANT_ID: 'e829cba4-943d-4564-b755-1548dccfb33b',
  //
  APP_SCOPES: [
    'openid',
    'offline_access',
    'profile',
    'User.Read',
    'Calendars.ReadWrite',
  ],
  REDIRECT_URL: 'tess-mobile://android-app/',
  MS_BASE_API_URL: 'https://login.microsoftonline.com/',
  GRAPH_API_URL: 'https://graph.microsoft.com/v1.0/me',
  // AZURE AD CONFIGS ENDS..

  // Data Import
  ENABLE_USER_SWITCH: true,
  
  // ROUTE GUARD
  IS_ROUTE_GUARD: true
};
