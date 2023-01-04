using Clicker.Backend.Common.UseCases;
using Clicker.Backend.Repositories.Project;

namespace Clicker.Backend.UseCases.Scripts;

public class CommandGetHandler: CommonHandler<ScriptGetQuery, ScriptGetModel>
{
    private readonly IProjectRepository _projectRepository;

    public CommandGetHandler(ICommonHandlerContext<ScriptGetQuery> context, IProjectRepository projectRepository) : base(context)
    {
        _projectRepository = projectRepository;
    }

    public override async Task<ScriptGetModel> Handle(ScriptGetQuery request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var result = await _projectRepository.Get(request.Command);

        return _mapper.Map<ScriptGetModel>(result);
    }
}
