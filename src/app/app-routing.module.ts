import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnalyserComponent } from './analyser/analyser.component';


const routes: Routes = [
  { path: 'analyser', component: AnalyserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
