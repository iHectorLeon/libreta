import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'ng2-archwizard';
import { NgxPaginationModule } from 'ngx-pagination';

import { TaskreviewComponent } from './taskreview/taskreview.component';
import { TasksviewComponent } from './tasksview/tasksview.component';
import { TutorialComponent} from './tutorial/tutorial.component';

import { TutorroutingModule } from './tutor.routes';
@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    TutorroutingModule,
    ArchwizardModule,
    NgxPaginationModule
  ],
  declarations: [
    TasksviewComponent,
    TaskreviewComponent,
    TutorialComponent
  ]
})
export class TutorModule { }
