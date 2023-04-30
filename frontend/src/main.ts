/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { AdminModule } from './admin/admin.module';

// console.warn = () => {};
// import * as echarts from 'echarts';

/** echarts extensions: */
import 'echarts-gl';

// import 'echarts/theme/dark.js';

if (document.URL.includes('/admin')){
  platformBrowserDynamic().bootstrapModule(AdminModule)
    .catch(err => console.error(err));
} else {
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
}

