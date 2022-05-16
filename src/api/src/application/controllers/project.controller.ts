import { Controller } from "../decorators/controller.decorator";
import { BaseController } from "./base.controller";

@Controller("Project")
export class ProjectController extends BaseController {
    constructor() {
        super()
    }


    public test(){
        return `TEST`;
    }
}
