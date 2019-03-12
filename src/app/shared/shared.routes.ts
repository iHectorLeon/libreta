import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const sharedroutingModule : Routes=[
  /*
  {path: 'listcourses', component:ListcoursesComponent},
  {path: 'mygroups', component:MygroupsComponent},
  {path: 'userprofile', component:UserprofileComponent},
  {path: 'mycourses/:curso/:groupid/:courseid/:blockid', component:MycoursesComponent},
  {path: 'block/:curso/:groupid/:courseid/:blockid', component:BlocksComponent},
  {path: 'viewNotification/:courseid/:groupid/:id/:type/:studentid',component:ViewNotificationsComponent},
  {path: 'viewNotificationB/:blockid/:id/:type',component:ViewNotificationsBlocksComponent}
  */
]

@NgModule({
  imports:[
    RouterModule.forChild(sharedroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class SharedroutingModule{}
