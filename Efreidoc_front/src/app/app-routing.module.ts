import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/AuthGard/auth-guard.service';
import { AjoutdocComponent } from './modules/ajoutdoc/ajoutdoc.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { ResourcesComponent } from './modules/resources/resources.component';
import { ResourcespageComponent } from './modules/resourcespage/resourcespage.component';
import { SelecmatComponent } from './modules/selecmat/selecmat.component';
import { SignupComponent } from './modules/signup/signup.component';
import { SelecClassComponent } from './selec-class/selec-class.component';
import { SelectCoursTypeComponent } from './select-cours-type/select-cours-type.component';
import { SelectCoursComponent } from './select-cours/select-cours.component';
import { SelectDocumentsComponent } from './select-documents/select-documents.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
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
    path: 'resources',
    component: ResourcesComponent,
  },
  {
    canActivate: [AuthGuard],
    path: 'resourcespage',
    component: ResourcespageComponent,
  },
  { canActivate: [AuthGuard], path: 'ajoutdoc', component: AjoutdocComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
