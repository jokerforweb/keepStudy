import extend from 'extend';

const baseUrl = window.location.protocol + '//' + window.location.host;

const baseConfig = {
  endpoint: 'auth',
  configureEndpoints: ['app-api'],
  // baseUrl: 'http://localhost:8333/inittool/api',
  baseUrl: baseUrl,
  loginUrl: 'login',
  loginRedirect: 'index.html',
  authHeader: 'Authorization',
  authTokenType: null,
  storageChangedReload: true
};


const config = extend(true, {}, baseConfig);

export default config;
