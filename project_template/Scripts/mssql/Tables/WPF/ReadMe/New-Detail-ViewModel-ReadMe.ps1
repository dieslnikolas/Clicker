param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

Add-Line('# Registrace viewmodelů')
Add-Line('Ke správné funkci je potřeba zaregistovat viewmodely v *IT2021.Common*.')
Add-Line('')

Add-Line('## ViewNames.cs')
Add-Line('')
Add-Line('Přidat konstanty:')
Add-Line('')
Add-Line('~~~')
Add-Line('        public const string {0}DetailView = "{0}DetailView";' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('~~~')

Add-Line('## CreateAutoMapper')
Add-Line('')
Add-Line('Do souboru *Extensions.cs* je potřeba přidat mapování souborů:')
Add-Line('')
Add-Line('~~~')
Add-Line('                cfg.CreateDeepCopyMapping(typeof(Output{0}ModuleModel));' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('                cfg.CreateMap<Output{0}Model, Input{0}Model>();' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('                cfg.CreateMap<Output{0}ModuleModel, Input{0}ModuleModel>();' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('                cfg.CreateMap<{0}ListModel, {0}ListModel>();' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('~~~')

Add-Line('')
# vypisu builder do hostu
Out-Builder
