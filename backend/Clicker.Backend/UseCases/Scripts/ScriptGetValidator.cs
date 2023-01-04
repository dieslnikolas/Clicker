using Clicker.Backend.Common.Validations;
using Clicker.Backend.Repositories.Project;
using FluentValidation;

namespace Clicker.Backend.UseCases.Scripts;

public class CommandGetValidatorBase : ValidatorBase<ScriptGetQuery>
{
    private readonly IProjectRepository _projectService;

    public CommandGetValidatorBase(IProjectRepository projectService)
    {
        _projectService = projectService;

        RuleFor(x => x.Command).NotEmpty();
    }
}