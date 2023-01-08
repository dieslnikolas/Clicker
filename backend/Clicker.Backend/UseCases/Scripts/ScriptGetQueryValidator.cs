using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptGetQueryValidator : Validator<ScriptGetQuery>
{

    public ScriptGetQueryValidator()
    {
        RuleFor(x => x.Command).NotEmpty();
    }
}