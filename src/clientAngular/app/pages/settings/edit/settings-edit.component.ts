import { Component, OnInit } from '@angular/core';
import { LogService } from '../../../core/services/logger/log.service';
import { ProjectService } from '../../../core/services/project/project.service';

@Component({
    selector: 'app-settings-edit',
    templateUrl: './settings-edit.component.html',
    styleUrls: ['./settings-edit.component.scss']
})
export class SettingsEditComponent implements OnInit {

    public data: [string, any][];

    constructor(private logService: LogService, private projectService: ProjectService) { }

    ngOnInit(): void {
        this.data = Object.entries(this.projectService.settings);
        this.projectService.projectLoaded.subscribe(() => {
            this.logService.write("Settings loaded");
            setTimeout(() => this.data = Object.entries(this.projectService.settings), 100);
        })
    }

    async removeItem(item) {

        if (!confirm('Are you sure?'))
            return;

        let i = this.data.findIndex((e) => e[0] == item[0]);
        this.data.splice(i);
    }

    async addNewItem() {
        this.data.push(['key', 'value'])
    }

    async save() {
        let reversed = this.data
            .map(([t, r]) => ({ [t]: r }))
            .reduce((pv, cv) => {
                return Object.assign(pv, cv)
            });

        this.projectService.settings = reversed;
        await this.projectService.save(null);
        await this.projectService.load(null);
        // ROUTER "/"
    }
}
