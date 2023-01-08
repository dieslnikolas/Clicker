using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptInsertCommandValidator : Validator<ScriptInsertCommand>
{

    public ScriptInsertCommandValidator()
    {

        RuleFor(x => x.Command).NotEmpty();
    }
}