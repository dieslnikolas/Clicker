import { CreateAuthorUseCase } from "./CreateAuthorUseCase";
import { AppError } from "core/AppError";
import { CreateAuthorErrors } from "./CreateAuthorErrors";

export class CreateAuthorController extends BaseController {
  private useCase: CreateAuthorUseCase;

  constructor (useCase: CreateAuthorUseCase) {
    super();
    this.useCase = useCase;
  }

  public async executeImpl (): Promise<any> {
    const req = this.req as DecodedExpressRequest;
    const { userId } = req.decoded;
    try {
      const result = await this.useCase.execute({ userId });

      if (result.isLeft()) {
        const error = result.value;

        // Based on the error, map to the appropriate HTTP code
        switch (error.constructor) {
          case CreateAuthorErrors.AuthorExistsError:
            return this.notFound(error.errorValue().message)
          case CreateAuthorErrors.UserNotYetCreatedError:
            return this.fail(error.errorValue().message)
          case AppError.UnexpectedError:
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.ok<void>(this.res);
      }
    } catch (err) {
      console.log(err);
      return this.fail("Something went wrong on our end.")
    }
  }
}