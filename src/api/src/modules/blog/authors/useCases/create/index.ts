import { CreateAuthorUseCase } from "./CreateAuthorUseCase";
import { userRepo } from "modules/users/repos";
import { authorRepo } from "../../repos";
import { CreateAuthorController } from "./CreateAuthorController";

const createAuthorUseCase = new CreateAuthorUseCase(
  userRepo, authorRepo
)

// Inject the use case into the controller to create it
const createAuthorController = new CreateAuthorController(
  createAuthorUseCase
)

export {
  // Export instances as lowercase to signify they're instances
  createAuthorUseCase,
  createAuthorController
}