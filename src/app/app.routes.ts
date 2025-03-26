import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ServicesComponent } from './components/services/services.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';

//  Importation des Guards
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { 
        path: '', 
        component: HomePageComponent 
    },
    { 
        path: 'login', 
        component: LoginComponent
    },
    { 
        path: 'register', 
        component: RegisterComponent 
    },
    { 
        path: 'services', 
        component: ServicesComponent
    },
    { 
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [authGuard] //  Protéger avec authGuard
    },
    { 
        path: 'admin', 
        component: AdminComponent, 
        canActivate: [authGuard, adminGuard] //  Protéger avec authGuard et adminGuard
    },
    { 
        path: '**', 
        redirectTo: '', 
        pathMatch: 'full' 
    } // Redirige vers Home si la route est inconnue
];
