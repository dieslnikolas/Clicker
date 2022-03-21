param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Context' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    using DevExpress.Mvvm;')

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Context contract for module {0}' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    public class {0}Context : CommonContext, Contract.I{0}Context' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        /// <inheritdoc />')
Add-Line('        public CodelistDataService.ApiClient.Advanced.IAutoCompleteClient AutoCompleteClient => ServiceContainer.Default.GetService<CodelistDataService.ApiClient.Advanced.IAutoCompleteClient>();')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public CodelistDataService.ApiClient.Advanced.ICodelistClient CodelistClient => ServiceContainer.Default.GetService<CodelistDataService.ApiClient.Advanced.ICodelistClient>();')
Add-Line('')        

Add-Line('        /// <inheritdoc />')
Add-Line('        public {2}.ApiClient.Advanced.I{0}Client {0}Client => ServiceContainer.Default.GetService<{2}.ApiClient.Advanced.I{0}Client>();' -f $data.Metadata.Name, $data.Metadata.Prefix, $data.Metadata.DataServiceNamespace)
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
