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
Add-Line('    using Models.{0}.Input;' -f $data.Metadata.Name)
Add-Line('    using Models.{0}.Output;' -f $data.Metadata.Name)
Add-Line('    using System;')
Add-Line('    using System.Net;')
Add-Line('    using System.Threading.Tasks;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Manage {0}' -f $lowerPluralName)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Service : BaseService<{0}>, I{0}Service' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('    {')


# Create

Add-Line('')
Add-Line('        #region Create')
Add-Line('')
Add-Line('        public async Task<Guid> CreateAsync(Input{0}ModuleModel inputModel)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        {')
Add-Line('            if (!ConditionalUserRestrictionValidator.HasInsertPermission && ConditionalUserRestrictionValidator.ConditionalPermissionForNew is null)')
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to insert records.", (int)HttpStatusCode.Unauthorized, null, "ApiError.UnauthorizedOperation");')
Add-Line('            }')
Add-Line('')
Add-Line('            if (inputModel.{0} == null)' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            {')
Add-Line('                throw new ApiException("Invalid model.", errorCode: "IT2021.CodelistDataService.Services.{0}Service.{0}IsRequired");' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            }')
Add-Line('')
Add-Line('            if (Utils.ValidateObjectPermission(inputModel, ConditionalUserRestrictionValidator.ConditionalPermissionForNew))')
Add-Line('            {')
Add-Line('                throw new ApiException("Unauthorized user to insert records.", (int)HttpStatusCode.Unauthorized, null,')
Add-Line('                    "ApiError.UnauthorizedOperation");')
Add-Line('            }')
Add-Line('')
Add-Line('            // Fetch data to DB model')
Add-Line('            var {1}Entity = Mapper.Map<{0}>(inputModel.{0});' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('            // TODO: fill with update methods')
Add-Line('')
Add-Line('            // Validate model')
Add-Line('            await CheckErrorsAsync(inputModel, {1}Entity);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('')
Add-Line('            try')
Add-Line('            {')
Add-Line('                await DbContext.AddAsync({1}Entity);' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('                await DbContext.SaveChangesAsync();')
Add-Line('            }')
Add-Line('            catch (Exception e)')
Add-Line('            {')
Add-Line('                throw new ApiException(e.InnerException?.Message ?? e.Message, errorCode: "ApiError.InsertError");')
Add-Line('            }')
Add-Line('')
Add-Line('            return {1}Entity.{0}Id;' -f $data.Metadata.Name, $lowerName, $lowerPluralName)
Add-Line('        }')
Add-Line('')
Add-Line('        #endregion')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
