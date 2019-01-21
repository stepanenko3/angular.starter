import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared';
import { RouterModule } from '@angular/router';

import * as Component from './components';
import * as Resolver from './resolvers';

const ROUTES = [{
  path: '',
  component: Component.ProjectComponent,
  resolve: { project: Resolver.ProjectResolver },
  data: { state: 'project' }
}];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    RouterModule.forChild(ROUTES),
  ],
  declarations: [
    Component.ProjectComponent,
  ],
  providers: [
    Resolver.ProjectResolver,
  ]
})
export class ProjectsModule { }
