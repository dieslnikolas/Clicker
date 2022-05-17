import { Result } from "core/Result";
import { DomainError } from "core/DomainErrror";

export namespace CreateAuthorErrors {

  export class AuthorExistsError extends Result<DomainError> {
    constructor () {
      super(false, {
        message: `Author already exists`
      } as DomainError)
    }
  }

  export class UserNotYetCreatedError extends Result<DomainError> {
    constructor () {
      super(false, {
        message: `Need to create the user account first`
      } as DomainError)
    }
  }

}