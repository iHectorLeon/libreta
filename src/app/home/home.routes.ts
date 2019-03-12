import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { HomeComponent } from './components/homepage/home.component';
import { CursosComponent } from './cursos/cursos.component';
import { CursoComponent } from './curso/curso.component';
import { GuiasComponent } from './guias/guias.component';
import { QuotationComponent } from './quotation/quotation.component';
import { SigninComponent } from './signin/signin.component';
import { LoginComponent } from './../shared/login/login.component';
import { RecoverpasswordComponent } from './../shared/recoverpassword/recoverpassword.component';

const homeroutingModule : Routes = [
  //{path:'home',component:HomeComponent},
  {path:'cursos',component:CursosComponent},
  {path:'quotation',component:QuotationComponent},
  {path:'curso/:id',component:CursoComponent},
  {path:'signin',component:SigninComponent},
  {path:'login',component:LoginComponent},
  {path:'recoverpassword',component:RecoverpasswordComponent},
]

@NgModule({
  imports:[
    RouterModule.forChild(homeroutingModule)
  ],
  exports:[
    RouterModule
  ]
})

export class HomeroutingModule { }
