import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authResolver } from './resolvers/auth/auth.resolver';
import { servicesResolver } from './resolvers/services/services.resolver';
import { ServicesComponent } from './components/services/services.component';
import { recommendationsResolver } from './resolvers/recommendations/recommendations.resolver';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminResolver } from './resolvers/auth/admin.resolver';

export const routes: Routes = [
    { 
        path: '', 
        component: HomePageComponent 
    },
    { 
        path: 'login', 
        component: LoginComponent,
        resolve: { 
            isAuthenticated: authResolver 
        }
    },
    { 
        path: 'admin', 
        component: AdminComponent, 
        resolve: 
        { 
            isAdmin: adminResolver 
        } 
    },
    { 
        path: 'register', 
        component: RegisterComponent 
    },
    { 
        path: 'services', 
        component: ServicesComponent, 
        resolve: 
        { 
            services: servicesResolver 
        } 
    },
   

    { 
        path: 'dashboard', 
        component: DashboardComponent, 
        resolve: 
        { 
            recommendations: recommendationsResolver 
        } 
    },


    { 
        path: '**', 
        redirectTo: '', 
        pathMatch: 'full' 
    } // Redirige vers Home si la route est inconnue
  
];
