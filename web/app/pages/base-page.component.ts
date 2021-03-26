import { Component, OnInit } from '@angular/core';
import { Model } from '../common/model'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injector } from '@angular/core';

@Component({
    selector: 'app-basepage',
    template: '',
    styles: []
})
export class BasePage<T> implements IPage<T>, OnInit {

    /**
     * Container for page result
     */
    private pageResult: PageResult<T>

    protected _matSnackBar: MatSnackBar;
    // protected _matSnackBar: MatSnackBar;

    constructor() {

        // manualy handle injection for base class 
        const injector = BasePageInjector.getInjector();

        // services
        this._matSnackBar = injector.get(MatSnackBar);
        // this._matSnackBar = injector.get(MatSnackBar);

        // create empty page result
        this.pageResult = new PageResult<T>();
    }

    /**
     * Page model bag - not for view though
     */
    protected get pageModel(): Model<T> {
        return this.pageResult.model;
    }

    /**
     * Current validation status
     */
    get validationMessages(): string {
        return this.pageResult?.model?.validationMessages
    }

    /**
     * Page model
     */
    get model(): T {
        return this.pageResult?.model?.data;
    }

    /**
     * Sets tje model
     * @param model New model
     */
    setModel(model: T) {
        let modelBag = new Model<T>();
        modelBag.data = model;
        this.pageResult.model = modelBag;
    }

    /**
     * Runs on every page initialisation
     */
    ngOnInit() {
        this.build()  // getter for page data
    }

    /**
     * 
     * @returns Model for current shown page
     */
    build(): T {
        console.log('GET');
        return this.model;
    }

    /**
     * 
     * @param model Runs a service with page
     */
    handle() {
        console.log('POST');

        this.showValidation(this.validationMessages);
        this.showNotification(this.validationMessages);
    }

    /**
     * Show page validations after send
     */
    showNotification(message: string) {
        this._matSnackBar.open('SUCCESS: ' + message, null, {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            politeness: 'assertive',
            panelClass: 'snackbar-notification'
        });
    }

    /**
     * Show page validations after send
     */
     showValidation(message: string) {
        this._matSnackBar.open('WARNING: ' + message, null, {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            politeness: 'assertive',
            panelClass: 'snackbar-validation'
        });
    }

}

/**
 * Interface for pages
 */
export interface IPage<T> {
    build(): T
    handle();
    showValidation(message: string);
    showNotification(message: string);
}

/**
 * Model and metadata for this page
 */
export class PageResult<T> {

    public model: Model<T>;
    constructor() { }
}


export class BasePageInjector {

    /**
     * Injector instance
     */
    private static injector: Injector;

    /**
     * 
     * @param injector Set new injector
     */
    static setInjector(injector: Injector) {
        BasePageInjector.injector = injector;
    }

    /**
     * 
     * @returns Injector
     */
    static getInjector(): Injector {
        return BasePageInjector.injector;
    }

}