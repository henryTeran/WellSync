import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AdminComponent } from './components/admin/admin.component';
import { SplashScreenComponent } from './pages/splash-screen/splash-screen.component';

// Guards
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { authAnonymousGuard } from './core/guards/auth-anonymous.guard';

export const routes: Routes = [
  {
    path: '',
    component: SplashScreenComponent
  },
  
  {
    path: 'app',
    loadComponent: () => import('./pages/tabs/tabs.component').then(m => m.TabsComponent),
    canActivate: [authAnonymousGuard],
    children: [
      
      { 
        path: 'home', 
        loadComponent: () => import('./pages/home/home-page.component').then(m => m.HomePageComponent),
        canActivate: [authGuard]
      },
      { 
        path: 'chat', 
        loadComponent: () => import('./components/chatbot/chatbot.component').then(m => m.ChatbotComponent),
        canActivate: [authGuard] 
      },
      { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
    
      { path: 'register', component: RegisterComponent },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [authGuard, adminGuard]
      },
      // Diagnostic Forms
      {
        path: 'diagnostic',
        children: [
          {
            path: 'sport',
            loadComponent: () => import('./components/diagnostic-form/sport/diagnostic-form-sport.component').then(m => m.DiagnosticFormSportComponent),
            canActivate: [authGuard]
          },
          {
            path: 'alimentation',
            loadComponent: () => import('./components/diagnostic-form/alimentation/diagnostic-form-alimentation.component').then(m => m.DiagnosticFormAlimentationComponent),
            canActivate: [authGuard]
          },
          {
            path: 'soins',
            loadComponent: () => import('./components/diagnostic-form/soins/diagnostic-form-soins.component').then(m => m.DiagnosticFormSoinsComponent),
            canActivate: [authGuard]
          },
        ]
      },
      // Recommendations
      {
        path: 'recommendations',
        children: [
          {
            path: 'sport',
            loadComponent: () => import('./components/recommendations/sport/sport.component').then(m => m.SportComponent),
            canActivate: [authGuard]
          },
          {
            path: 'alimentation',
            children: [
              {
                path: '',
                loadComponent: () => import('./components/recommendations/alimentation/alimentation.component').then(m => m.AlimentationComponent),
                canActivate: [authGuard]
              },
              {
                path: 'planning',
                loadComponent: () => import('./components/recommendations/alimentation/planning/planning.component').then(m => m.PlanningComponent),
                canActivate: [authGuard]
              }
            ]
          },
          {
            path: 'soins',
            children: [
              {
                path: '',
                loadComponent: () => import('./components/recommendations/soins/soins.component').then(m => m.SoinsComponent),
                canActivate: [authGuard]
              },
              {
                path: 'details',
                loadComponent: () => import('./components/recommendations/soins/details/details.component').then(m => m.DetailsComponent),
                canActivate: [authGuard]
              }
            ]
          },
        ]
      },
      // Emotions
      {
        path: 'emotions',
        children: [
          {
            path: 'upload',
            loadComponent: () => import('./components/emotion-uploader/emotion-uploader.component').then(m => m.EmotionUploaderComponent),
            canActivate: [authGuard]
          },
          {
            path: 'live',
            loadComponent: () => import('./components/emotion-live/emotion-live.component').then(m => m.EmotionLiveComponent),
            canActivate: [authGuard]
          },
        ]
      },
      // Services
      {
        path: 'services',
        loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent),
        canActivate: [authGuard]
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];