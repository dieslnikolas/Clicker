using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.User;

public class UserEditCommandValidator : Validator<UserEditCommand>
{
    public UserEditCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty();
    }
}