param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# hlavicka
Add-Line('namespace {0}.Views.{2}' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)

Add-Line('{')

# usingy
Add-Line('    using System.Windows.Controls;')
Add-Line('')

Add-Line('    /// <summary>')
Add-Line('    /// Interaction logic for {0}ListView_Filter.xaml' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}ListView_Filter : UserControl' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    {')

Add-Line('        public {0}ListView_Filter()' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        {')
Add-Line('            InitializeComponent();')
Add-Line('        }')

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder
