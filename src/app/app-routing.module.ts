import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteListComponent } from './note-list/note-list.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NoteDetailsComponent } from './note-details/note-details.component';

const routes: Routes = [
  {path:'' ,component :MainLayoutComponent , children:[
    {path:'',component:NoteListComponent},
    { path: 'new', component:NoteDetailsComponent },
    { path: 'note/:id', component:NoteDetailsComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
