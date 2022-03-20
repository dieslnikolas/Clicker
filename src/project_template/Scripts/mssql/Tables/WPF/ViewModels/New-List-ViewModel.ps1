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
Add-Line('    using ApiFoundations.Wrappers;')
Add-Line('    using {0}.ApiClient.Advanced;' -f $data.Metadata.DataServiceNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    using Bar;')
Add-Line('    using Codelists;')
Add-Line('    using CommonLogic;')
Add-Line('    using Context.Contract;')
Add-Line('    using DevExpress.Mvvm;')
Add-Line('    using DevExpress.Mvvm.DataAnnotations;')
Add-Line('    using DevExpress.Mvvm.POCO;')
Add-Line('    using System;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Collections.ObjectModel;')
Add-Line('    using System.Threading.Tasks;')

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Common actions for {0}''s list' -f $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    [POCOViewModel]')
Add-Line('    public class {1}{0}ListViewModel : CommonListViewModel<{0}ListModel, {0}Filter>, I{0}ListViewModel' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        /// <summary>')
Add-Line('        /// Context for view model')
Add-Line('        /// </summary>')
Add-Line('        private readonly I{0}Context context;' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        public override Guid Permission {{ get; set; }} = PermissionCodelistValues.{0};' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override Guid? PrimaryKey => SelectedModel?.{0}Id;' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <summary>')
Add-Line('        /// Initializes a new instance of the <see cref="{0}ListViewModel" /> class.' -f $data.Metadata.Name)
Add-Line('        /// </summary>')
Add-Line('        /// <param name="context">Context</param>.')
Add-Line('        protected {0}ListViewModel(I{0}Context context)' -f $data.Metadata.Name)
Add-Line('        {')
Add-Line('            this.context = context;')
Add-Line('        }')
Add-Line('')

Add-Line('        public static {0}ListViewModel Create(I{0}Context context) => ViewModelSource.Create(() => new {0}ListViewModel(context));' -f $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public async Task SearchAndOpenDetailAsync(Guid primaryKey)')
Add-Line('        {')
Add-Line('            ClearFilter();')
Add-Line('            await RefreshRowsAsync(RowRefreshType.All);')
Add-Line('            ClearFilter();')
Add-Line('')
Add-Line('            await OpenSelectedDetailAsync();')
Add-Line('        }')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override async Task<ApiResponse<ICollection<{0}ListModel>>> GetListAsync(Dictionary<string, object> filter)' -f $data.Metadata.Name, $lowerName)
Add-Line('        {')
Add-Line('            return await context.{0}Client.GetAsync(filter, SearchCancellationToken);' -f $data.Metadata.Name, $lowerName)
Add-Line('        }')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override async Task<ApiResponseHandle<object>> CustomDeleteAsync()')
Add-Line('        {')
Add-Line('            return ValidateResponse(await context.{0}Client.DeleteAsync(SelectedModel.{0}Id));' -f $data.Metadata.Name, $lowerName)
Add-Line('        }')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override string GetDeleteSelectedModelDescription()')
Add-Line('        {')
Add-Line('            return SelectedModel.Name;')
Add-Line('        }')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override HashSet<string> GetResourcesKeysToLoad()')
Add-Line('        {')
Add-Line('            HashSet<string> resourcesKeys = new HashSet<string>();')
Add-Line('            resourcesKeys.UnionWith(context.LocalizationManager.GetAllLocalizationKeysFromTypeRecursively(typeof({0}ListModel)));' -f $data.Metadata.Name, $lowerName)
Add-Line('            resourcesKeys.UnionWith(context.LocalizationManager.GetAllLocalizationKeysFromTypeRecursively(typeof({0}Filter)));' -f $data.Metadata.Name, $lowerName)
Add-Line('            return resourcesKeys;')
Add-Line('        }')
Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override ObservableCollection<Ribbon.RibbonGroup> CustomCreateRibbonMenu()')
Add-Line('        {')
Add-Line('            var items = new ObservableCollection<Bar.BarItem>();')
Add-Line('            var groups = new ObservableCollection<Ribbon.RibbonGroup>();')
Add-Line('')
Add-Line('            groups.Add(new Ribbon.RibbonGroup() { Caption = "IT2021.Main.Common.ExtendedActions", Items = items });')
Add-Line('')
Add-Line('            items.Add(new BarButtonItem(caption: "IT2021.Main.Common.ShowHistory", itemClickAsync: ShowInHistoryAsync, canItemClickAsync: CanShowInHistory, image: Images.ImageEnum.ShowHistory, KeyShortcuts.History));')
Add-Line('')
Add-Line('            return groups;')
Add-Line('        }')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
