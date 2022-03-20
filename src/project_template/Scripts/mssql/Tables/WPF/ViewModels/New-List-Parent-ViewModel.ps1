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
Add-Line('namespace {0}.ViewModels.{2}' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    using DevExpress.Mvvm.POCO;')
Add-Line('    using System;')
Add-Line('    using Context.Contract;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Threading.Tasks;')

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Common parent actions for {0}''s list' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    public class {1}{0}ListParentDetailViewModel : CommonListParentDetailViewModel' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        /// <summary>')
Add-Line('        /// Common parent actions for {0}''s list' -f $data.Metadata.Name)
Add-Line('        /// </summary>')
Add-Line('        /// <param name="context">Context</param>')
Add-Line('        protected {1}{0}ListParentDetailViewModel(I{0}Context context) : base(context)' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        {')
Add-Line('             SetFactoryMethods(context);')
Add-Line('        }')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override string Caption {{ get; set; }} = "IT2021.Main.Views.MainView.{0}s";' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override string ParentDetailViewName {{ get; set; }} = Common.ViewNames.{0}ParentDetailView;' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override string ListViewName {{ get; set; }} = Common.ViewNames.{0}ListView;' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override Func<Tab.ITabChildViewModel> ListViewModelFactoryMethod {{ get; set; }}' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override Func<Tab.ITabChildViewModel> ParentDetailFactoryMethod  {{ get; set; }}' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override async Task LoadCodelistsAsync()')
Add-Line('        {')
Add-Line('            await CodelistCache.LoadCodelistsAsync(new List<string>')
Add-Line('            {')
Add-Line('                Codelists.CodelistNames.Company')
Add-Line('            });')
Add-Line('        }')
Add-Line('')

Add-Line('        /// <summary>')
Add-Line('        /// Creates parental view model for list tab of {0} module' -f $data.Metadata.Name, $lowerName)
Add-Line('        /// </summary>')
Add-Line('        /// <param name="context">Context</param>' -f $data.Metadata.Name, $lowerName)
Add-Line('        /// <returns>Returns parental view model for list tab of {0} module</returns>' -f $data.Metadata.Name, $lowerName)
Add-Line('        public static {0}ListParentDetailViewModel Create(I{0}Context context) => ViewModelSource.Create(() => new {0}ListParentDetailViewModel(context));' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <summary>')
Add-Line('        /// Sets factory methods for creating view models')
Add-Line('        /// </summary>')
Add-Line('        /// <param name="context">Context</param>' -f $data.Metadata.Name, $lowerName)
Add-Line('        private void SetFactoryMethods(I{0}Context context)' -f $data.Metadata.Name, $lowerName)
Add-Line('        {')
Add-Line('            ParentDetailFactoryMethod = () => {0}ParentDetailViewModel.Create(context);' -f $data.Metadata.Name)
Add-Line('            ListViewModelFactoryMethod = () => {0}ListViewModel.Create(context);' -f $data.Metadata.Name)
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
