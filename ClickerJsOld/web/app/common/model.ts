/**
 * Model for services
 */
export class Model<T> {

    data: T; // actual result
    validationMessages: string; // validation messages

    // isssucees for easier checking if data is avaliable
    get isSuccess(): boolean {
        return this.validationMessages == null || this.validationMessages == '';
    }
}