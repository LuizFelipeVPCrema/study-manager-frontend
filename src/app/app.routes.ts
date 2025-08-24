import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        loadComponent: () => import('./pages/dashboard/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'study-plans',
        loadComponent: () => import('./pages/dashboard/study-plans/study-plans.component').then(m => m.StudyPlansComponent)
      },
      {
        path: 'notes',
        loadComponent: () => import('./pages/dashboard/notes/notes.component').then(m => m.NotesComponent)
      },
      {
        path: 'bibliography',
        loadComponent: () => import('./pages/dashboard/bibliography/bibliography.component').then(m => m.BibliographyComponent)
      },
      {
        path: 'files',
        loadComponent: () => import('./pages/dashboard/files/files.component').then(m => m.FilesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/dashboard/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
