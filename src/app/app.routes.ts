import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
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
        path: 'dashboard', 
        component: DashboardComponent, 
        canActivate: [authGuard] //  Protéger avec authGuard
    },
    {
      path: 'emotion',
      loadComponent: () => import('./components/emotion-uploader/emotion-uploader.component').then(m => m.EmotionUploaderComponent),
        canActivate: [authGuard]
    },
    {
      path: 'emotion-live',
      loadComponent: () => import('./components/emotion-live/emotion-live.component').then(m => m.EmotionLiveComponent),
       canActivate: [authGuard]
    },
    {
      path: 'services',
      loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent),
      canActivate: [authGuard]
    },
    {
      path: 'diagnostic/sport',
      loadComponent: () => import('./components/diagnostic-form/sport/diagnostic-form-sport.component').then(m => m.DiagnosticFormSportComponent),
      canActivate: [authGuard]
    },
    {
      path: 'diagnostic/alimentation',
      loadComponent: () => import('./components/diagnostic-form/alimentation/diagnostic-form-alimentation.component').then(m => m.DiagnosticFormAlimentationComponent),
      canActivate: [authGuard]
    },
    {
      path: 'diagnostic/soins',
      loadComponent: () => import('./components/diagnostic-form/soins/diagnostic-form-soins.component').then(m => m.DiagnosticFormSoinsComponent),
      canActivate: [authGuard]
    },
    
    {
      path: 'alimentation',
      loadComponent: () => import('./components/recommendations/alimentation/alimentation.component').then(m => m.AlimentationComponent),
      canActivate: [authGuard]
    },
    {
      path: 'sport',
      loadComponent: () => import('./components/recommendations/sport/sport.component').then(m => m.SportComponent),
      canActivate: [authGuard]
    },
    {
      path: 'soins',
      loadComponent: () => import('./components/recommendations/soins/soins.component').then(m => m.SoinsComponent),
      canActivate: [authGuard,]
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
