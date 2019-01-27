import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectService } from '@client/core/services';

@Injectable()
export class ProjectResolver implements Resolve<any> {

    constructor(
        private projectService: ProjectService,
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.projectService.getProject(route.params['slug']);
    }
}
