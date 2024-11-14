import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'loop',
    loadComponent: () => import('@drum-n-js/loop').then(c => c.LoopComponent),
    title: 'Basic loop',
  },
  {
    path: 'loop-with-effects',
    loadComponent: () => import('@drum-n-js/loop-with-effects').then(c => c.LoopWithEffectsComponent),
    title: 'Loop with effects',
  },
  { path: '', redirectTo: '/loop', pathMatch: 'full' }
];
