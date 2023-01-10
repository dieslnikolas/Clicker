using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.Commands.User;

public class UserInsertCommandValidator : Validator<UserInsertCommand>
{
    public UserInsertCommandValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(16);
        
        RuleFor(x => x.Name)
            .NotEmpty()
            .MinimumLength(1)
            .MaximumLength(16);

    }
}