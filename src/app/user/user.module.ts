import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbedVideo } from 'ngx-embed-video';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'ng2-archwizard';
import { NgxPaginationModule } from 'ngx-pagination';

import { BlocksComponent } from './blocks/blocks.component';

import { ListcoursesComponent } from './listcourses/listcourses.component';
import { MycoursesComponent } from './mycourses/mycourses.component';
import { MygroupsComponent } from './mygroups/mygroups.component';
import { VideosPipe} from './userservices/videos.pipe';

import { UserroutingModule} from './user.routes';
import { BlockSectionComponent } from './block-section/block-section.component';
import { BlockLessonComponent } from './block-lesson/block-lesson.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ViewNotificationsComponent } from './view-notifications/view-notifications.component';
import { ViewNotificationsBlocksComponent } from './view-notifications-blocks/view-notifications-blocks.component';
import { BlockQuestionnarieComponent } from './block-questionnarie/block-questionnarie.component';
import { BlockTasksComponent } from './block-tasks/block-tasks.component';

@NgModule({
  imports: [
    CommonModule,
    UserroutingModule,
    ArchwizardModule,
    EmbedVideo,
    NgbModule,
    NgxPaginationModule
  ],
  declarations: [
    BlocksComponent,
    ListcoursesComponent,
    MycoursesComponent,
    MygroupsComponent,
    VideosPipe,
    BlockSectionComponent,
    BlockLessonComponent,
    UserprofileComponent,
    ViewNotificationsComponent,
    ViewNotificationsBlocksComponent,
    BlockQuestionnarieComponent,
    BlockTasksComponent
  ]
})
export class UserModule { }
