import { Component, ElementRef, OnInit, Query, ViewChild } from '@angular/core';
import { Note } from '../shared/Note.model';
import { NotesService } from '../shared/notes.service';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
  animations: [
    trigger('itemAnim', [
      transition('void => *', [
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.9)',
          'margin-bottom': 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
        }),
        animate('100ms ease-out', style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*',
        })),
        animate('150ms ease-out', style({
          opacity: 1,
          transform: 'scale(1)',
        })),
      ]),
      transition('* => void', [
        animate('100ms ease-in', style({
          transform: 'scale(0.9)',
          opacity: 0.5,
        })),
        animate('150ms ease-in', style({
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          paddingRight: 0,
          'margin-bottom': 0,
        })),
      ]),
    ]),
    trigger('listAnim', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(50, animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class NoteListComponent implements OnInit {
  notes: Note[] = new Array<Note>();
  filteredNotes :Note[]=new Array<Note>();

  @ViewChild('filterInput', { static: false }) filterInputElRef!: ElementRef<HTMLInputElement>;


  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.notes = this.notesService.getAll();
    this.filter('');
  }

  deleteNote(note :Note): void {
    let noteId=this.notesService.getId(note);
    this.notesService.delete(noteId);
    this.filter(this.filterInputElRef.nativeElement.value);
  }
  generateNoteUrl(note:Note) :string{
    let noteId =this.notesService.getId(note);
    return '/notes/${note.id}';
  }

  filter(Query :string='') {
     Query = Query.toLowerCase().trim();
     


    let allResults: Note[] = new Array<Note>();
    
    let terms: string[] = Query.split(' ');
   
    terms = this.removeDuplicates(terms);
    
    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
     
      allResults = [...allResults, ...results]
    });

    let uniqueResults = this.removeDuplicates(allResults);
    this.filteredNotes = uniqueResults;

    
    this.sortByRelevancy(allResults);
  }

  removeDuplicates(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    arr.forEach(e => uniqueResults.add(e));

    return Array.from(uniqueResults);
  }

  relevantNotes(query: string) : Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if (note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if (note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    })

    return relevantNotes;
  }

  sortByRelevancy(searchResults: Note[]) {
    
  
    let noteCountObj: { [key: string]: number } = {}; 
  
    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note); 
  
      if (noteCountObj[noteId]) {
        noteCountObj[noteId] += 1;
      } else {
        noteCountObj[noteId] = 1; 
      }
    });
  
    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a);
      let bId = this.notesService.getId(b);
  
      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];
  
      return bCount - aCount;
    });
  }
  

}