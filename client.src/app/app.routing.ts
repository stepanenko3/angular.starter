import { Routes } from '@angular/router';

// import {AuthGuard} from '@app/core/guards';
import { NotFoundComponent } from './core/components';

export const appRoutes: Routes = [
    { path: '', pathMatch: 'full', loadChildren: './home/home.module#HomeModule' },

    { path: '404', component: NotFoundComponent, data: { state: '404' } },
    { path: ':alt', loadChildren: './static-pages/static-pages.module#StaticPagesModule' },

    { path: '**', component: NotFoundComponent, data: { state: '404' } }
];
