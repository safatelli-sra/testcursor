import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { RolesPermissions } from './features/roles-permissions/roles-permissions';
import { CompetitorStores } from './features/stores/competitor-stores';
import { TourPlanning } from './features/tour-planning/tour-planning';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'roles-permissions', component: RolesPermissions },
      { path: 'competitor-stores', component: CompetitorStores },
      { path: 'tour-planning', component: TourPlanning },
    ],
  },
];
