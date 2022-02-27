import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjoutdocComponent } from './modules/ajoutdoc/ajoutdoc.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { ResourcesComponent } from './modules/resources/resources.component';
import { ResourcespageComponent } from './modules/resourcespage/resourcespage.component';
import { SelecmatComponent } from './modules/selecmat/selecmat.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent},
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
