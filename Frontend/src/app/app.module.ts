import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpInterceptor } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';


import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TableUserComponent } from './components/table-user/table-user.component';
import { BillComponent } from './components/bill/bill.component';
import { ProductComponent } from './components/product/product.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';





// import { GoogleChartsModule } from 'angular-google-charts';
// import { DetailuserComponent } from './pages/detailuser/detailuser.component';
// import { ForgotPasswordComponent } from './modules/forgot-password/forgot-password.component';
// import { MainComponent } from './modules/main/main.component';
// import { RecoverPasswordComponent } from './modules/recover-password/recover-password.component';
// import { HeaderComponent } from './modules/main/header/header.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor } from './token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';








@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TableUserComponent,
    BillComponent,
    ProductComponent,
    ProfileComponent,
    RegisterComponent,
    LoginComponent,
    MainComponent,
    ResetPasswordComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    NgxPermissionsModule.forRoot(),



  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
