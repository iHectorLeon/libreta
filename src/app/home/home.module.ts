import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'ng2-archwizard';

import { CursosComponent } from './cursos/cursos.component';
import { GuiasComponent } from './guias/guias.component';
import { CursoComponent } from './curso/curso.component';
import { SigninComponent } from './signin/signin.component';
import { LoginComponent } from './../shared/login/login.component';
import { RecoverpasswordComponent } from './../shared/recoverpassword/recoverpassword.component';
import { HomeComponent } from './home.component';

import { ContrasenaPipe } from './../shared/login/contrasena.pipe';

import { HomeroutingModule } from './home.routes';

import { HomeService } from './homeservices/home.service';
import { QuotationComponent } from './quotation/quotation.component';
import { CourseshopComponent } from './courseshop/courseshop.component';

@NgModule({
  imports: [
    CommonModule,
    HomeroutingModule,
    NgxPaginationModule,
    NgbModule,
    FormsModule,
    ArchwizardModule
  ],
  declarations: [
    CursosComponent,
    CursoComponent,
    GuiasComponent,
    SigninComponent,
    LoginComponent,
    RecoverpasswordComponent,
    ContrasenaPipe,
    HomeComponent,
    QuotationComponent,
    CourseshopComponent
  ],
  providers:[
    HomeService
  ]
})
export class HomeModule { }
