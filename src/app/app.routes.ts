import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StorageManagerComponent } from './components/storage-manager/storage-manager.component';
import { StorageDetailComponent } from './components/storage-detail/storage-detail.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'storages', component: StorageManagerComponent },
  { path: 'storage/:id', component: StorageDetailComponent },
];
