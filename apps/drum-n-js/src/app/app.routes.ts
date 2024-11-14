import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'loop',
    loadComponent: () => import('@drum-n-js/loop').then(c => c.LoopComponent),
    title: 'Basic loop',
  },
  {
    path: 'loop-with-effects',
    loadComponent: () => import('libs/loop-with-effects/src').then(c => c.LoopWithEffectsComponent),
    title: 'Adding effects',
  },
  {
    path: 'loop-with-visualizer',
    loadComponent: () => import('libs/loop-with-visualizer/src').then(c => c.LoopWithVisualizerComponent),
    title: 'Adding visualizer',
  },
  { path: '', redirectTo: '/loop', pathMatch: 'full' }
];
