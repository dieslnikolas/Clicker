import { UseCase } from "core/UseCase";
import { Either, Result, left, right } from "core/Result";
import { CreateAuthorErrors } from "./CreateAuthorErrors";
import { AppError } from "core/AppError";
import { IUserRepo } from "modules/users/repos/UserRepo";
import { IAuthorRepo } from "../../repos/AuthorRepo";
import { Author } from "../../domain/Author";

// All we need to execute this is a userId: string.

interface Request {
  userId: string;
}

// The response is going to be either one of these
// failure states, or a Result<void> if successful.

type Response = Either<
  CreateAuthorErrors.AuthorExistsError |
  CreateAuthorErrors.UserNotYetCreatedError |
  AppError.UnexpectedError,
  Result<any>
>

export class CreateAuthorUseCase implements UseCase<Request, Promise<Response>> {

  // This use case relies on an IUserRepo and an IAuthorRepo to work
  private userRepo: IUserRepo;
  private authorRepo: IAuthorRepo;

  public constructor (userRepo: IUserRepo, authorRepo: IAuthorRepo) {
    this.userRepo = userRepo;
    this.authorRepo = authorRepo;
  }

  public async execute (req: Request): Promise<Response> {
    const { userId } = req;

    const user = await this.userRepo.getUserById(userId);
    const userExists = !!user;

    // If the user doesn't exist yet, we can't make them an author
    if (!userExists) {
      return left(
        new CreateAuthorErrors.UserNotYetCreatedError()
      ) as Response;
    }

    // If the user was already made an author, we can return a failed result.
    const alreadyCreatedAuthor = await this.authorRepo
      .getAuthorByUserId(user.userId);

    if (alreadyCreatedAuthor) {
      return left(
        new CreateAuthorErrors.AuthorExistsError()
      ) as Response;
    }

    // If validation logic fails to create an author, we can return a failed result
    const authorOrError: Result<Author> = Author
      .create({ userId: user.userId });

    if (authorOrError.isFailure) {
      return left(
        new AppError.UnexpectedError(authorOrError.error)
      ) as Response;
    }


    // Save the author to the repo
    const author = authorOrError.getValue();
    await this.authorRepo.save(author);

    // Successfully created the author
    return right(Result.ok<void>()) as Response;
  }
}