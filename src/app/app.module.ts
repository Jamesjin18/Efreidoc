import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignupComponent } from './modules/signup/signup.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HomeComponent } from './modules/home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AjoutdocComponent } from './modules/ajoutdoc/ajoutdoc.component';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { SelecClassComponent } from './modules/selec-class/selec-class.component';
import { SelectCoursComponent } from './modules/select-cours/select-cours.component';
import { SelectDocumentsComponent } from './modules/select-documents/select-documents.component';

import { SelectCoursTypeComponent } from './modules/select-cours-type/select-cours-type.component';
import { PreviousRouteComponent } from './modules/previous-route/previous-route.component';
import { CompteComponent } from './modules/compte/compte.component';
import { ResearchBarComponent } from './modules/research-bar/research-bar.component';
import { ClassementComponent } from './modules/classement/classement.component';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    AjoutdocComponent,
    SelecClassComponent,
    SelectCoursComponent,
    SelectDocumentsComponent,
    SelectCoursTypeComponent,
    PreviousRouteComponent,
    CompteComponent,
    ResearchBarComponent,
    ClassementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    FormsModule,
    NgCircleProgressModule.forRoot({
      backgroundOpacity: 0.9,
      backgroundPadding: 4,
      radius: 60,
      space: -10,
      maxPercent: 100,
      outerStrokeGradient: true,
      outerStrokeWidth: 10,
      outerStrokeColor: '#4882c2',
      outerStrokeGradientStopColor: '#53a9ff',
      innerStrokeColor: '#e7e8ea',
      innerStrokeWidth: 10,
      title: '',
      imageHeight: 147,
      imageWidth: 100,
      animateTitle: false,
      animationDuration: 1000,
      showUnits: false,
      showBackground: false,
      startFromZero: false,
      lazy: true,
    }),
  ],
  exports: [NavbarComponent],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
