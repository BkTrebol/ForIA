/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// console.warn = () => {};
// import * as echarts from 'echarts';

/** echarts extensions: */
import 'echarts-gl';

// import 'echarts/theme/dark.js';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));