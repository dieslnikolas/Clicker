using Clicker.Backend.Common.UseCases;

namespace Clicker.Backend.UseCases.Scripts;

public class ScriptDeleteCommandHandler: CommonHandler<ScriptDeleteCommand, ScriptDeleteCommandModel>
{
    public ScriptDeleteCommandHandler(ICommonHandlerContext<ScriptDeleteCommand> context) : base(context)
    {
    }

    public override async Task<ScriptDeleteCommandModel> Handle(ScriptDeleteCommand request, CancellationToken cancellationToken)
    {
        request = request ?? throw new ArgumentNullException(nameof(request));

        return _mapper.Map<ScriptDeleteCommandModel>(new object());
    }
}
