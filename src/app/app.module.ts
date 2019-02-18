import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './authentication.service';
import { AuthGuardService } from './auth-guard.service';
import {LayoutComponent} from "./ui/layout/layout.component";
import {HeaderComponent} from "./ui/header/header.component";
import {FooterComponent} from "./ui/footer/footer.component";
import { ResumeComponent } from './resume/resume.component';
import {ProfileServer} from "./profile.server";
import {UploadModule} from "./upload/upload.module";
import {AdminProfileComponent, NgbdModalContent, NgbdSortableHeader} from './admin-profile/admin-profile.component';


const routes: Routes = [
  {path: 'home',
   component: HomeComponent},
  { path: '',
    pathMatch : 'full',
    redirectTo : 'login'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'resume',component: ResumeComponent},
  { path: 'admin-profile',component: AdminProfileComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ResumeComponent,
    AdminProfileComponent,
    NgbdSortableHeader,
    NgbdModalContent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    UploadModule
  ],
  entryComponents:[NgbdModalContent],
  providers: [
    AuthenticationService, 
    AuthGuardService,
    ProfileServer
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
