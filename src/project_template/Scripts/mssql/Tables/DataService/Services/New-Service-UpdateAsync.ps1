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
Add-Line('    using Microsoft.EntityFrameworkCore;')
Add-Line('    using Models.{0}.Input;' -f $data.Metadata.Name)
Add-Line('    using System;')
Add-Line('    using System.Net;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Manage {0}' -f $lowerPluralName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Service : BaseService<{0}>, I{0}Service' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('    {')

# region Update

Add-Line('        #region Update')
Add-Line('')
Add-Line('        public async Task UpdateAsync(Guid id, Input{0}ModuleModel inputModel)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            if (!ConditionalUserRestrictionValidator.HasUpdatePermission && ConditionalUserRestrictionValidator.ConditionalPermissionForNew is null)')
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to update records.", (int)HttpStatusCode.Unauthorized, null, "ApiError.UnauthorizedOperation");')
Add-Line('            }')
Add-Line('')
Add-Line('            var {1}Entity = await DbContext.{0}.FirstOrDefaultAsync(i => (!i.Deleted) && i.{0}Id == id);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            if ({1}Entity is null)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                throw new ApiException("Record Not Found", (int)HttpStatusCode.NotFound, null, "ApiError.RecordNotFound");')
Add-Line('            }')
Add-Line('')
Add-Line('            if (Utils.ValidateObjectPermission({1}Entity, ConditionalUserRestrictionValidator.ConditionalPermissionForChange))' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to update records.", (int)HttpStatusCode.Unauthorized, null,')
Add-Line('                    "ApiError.UnauthorizedOperation");')
Add-Line('            }')
Add-Line('')
Add-Line('            if (inputModel.{0} != null)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                // Fetch data to DB model')
Add-Line('                {1}Entity = Mapper.Map<{0}>(inputModel.{0});' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                // TODO: fill with update methods')
Add-Line('')
Add-Line('                // Validate model')
Add-Line('                await CheckErrorsAsync(inputModel, {1}Entity);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('')
Add-Line('')
Add-Line('            try')
Add-Line('            {')
Add-Line('                DbContext.Update({1}Entity);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                await DbContext.SaveChangesAsync();')
Add-Line('            }')
Add-Line('            catch (Exception e)')
Add-Line('            {')
Add-Line('                throw new ApiException(e.InnerException?.Message ?? e.Message, errorCode: "ApiError.UpdateError");')
Add-Line('            }')
Add-Line('        }')
Add-Line('')
Add-Line('        #endregion')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
