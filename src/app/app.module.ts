import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'ng2-archwizard';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxEditorModule } from 'ngx-editor';
import { ChartsModule } from 'ng2-charts';

import { HomeModule} from './home/home.module';
import { UserModule} from './user/user.module';
import { SupportsuperatemexicoModule } from './supportsuperatemexico/supportsuperatemexico.module';
import { AdminconsoleModule } from './adminconsole/adminconsole.module';
import { EditorModule } from './editor/editor.module';
import { ReportsModule } from './Reports/reports.module';
import { TutorModule } from './Tutor/tutor.module';
import { ErrorModule } from './error/error.module';
import { SearchModule } from './searchmanager/search.module';
import { ManagerModule } from './manager/manager.module';
import { ScheduleModule } from './schedule/schedule.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NabvarComponent } from './shared/nabvar/nabvar.component';
import { NabvarloggedComponent } from './shared/nabvarlogged/nabvarlogged.component';


@NgModule({
  declarations: [
    AppComponent,
    NabvarComponent,
    NabvarloggedComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    UserModule,
    SharedModule,
    SupportsuperatemexicoModule,
    AdminconsoleModule,
    ReportsModule,
    EditorModule,
    TutorModule,
    ErrorModule,
    SearchModule,
    FormsModule,
    ManagerModule,
    ArchwizardModule,
    NgxEditorModule,
    ScheduleModule,
    NgbModule.forRoot(),
    NgxPaginationModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
