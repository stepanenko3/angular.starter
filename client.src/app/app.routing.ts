import { Routes } from '@angular/router';

import { NotFoundComponent } from './core/components';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', loadChildren: './home/home.module#HomeModule' },

    { path: '404', component: NotFoundComponent, data: { state: '404' } },
    { path: ':slug', loadChildren: './projects/projects.module#ProjectsModule' },

    { path: '**', component: NotFoundComponent, data: { state: '404' } }
];
