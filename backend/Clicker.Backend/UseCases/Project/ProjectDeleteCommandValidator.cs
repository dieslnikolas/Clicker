using Clicker.Backend.Common.Validations;
using FluentValidation;

namespace Clicker.Backend.UseCases.Project;

public class ProjectDeleteCommandValidator : Validator<ProjectDeleteCommand>
{
    public ProjectDeleteCommandValidator()
    {
      
    }
}