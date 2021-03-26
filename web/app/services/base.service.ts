import { Injectable } from '@angular/core';

@Injectable()
export class BaseService {

    /**
     * Waiting function, sometimes is just too quick
     */
    wait(ms: number) : Promise<void> {
        return new Promise(res => setTimeout(res, ms));
    } 

    constructor() {
    }
    
}
