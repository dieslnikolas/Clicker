using Clicker.Backend.Common.UseCases;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptUpdateCommandHandler: CommonHandler<ScriptUpdateCommand, ScriptUpdateCommandModel>
{

    public ScriptUpdateCommandHandler(ICommonHandlerContext<ScriptUpdateCommand> context) : base(context)
    {
    }

    public override async Task<ScriptUpdateCommandModel> Handle(ScriptUpdateCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        var result = new object(); // await _projectRepository.Update(request);

        return _mapper.Map<ScriptUpdateCommandModel>(result);
    }
}
