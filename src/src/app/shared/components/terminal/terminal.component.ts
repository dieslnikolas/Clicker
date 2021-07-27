import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgTerminal } from 'ng-terminal';

@Component({
  selector: 'shared-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit, AfterViewInit {
  @ViewChild('term', { static: true }) xTermJS: NgTerminal;
  
  panelOpenState: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log('TerminalComponent INIT');
  }

  ngAfterViewInit(){
    this.xTermJS.keyEventInput.subscribe(e => {
      console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);

      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

      if (ev.keyCode === 13) {
        this.xTermJS.write('\r\n$ ');
      } else if (ev.keyCode === 8) {
        if (this.xTermJS.underlying.buffer.active.cursorX > 2) {
          this.xTermJS.write('\b \b');
        }
      } else if (printable) {
        this.xTermJS.write(e.key);
      }
    })

    // initial terminal name
    this.write('Terminal');
  }


  write(message: string) {
    this.xTermJS.write(message);
    this.xTermJS.write('\r\n$ ')
  }
}
