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
Add-Line('    using {0}.Entities;' -f $data.Metadata.DataLayerNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using DevExpress.Data.Linq;')
Add-Line('    using DevExpress.Data.Linq.Helpers;')
Add-Line('    using Microsoft.EntityFrameworkCore;')
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

# GetHistody
Add-Line('        /// <inheritdoc />')
Add-Line('        public async Task<IEnumerable<ApiClientBase.Models.OutputHistoryModel>> GetHistoryAsync(Guid id, Guid languageId)')
Add-Line('        {')
Add-Line('            if (!ConditionalUserRestrictionValidator.HasReadPermission && ConditionalUserRestrictionValidator.ConditionalPermissionForRead is null)')
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to read records.", (int)HttpStatusCode.Unauthorized);')
Add-Line('            }')
Add-Line('')
Add-Line('            var {1}Entity = await DbContext.{0}' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .AsNoTracking()')
Add-Line('                .AppendWhere(new CriteriaToExpressionConverter(),')
Add-Line('                    ConditionalUserRestrictionValidator.ConditionalPermissionForRead).Cast<{0}>()' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                .FirstOrDefaultAsync(i => i.{0}Id == id);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            if ({1}Entity is null)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                throw new ApiException("Record Not Found", (int)HttpStatusCode.NotFound, null, "ApiError.RecordNotFound");')
Add-Line('            }')
Add-Line('')
Add-Line('            var historyModelList = await AddIncludesHistoryAsync({1}Entity, languageId);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            return historyModelList.OrderByDescending(i => i.Created);')
Add-Line('        }')
Add-Line('')

## Historie pro includy
Add-Line('        /// <inheritdoc />')
Add-Line('        private async Task<IEnumerable<ApiClientBase.Models.OutputHistoryModel>> AddIncludesHistoryAsync({0} {1}, Guid languageId)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('            if ({1} is null)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                return new List<ApiClientBase.Models.OutputHistoryModel>();')
Add-Line('            }')
Add-Line('')
Add-Line('            var historyList = new List<ApiClientBase.Models.OutputHistoryModel>();')
Add-Line('')
Add-Line('            // object')
Add-Line('            historyList.AddRange(await historyService.GetRecordHistoryAsync({1}, {1}.{0}Id, languageId, new HistoryRowName(nameof({0}))));' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            // list')
Add-Line('            // foreach (var item in {1}.Items)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            // {')
Add-Line('            //    historyList.AddRange(await historyService.GetRecordHistoryAsync(item, item.ItemId, languageId, new HistoryRowName(nameof(Item))));')
Add-Line('            // }')
Add-Line('')
Add-Line('            return historyList;')
Add-Line('            }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
