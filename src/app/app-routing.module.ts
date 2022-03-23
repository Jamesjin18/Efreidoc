import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/AuthGard/auth-guard.service';
import { AjoutdocComponent } from './modules/ajoutdoc/ajoutdoc.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { SelecmatComponent } from './modules/selecmat/selecmat.component';
import { SignupComponent } from './modules/signup/signup.component';
import { SelecClassComponent } from './modules/selec-class/selec-class.component';
import { SelectCoursTypeComponent } from './modules/select-cours-type/select-cours-type.component';
import { SelectCoursComponent } from './modules/select-cours/select-cours.component';
import { SelectDocumentsComponent } from './modules/select-documents/select-documents.component';
import { CompteComponent } from './modules/compte/compte.component';
import { LoginGuard } from './core/services/AuthGard/login-guard.service';

const routes: Routes = [
  { canActivate: [LoginGuard], path: 'login', component: LoginComponent },
  { canActivate: [LoginGuard], path: 'signup', component: SignupComponent },
  { canActivate: [AuthGuard], path: 'home', component: HomeComponent },
  {
    canActivate: [AuthGuard],
    path: 'home/:promo',
    component: SelecClassComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'home/:promo/:class',
    component: SelectCoursComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'home/:promo/:class/:cours',
    component: SelectCoursTypeComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'home/:promo/:class/:cours/:coursType',
    component: SelectDocumentsComponent,
  },
  { canActivate: [AuthGuard], path: 'selecmat', component: SelecmatComponent },
  {
    canActivate: [AuthGuard],
    path: 'compte',
    component: CompteComponent,
  },
  { canActivate: [AuthGuard], path: 'ajoutdoc', component: AjoutdocComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard, LoginGuard],
})
export class AppRoutingModule {}
