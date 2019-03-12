import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {RecoverComponent} from './recover/recover.component';
import {HomeComponent} from './home/home.component';
import {ConfirmComponent} from './confirm/confirm.component';
import {UserconfirmComponent} from './userconfirm/userconfirm.component';
import {ResetpasswordComponent} from './shared/resetpassword/resetpassword.component';
import {ConsoleuserComponent} from './shared/consoleuser/consoleuser.component';
import {ListcoursesComponent } from './user/listcourses/listcourses.component';
import {PrivacyComponent} from './shared/privacy/privacy.component';
import {ErrorComponent} from './error/error.component';

const routes: Routes = [
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'home', component:HomeComponent},
  {path:'consoleuser', component:ConsoleuserComponent},
  {path:'avisoprivacidad', component:PrivacyComponent},
  {path:'resetpass', component:ResetpasswordComponent},
  {path:'recover/:tokentemp/:username',component:RecoverComponent},
  {path:'userconfirm/:tokentemp/:username',component:UserconfirmComponent},
  {path:'confirm/:tokentemp/:username/:name/:fathername/:mothername',component:ConfirmComponent},
  {path:'error/:typeError', component:ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
