param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

Add-Line('# Jak na registraci klienta')
Add-Line('Ke správné funkci ViewModelů je potřeba zaregistrovat klienta (napojení na API).')
Add-Line('')

Add-Line('## Extensions.cs')
Add-Line('')
Add-Line('Přidat do metody RegisterDeferredServices:')
Add-Line('')
Add-Line('~~~')
Add-Line('                // TODO SaleDataServiceUrl je potřeba doplnit v závislosti na modulu')
# TODO vyseparovat SaleDataServiceUrl z DataServiceNamespace přes substring nebo tak něco
Add-Line('            container.RegisterApiClient<{1}.ApiClient.Advanced.{0}Client>(httpClient, conn.SaleDataServiceUrl);' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('~~~')
Add-Line('')

Add-Line('# Registrace viewmodelů')
Add-Line('Ke správné funkci je potřeba zaregistovat viewmodely v *IT2021.Common*.')
Add-Line('')

Add-Line('## ViewNames.cs')
Add-Line('')
Add-Line('Přidat konstanty:')
Add-Line('')
Add-Line('~~~')
Add-Line('        public const string {0}ListView = "{0}ListView";' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('        public const string {0}ParentDetailView = "{0}ParentDetailView";' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('~~~')

Add-Line('## ModuleNames.cs')
Add-Line('')
Add-Line('Přidat konstanty:')
Add-Line('')
Add-Line('~~~')
Add-Line('        public static string {0}Heads => "{0}";' -f $data.Metadata.PluralName, $data.Metadata.DataServiceNamespace)
Add-Line('~~~')

Add-Line('# Jak na registraci do menu')
Add-Line('Nutné jen u přehledu.')
Add-Line('')

Add-Line('## MainViewModel.cs')
Add-Line('')
Add-Line('Přidat do metody RegisterModules:')
Add-Line('')
Add-Line('~~~')
Add-Line('                // TODO hlavní region se samozřejmě může lišit')
Add-Line('                RegisterModule(RegionNames.PriceLists, RegionNames.Documents, ModuleNames.{0}s, {0}.{0}ListParentDetailViewModel.Create, "IT2021.Main.Views.MainView.{0}s");' -f $data.Metadata.Name, $data.Metadata.DataServiceNamespace)
Add-Line('~~~')

Add-Line('')
# vypisu builder do hostu
Out-Builder
