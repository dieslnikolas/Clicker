import { app, remote } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { stringify } from 'querystring';

/**
 * Class for storing and reading settings
 */
export class Settings {

    /**
     * Returns root path for usersettings
     * It depents on OS
     * Mac OS: ~/Library/Application Support/<Your App Name (taken from the name property in package.json)>
     * Windows: C:\Users\<you>\AppData\Local\<Your App Name>
     * Linux: ~/.config/<Your App Name>
     */
    private get UserDataPath(): string {
        var rootDataFolder = (app || remote.app).getPath('userData');
        return path.join(rootDataFolder, 'config.json')
    }

    /**
     * Holds project settings
     */
    private data: any

    constructor() {
            this.data = JSON.parse(this.UserDataPath);
    }

    /**
     * Read settings
     * @param key Settings key
     */
    public ReadSettings(key: string): any {
        return this.data[key];
    }

    /**
     * Set settings
     * @param key Key
     * @param value New value
     */
    public SetSettings(key: string, value: any) {
        this.data[key] = value;

        // rewrite whole settings file
        fs.writeFile(this.UserDataPath, stringify(this.data), function (error) {
            // ERROR
            console.log('Cant write to ' + this.UserDataPath);
        });
    }

}