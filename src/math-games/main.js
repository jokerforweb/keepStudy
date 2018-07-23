import { PLATFORM } from 'aurelia-pal';
import 'babel-polyfill';
import * as Bluebird from 'bluebird';
import authConfig from '../auth-config';

Bluebird.config({ warnings: { wForgottenReturn: false } });

export async function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin(PLATFORM.moduleName('aurelia-api'), config => {
      config.registerEndpoint('auth');
      config.registerEndpoint('app-api', authConfig.baseUrl);
    })
    .plugin(PLATFORM.moduleName('aurelia-authentication'), baseConfig => {
      baseConfig.configure(authConfig);
    })
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .plugin(PLATFORM.moduleName('aurelia-v-grid'));

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
