import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CallsInterceptorInterceptor } from './models/calls-interceptor.interceptor';
import { AuthService } from './services/auth.service';
import { GuardGuard } from './models/guard.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    GuardGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS, useClass: CallsInterceptorInterceptor, multi: true
    },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
