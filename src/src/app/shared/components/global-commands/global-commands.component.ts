import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'shared-global-commands',
  templateUrl: './global-commands.component.html',
  styleUrls: ['./global-commands.component.css']
})
export class GlobalCommandsComponent {

  constructor() {}

  ngOnInit(): void {
    console.log('GlobalCommandsComponent INIT');
  }

}
