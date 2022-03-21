param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.ViewModels.{2}' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    using {0}.ApiClient.Advanced;' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using ApiClientBase.Models;')
Add-Line('    using System.Collections.Generic;')

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Specification for view model {0}' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    public interface I{1}{0}ParentDetailViewModel : IParentDetailViewModel, IParentHistoryViewModel<OutputHistoryModel>' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        /// <summary>')
Add-Line('        /// Fill model and backup model')
Add-Line('        /// </summary>')
Add-Line('        /// <param name="result"></param>')
Add-Line('        /// <param name="includes"></param>')
Add-Line('        void FillModuleModel(Output{0}ModuleModel result, ISet<{0}ModuleInclude> includes);' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('')

Add-Line('        /// <summary>')
Add-Line('        /// From given set remove all items that were loaded ')
Add-Line('        /// </summary>')
Add-Line('        /// <param name="includes"></param>')
Add-Line('        /// <returns></returns>')
Add-Line('        HashSet<{0}ModuleInclude> GetModuleIncludesToDownload(HashSet<{0}ModuleInclude> includes);' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
