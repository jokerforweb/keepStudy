import { inject } from 'aurelia-framework';
import { AppRouter } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import './app.scss';

@inject(AppRouter)
export class App {
  navs = [
    {
      id: 'tiny',
      name: '2048'
    },
    {
      id: 'time-recorder',
      name: '时光记录仪'
    }
  ];
  currentNav;

  constructor(appRouter) {
    this.appRouter = appRouter;

    let hashList = location.hash.replace('#', '').split('/');
    this.currentNav = hashList[1] ? hashList[1].split('?')[0] : 'tiny';
  }

  configureRouter(config) {
    config.title = 'MATHGAMES';
    config.map([
      { route: '', redirect: 'tiny' },
      { route: ['tiny'], name: '2048', moduleId: PLATFORM.moduleName('./tiny/tiny'), nav: true, title: 'tiny' },
      { route: ['time-recorder'], name: '时光记录仪', moduleId: PLATFORM.moduleName('./time-recorder/time-recorder'), nav: true, title: 'time-recorder' }
    ]);
  }

  doChangeRouter(navId) {
    if (this.currentNav === navId) {
      return;
    }
    this.appRouter.navigate(navId);
    this.currentNav = navId;
  }
}
