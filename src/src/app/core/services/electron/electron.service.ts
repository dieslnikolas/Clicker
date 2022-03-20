import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path'

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  // ELECTRON
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;

  // NODEJS
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;

  // SCRIPT RUNNERS
  powershell;
  bash;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {

    // Conditional imports
    if (this.isElectron) {

      // electron
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('@electron/remote');
      
      // nodejs
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.path = window.require('path');

      // script runners
      this.powershell = window.require('node-powershell');
      this.bash = window.require('node-bash');
      

      // If you want to use a NodeJS 3rd party deps in Renderer process (like @electron/remote),
      // it must be declared in dependencies of both package.json (in root and app folders)
      // If you want to use remote object in renderer process, please set enableRemoteModule to true in main.ts

    }
  }
}
