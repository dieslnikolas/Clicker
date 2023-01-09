using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Module;

public class ModuleDeleteCommandValidator : Validator<ModuleDeleteCommand>
{
    public ModuleDeleteCommandValidator()
    {
      
    }
}