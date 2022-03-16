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
import { SelecmatComponent } from './modules/selecmat/selecmat.component';
import { ResourcesComponent } from './modules/resources/resources.component';
import { ResourcespageComponent } from './modules/resourcespage/resourcespage.component';
import { AjoutdocComponent } from './modules/ajoutdoc/ajoutdoc.component';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { MajeurService } from './core/services/majeur.service';
import { SelecClassComponent } from './selec-class/selec-class.component';
import { SelectCoursComponent } from './select-cours/select-cours.component';
import { SelectDocumentsComponent } from './select-documents/select-documents.component';

import { AuthGuard } from './core/services/AuthGard/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    NavbarComponent,
    SelecmatComponent,
    ResourcesComponent,
    ResourcespageComponent,
    AjoutdocComponent,
    SelecClassComponent,
    SelectCoursComponent,
    SelectDocumentsComponent,
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
  ],
  exports: [NavbarComponent],
  providers: [AuthService, MajeurService],
  bootstrap: [AppComponent],
})
export class AppModule {}
