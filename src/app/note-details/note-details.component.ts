import { Component, OnInit } from '@angular/core';
import { Note } from '../shared/Note.model';
import { NgForm } from '@angular/forms';
import { NotesService } from '../shared/notes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-note-details',
  templateUrl: './note-details.component.html',
  styleUrl: './note-details.component.css'
})
export class NoteDetailsComponent implements OnInit {
  note :Note = new Note;
  noteId !: number ;
  new !: boolean ;

  constructor(private notesService :NotesService , private router :Router , private route :ActivatedRoute){}

  ngOnInit(): void {
    this.note.title=' ' ;
    this.note.body=' ' ;

     // we want find out if we are creating a new note or editing an existing one
    this.route.params.subscribe((params:Params) => {
      if (params['id']){
        this.noteId=+params['id'];
        this.note =this.notesService.get(this.noteId);
        this.new =false ;
      }else{
        this.new=true;
      }
      
    })


    
  }

  onSubmit(form:NgForm):void{

    if (this.new){
      this.notesService.add(form.value);
      this.router.navigateByUrl('/');
    } else{
      this.notesService.update(this.noteId,form.value.title,form.value.body);
      this.router.navigateByUrl('/')
    }
   
}

cancel(){
  this.router.navigateByUrl('/');
  
}
}
