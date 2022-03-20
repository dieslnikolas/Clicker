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
Add-Line('    using DataServiceBase.Models;')
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

# get & getbyid

Add-Line('        #region Get and Filter')
Add-Line('')
Add-Line('        /// <inheritdoc />')
Add-Line('        public async Task<IEnumerable<{0}ListModel>> GetAsync(ModuleFilter moduleFilter)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            if (!ConditionalUserRestrictionValidator.HasReadPermission && ConditionalUserRestrictionValidator.ConditionalPermissionForRead is null)')
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to read records.", (int)HttpStatusCode.Unauthorized, null, "ApiError.UnauthorizedOperation");')
Add-Line('            }')
Add-Line('')
Add-Line('            var result = await DbContext.{0}List.ExecuteStoredProcedure(moduleFilter.ProcedureParameters)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .AppendWhere(new CriteriaToExpressionConverter(), ConditionalUserRestrictionValidator.ConditionalPermissionForRead).Cast<{0}List>()' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .ToListAsync();')
Add-Line('')
Add-Line('            return Mapper.Map<IEnumerable<{0}ListModel>>(result);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        }')
Add-Line('')

Add-Line('        #endregion')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
