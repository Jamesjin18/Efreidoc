import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjoutdocComponent } from './modules/ajoutdoc/ajoutdoc.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { ResourcesComponent } from './modules/resources/resources.component';
import { ResourcespageComponent } from './modules/resourcespage/resourcespage.component';
import { SelecmatComponent } from './modules/selecmat/selecmat.component';
import { SignupComponent } from './modules/signup/signup.component';
import { SelecClassComponent } from './selec-class/selec-class.component';
import { SelectCoursComponent } from './select-cours/select-cours.component';
import { SelectDocumentsComponent } from './select-documents/select-documents.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent},
  { path: 'home/:promo', component: SelecClassComponent},
  { path: 'home/:promo/:class', component: SelectCoursComponent},
  { path: 'home/:promo/:class/documents', component: SelectDocumentsComponent},
  { path: 'selecmat', component: SelecmatComponent},
  { path: 'resources', component: ResourcesComponent},
  { path: 'resourcespage', component: ResourcespageComponent},
  { path: 'ajoutdoc', component: AjoutdocComponent},
  { path: '',   redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
