import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame } from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path'
import * as fse from 'fs-extra';


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
  fse: typeof fse;
  path: typeof path;

  /**
   * If application si running in electron container
   */
  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  /**
   * If platform is windows
   */
  get isWindows(): boolean {
    return this.remote.process.platform === 'win32'; // valid even for 64bit
  }

  /**
   * If platform is mac
   */
  get isMac() : boolean {
    return this.remote.process.platform === 'darwin';
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
      this.fse = window.require('fs-extra')
      this.path = window.require('path');

      // If you want to use a NodeJS 3rd party deps in Renderer process (like @electron/remote),
      // it must be declared in dependencies of both package.json (in root and app folders)
      // If you want to use remote object in renderer process, please set enableRemoteModule to true in main.ts

    }
  }
}
