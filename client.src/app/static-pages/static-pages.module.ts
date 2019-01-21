import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { RouterModule } from '@angular/router';

import * as Component from './components';
import * as Resolver from './resolvers';

const ROUTES = [{
  path: '',
  component: Component.StaticPageComponent,
  resolve: { home: Resolver.StaticPageResolver },
  data: { state: 'static-page' }
}];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    RouterModule.forChild(ROUTES),
  ],
  declarations: [
    Component.StaticPageComponent,
  ],
  providers: [
    Resolver.StaticPageResolver,
  ]
})
export class StaticPagesModule { }
