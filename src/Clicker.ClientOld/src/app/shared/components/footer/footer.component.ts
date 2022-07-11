import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../core/services/electron/electron.service';

@Component({
    selector: 'shared-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    
    constructor(private electronService: ElectronService) {}
  
    ngOnInit(): void {
    }

    async openExternal(url: string) {
        this.electronService.remote.shell.openExternal(url);
    }
}
