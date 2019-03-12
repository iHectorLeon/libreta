import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocksComponent } from './blocks/blocks.component';
import { ListcoursesComponent } from './listcourses/listcourses.component';
import { MycoursesComponent } from './mycourses/mycourses.component';
import { MygroupsComponent } from './mygroups/mygroups.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ViewNotificationsComponent } from './view-notifications/view-notifications.component';
import { ViewNotificationsBlocksComponent } from './view-notifications-blocks/view-notifications-blocks.component';

const userroutingModule : Routes=[
  {path: 'listcourses', component:ListcoursesComponent},
  {path: 'mygroups', component:MygroupsComponent},
  {path: 'userprofile', component:UserprofileComponent},
  {path: 'mycourses/:curso/:groupid/:courseid/:blockid', component:MycoursesComponent},
  {path: 'block/:curso/:groupid/:courseid/:blockid', component:BlocksComponent},
  {path: 'viewNotification/:courseid/:groupid/:id/:type/:studentid',component:ViewNotificationsComponent},
  {path: 'viewNotificationB/:blockid/:id/:type',component:ViewNotificationsBlocksComponent}
]

@NgModule({
  imports:[
    RouterModule.forChild(userroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class UserroutingModule{}
