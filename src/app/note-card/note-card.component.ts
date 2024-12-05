import { Component, AfterViewInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css'],
})
export class NoteCardComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() body: string = '';
  @Input() link :string='';

  @Output('delete') deletEvent : EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator', { static: false }) truncator!: ElementRef<HTMLElement>;
  @ViewChild('bodyText', { static: false }) bodyText!: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const bodyHeight = this.bodyText.nativeElement.offsetHeight;
    const scrollHeight = this.bodyText.nativeElement.scrollHeight;

    if (scrollHeight > bodyHeight) {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
    } else {
      this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
    }
  }
  onButtonClick(){
    this.deletEvent.emit();


  }

}
