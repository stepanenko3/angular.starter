import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared';
import { RouterModule } from '@angular/router';

import * as Component from './components';

const ROUTES = [{
  path: '',
  component: Component.HomeComponent,
  data: { state: 'home' }
}];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    RouterModule.forChild(ROUTES),
  ],
  declarations: [
    Component.HomeComponent,
  ],
})
export class HomeModule { }
