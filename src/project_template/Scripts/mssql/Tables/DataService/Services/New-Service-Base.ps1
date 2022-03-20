param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

$lowerName = [Regex]::Replace($data.Metadata.Name , '\b.', {  $args[0].Value.Tolower() })
$lowerPluralName = [Regex]::Replace($data.Metadata.PluralName , '\b.', {  $args[0].Value.Tolower() })

# hlavicka
Add-Line('namespace {0}.Services' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('{')

# usingy

Add-Line('    using ApiFoundations.Wrappers;')
Add-Line('    using AutoMapper;')
Add-Line('    using {0};' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using {0}.Entities;' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using {0}.Entities.Procedures;' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using DataServiceBase;')
Add-Line('    using DataServiceBase.Extensions;')
Add-Line('    using DataServiceBase.Validators;')
Add-Line('    using DevExpress.Data.Filtering;')
Add-Line('    using DevExpress.Data.Linq;')
Add-Line('    using DevExpress.Data.Linq.Helpers;')
Add-Line('    using LoggerFactory;')
Add-Line('    using Microsoft.EntityFrameworkCore;')
Add-Line('    using Models;')
Add-Line('    using Models.{0};' -f $data.Metadata.Name)
Add-Line('    using Models.{0}.Input;' -f $data.Metadata.Name)
Add-Line('    using Models.{0}.Output;' -f $data.Metadata.Name)
Add-Line('    using ModuleIncludes;')
Add-Line('    using System;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Linq;')
Add-Line('    using System.Net;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Manage {0}' -f $lowerPluralName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Service : BaseService<{0}>, I{0}Service' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('    {')

# service
Add-Line('    // Autocomplete service')
Add-Line('    private readonly IAutoCompleteService autoCompleteService;')
Add-Line('    // History service')
Add-Line('    private readonly IHistoryService historyService;')
Add-Line('    // Codelist client')
Add-Line('    private readonly CodelistDataService.ApiClient.ICodelistClient codelistClient;')

# constructor

Add-Line('        public {0}Service(' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            IMapper mapper,')
Add-Line('            IDbContext dbContext,')
Add-Line('            IBaseDbContext baseDbContext,')
Add-Line('            IMemoryCacheService memoryCacheService,')
Add-Line('            ICurrentUserAccessor<CurrentUserModel> currentUserAccessor,')
Add-Line('            INLoggerFactory loggerFactory,')
Add-Line('            IConditionalUserRestrictionValidator<{0}> conditionalUserRestrictionValidator,' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            IAutoCompleteService autoCompleteService,')
Add-Line('            IHistoryService historyService,')
Add-Line('            CodelistDataService.ApiClient.ICodelistClient codelistClient)')
Add-Line('            : base(mapper, dbContext, baseDbContext, memoryCacheService, loggerFactory, currentUserAccessor, conditionalUserRestrictionValidator)')
Add-Line('        {')
Add-Line('              this.autoCompleteService = autoCompleteService ?? throw new ArgumentNullException(nameof(autoCompleteService));')
Add-Line('              this.historyService = historyService ?? throw new ArgumentNullException(nameof(historyService));')
Add-Line('              this.codelistClient = codelistClient ?? throw new ArgumentException(nameof(codelistClient));')
Add-Line('        }')
Add-Line('')


# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
