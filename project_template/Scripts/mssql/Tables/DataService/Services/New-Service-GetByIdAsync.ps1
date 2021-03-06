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
Add-Line('    using CommonLogic;')
Add-Line('    using {0}.Entities;' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using DataServiceBase.Models;')
Add-Line('    using DevExpress.Data.Linq;')
Add-Line('    using DevExpress.Data.Linq.Helpers;')
Add-Line('    using Microsoft.EntityFrameworkCore;')
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
Add-Line('        public async Task<Output{0}ModuleModel> GetByIdAsync(Guid id, ISet<{0}ModuleInclude> collectionsToInclude, bool isCopy, Guid languageId)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            if (!ConditionalUserRestrictionValidator.HasReadPermission && ConditionalUserRestrictionValidator.ConditionalPermissionForRead is null)')
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to read records.", (int)HttpStatusCode.Unauthorized);')
Add-Line('            }')
Add-Line('')
Add-Line('            var outputResult = new Output{0}ModuleModel();' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            if (collectionsToInclude is null)')
Add-Line('            {')
Add-Line('                return outputResult;')
Add-Line('            }')
Add-Line('')
Add-Line('            if (collectionsToInclude.Contains({0}ModuleInclude.{0}))' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                outputResult.{0} = await Get{0}Async(id, languageId, isCopy);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('')
Add-Line('            return outputResult;')
Add-Line('        }')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public async Task<Output{0}ModuleModel> GetDeletedByIdAsync(Guid id, ISet<{0}ModuleInclude> collectionsToInclude, Guid languageId)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            if (!ConditionalUserRestrictionValidator.HasReadPermission && ConditionalUserRestrictionValidator.ConditionalPermissionForRead is null)')
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to read records.", (int)HttpStatusCode.Unauthorized);')
Add-Line('            }')
Add-Line('')
Add-Line('            var outputResult = new Output{0}ModuleModel();' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            if (collectionsToInclude is null)')
Add-Line('            {')
Add-Line('                return outputResult;')
Add-Line('            }')
Add-Line('')
Add-Line('            var {1} = await DbContext.{0}.AsNoTracking()' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .AppendWhere(new CriteriaToExpressionConverter(), ConditionalUserRestrictionValidator.ConditionalPermissionForRead).Cast<{0}>()' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .FirstOrDefaultAsync(i => i.{0}Id == id);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            if ({1} is null)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                throw new ApiException("Record Not Found", (int)HttpStatusCode.NotFound, null, "ApiError.RecordNotFound");')
Add-Line('            }')
Add-Line('')
Add-Line('            if (collectionsToInclude.Contains({0}ModuleInclude.{0}))' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                outputResult.{0} = Mapper.Map<Output{0}Model>({1});' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('')
Add-Line('            return outputResult;')
Add-Line('        }')
Add-Line('')
Add-Line('        #endregion')
Add-Line('')

# get

Add-Line('        /// <summary>')
Add-Line('        /// Get {1}' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        /// </summary>')
Add-Line('        private async Task<Output{0}Model> Get{0}Async(Guid {1}Id, Guid languageId, bool isDeleted = false)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            var {1} = await DbContext.{0}' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .AsNoTracking()')
Add-Line('                .AppendWhere(new CriteriaToExpressionConverter(),')
Add-Line('                    ConditionalUserRestrictionValidator.ConditionalPermissionForRead).Cast<{0}>()' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .FirstOrDefaultAsync(i => i.{0}Id == {1}Id && (isDeleted || !i.Deleted));' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            if ({1} == null)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                throw new ApiException("Record Not Found", (int) HttpStatusCode.NotFound, null,')
Add-Line('                    "ApiError.RecordNotFound");')
Add-Line('            }')
Add-Line('')
Add-Line('            var {1}Model = Mapper.Map<Output{0}Model>({1});' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            // Autocomplete')
Add-Line('            // Customers')
Add-Line('            if ({1}Model.CustomerId.HasValue)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                 var customerFilter = AutoCompleteFilter.CustomerByIds(languageId, new Guid[] {{ {1}Model.CustomerId.Value }});' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                 {1}Model.Customers = await autoCompleteService.GetCustomerAutoCompleteAsync(new ModuleFilter(customerFilter));' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('')
Add-Line('            return {1}Model;' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
