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
    title: 'Effects',
  },
  {
    path: 'loop-with-visualizer',
    loadComponent: () => import('@drum-n-js/loop-with-visualizer').then(c => c.LoopWithVisualizerComponent),
    title: 'Visualizer',
  },
  {
    path: 'oscillator',
    loadComponent: () => import('@drum-n-js/oscillator').then(c => c.OscillatorComponent),
    title: 'Oscillator',
  },
  { path: '', redirectTo: '/loop', pathMatch: 'full' }
];
