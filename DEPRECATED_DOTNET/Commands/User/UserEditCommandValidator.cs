using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.User;

public class UserEditCommandValidator : ValidatorBase<UserEditCommand>
{
    public UserEditCommandValidator()
    {
        RuleFor(x => x.LastProject)
            .NotEmpty();
    }
}