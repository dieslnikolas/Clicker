import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Settings {
    public defaultScriptType = "Powershell";
}