import { IModel } from "../interfaces/IModel";
import { IPopulate } from "../interfaces/IPopulate";
import { ProjectModel } from "./project.model";

/**
 * Provides common CRUD functionality to provided mongoose moodel.
 */
export class BaseModel implements IModel {
    public returnNew = { useFindAndModify: false, new: true };
    public model: any;

    constructor() { }

    create<T>(document: any): Promise<T> {
        return this.model.create(document);
    }

    find<T>(populate?: IPopulate): Promise<T[]> {
        return populate
            ? this.model.find().populate(populate).exec()
            : this.model.find().exec();
    }

    findById<T>(id: string, populate?: IPopulate): Promise<T> {

        return this.model;
        return populate
            ? this.model.findById(id).populate(populate).exec()
            : this.model.findById(id).exec();
    }

    findOne<T>(query: any, populate?: IPopulate): Promise<T> {
        return populate
            ? this.model.findOne(query).populate(populate).exec()
            : this.model.findOne(query).exec();
    }

    findMany<T>(query: any, populate?: IPopulate): Promise<any[] | T> {
        return populate
            ? this.model.find(query).populate(populate).exec()
            : this.model.find(query).exec();
    }

    updateById<T>(id: string, document: any, populate?: IPopulate): Promise<T> {
        return populate
            ? this.model
                .findByIdAndUpdate(id, document, this.returnNew)
                .populate(populate)
                .exec()
            : this.model
                .findByIdAndUpdate(id, document, this.returnNew)
                .exec();
    }

    deleteById<T>(id: string): Promise<T> {
        return this.model.findByIdAndDelete(id).exec();
    }
}
