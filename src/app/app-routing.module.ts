import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'feed',
    children: [
      {
        path: ':id',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      }
    ]
  },
  {
    path: 'watch',
    children: [
      {
        path: ':id',
        loadChildren: () => import('./watch/watch.module').then(m => m.WatchPageModule)
      }
    ]
  },
  {
    path: 'watch',
    loadChildren: () => import('./watch/watch.module').then(m => m.WatchPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
