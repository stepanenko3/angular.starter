import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { take, map } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';

@Injectable()
export class ProjectService {

    constructor(private http: ApiService) { }

    getProjects(): Observable<any> {
        return this.http.get(`/assets/projects.json`, null, { nonApi: true }).pipe(take(1));
    }

    getProject(slug: string): Observable<any> {
        return this.getProjects().pipe(map(projects => {
            return projects.find(project => project.slug === slug);
        }));
    }
}
