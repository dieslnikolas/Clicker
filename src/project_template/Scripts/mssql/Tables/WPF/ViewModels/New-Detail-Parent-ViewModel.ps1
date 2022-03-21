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
Add-Line('    using ApiClientBase.Models;')
Add-Line('    using ApiFoundations.Wrappers;')
Add-Line('    using Codelists;')
Add-Line('    using DevExpress.Mvvm.DataAnnotations;')
Add-Line('    using DevExpress.Mvvm.POCO;')
Add-Line('    using Context.Contract;')
Add-Line('    using SaleDataService.ApiClient.Advanced;')
Add-Line('    using System;')
Add-Line('    using System.Collections.Generic;')
Add-Line('    using System.Threading.Tasks;')

Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    ///Parent detail ViewModel for {0}' -f $data.Metadata.Name)
Add-Line('    /// <seealso cref="{2}ModuleInclude" />' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    /// <seealso cref="{0}.ViewModels.{2}.I{2}ParentDetailViewModel" />' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('    /// </summary>')
Add-Line('    [POCOViewModel]')
Add-Line('    public class {1}{0}ParentDetailViewModel : CommonParentDetailViewModel<Output{0}ModuleModel, Output{0}Model, {0}ModuleInclude>, I{0}ParentDetailViewModel' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        private readonly I{0}Context context;' -f $data.Metadata.Name)
Add-Line('')

Add-Line('        public {0}DetailViewModel {0}DetailViewModel => Tabs.GetTabByViewName(Common.ViewNames.{0}DetailView)?.ViewModel as {0}DetailViewModel;' -f $data.Metadata.Name)
Add-Line('        public HistoryViewModel HistoryViewModel => Tabs.GetTabByViewName(Common.ViewNames.HistoryView)?.ViewModel as HistoryViewModel;' -f $data.Metadata.Name)

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override Guid Permission {{ get; set; }} = PermissionCodelistValues.{0};' -f $data.Metadata.Name)

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override Output{0}Model DetailModel => Model.{0};' -f $data.Metadata.Name)

Add-Line('')

Add-Line('        protected {0}ParentDetailViewModel(I{0}Context context)' -f $data.Metadata.Name)
Add-Line('        {') 
Add-Line('          this.context = context;')
Add-Line('        }')

Add-Line('')

Add-Line('        public static {0}ParentDetailViewModel Create(I{0}Context context) => ViewModelSource.Create(() => new {0}ParentDetailViewModel(context));' -f $data.Metadata.Name)

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override async Task BaseModelLoadingAsync()')
Add-Line('        {')
Add-Line('            if (Tabs.Count == 0)')
Add-Line('            {')
Add-Line('                await Tabs.AddTabAsync(new Tab.Tab("IT2021.Main.Common.Detail", () => {0}DetailViewModel.Create(context), this, Common.ViewNames.{0}DetailView, 0), true);' -f $data.Metadata.Name)
Add-Line('                await Tabs.AddTabAsync(new Tab.Tab("IT2021.Main.Views.HistoryView", HistoryViewModel.Create, this, Common.ViewNames.HistoryView, 1));' -f $data.Metadata.Name)
Add-Line('            }')
Add-Line('            else')
Add-Line('            {')
Add-Line('                await Tabs.RefreshAsync();')
Add-Line('            }')
Add-Line('        }')

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override bool CustomIsModelValid() => Tabs.Validate();')

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override async Task CustomBeforeEndEdit()')
Add-Line('        {')
Add-Line('            await base.CustomBeforeEndEdit();')
Add-Line('        }')

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override async Task<ApiResponse<Guid>> CustomCreateAsync()')
Add-Line('        {')
Add-Line('            return await context.{0}Client.CreateAsync(GetInputModel<Input{0}ModuleModel>());' -f $data.Metadata.Name)
Add-Line('        }')

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public override async Task<ApiResponse<object>> CustomUpdateAsync()')
Add-Line('        {')
Add-Line('            return await context.{0}Client.UpdateAsync(DetailParameter.PrimaryKey ?? Guid.Empty, GetInputModel<Input{0}ModuleModel>());' -f $data.Metadata.Name)
Add-Line('        }')

Add-Line('')

Add-Line('        /// <inheritdoc />')
Add-Line('        public async Task<ApiResponse<ICollection<OutputHistoryModel>>> GetHistoryAsync()')
Add-Line('        {')
Add-Line('            return await context.{0}Client.GetHistoryAsync(DetailParameter.PrimaryKey ?? Guid.Empty, Utils.CurrentLanguageId);' -f $data.Metadata.Name)
Add-Line('        }')

Add-Line('')
Add-Line('')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
