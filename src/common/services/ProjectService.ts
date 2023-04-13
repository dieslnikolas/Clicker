import {BaseService} from "./BaseService";

export class ProjectService extends BaseService {

    constructor() {
        super();
    }

    public async open(input: ProjectOpenRequest): Promise<ProjectOpenResponse> {
        return this.client.get(`Project/Open?path=${input.path}&key=${input.key}`);
    }

    public async create(input: ProjectPostRequest): Promise<ProjectPostResponse> {
        return this.client.post(`Project`, input);
    }

    public async edit(input: ProjectEditRequest): Promise<ProjectEditResponse> {
        return this.client.patch(`Project`, input, {
            headers: {'Authorization': this.bearerAuth()}
        })
    }

    public async delete(input: ProjectDeleteRequest) : Promise<ProjectDeleteResponse> {
        return this.client.delete(`/Project`, {
            headers: {'Authorization': this.bearerAuth()}
        })
    }

    public async get(input: ProjectDetailRequest) : Promise<ProjectDetailResponse> {
        return this.client.get(`Project`, {
            headers: {'Authorization': this.bearerAuth()}
        })
    }

}


export class ProjectPostRequest {
    id: string | undefined;
    author: string | undefined;
    path: string | undefined;
    key: string | undefined
}

export class ProjectPostResponse {
    jwt: string | undefined
}

export class ProjectOpenRequest {
    path: string | undefined;
    key: string | undefined
}

export class ProjectOpenResponse {
    jwt: string | undefined
}

export class ProjectDetailRequest {
}

export class ProjectDetailResponse {
    id: string | undefined;
    author: string | undefined;
    version: string | undefined;
    scripts: any
}

export class ProjectEditRequest {
    id: string | undefined;
    author: string | undefined;
    version: string | undefined
}

export class ProjectEditResponse {
}

export class ProjectDeleteRequest {
}

export class ProjectDeleteResponse {
}