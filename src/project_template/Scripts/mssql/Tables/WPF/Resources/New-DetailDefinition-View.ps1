param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

$lowerName = [Regex]::Replace($data.Metadata.Name , '\b.', {  $args[0].Value.Tolower() })
$lowerPluralName = [Regex]::Replace($data.Metadata.PluralName , '\b.', {  $args[0].Value.Tolower() })


Add-Line('<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"')
Add-Line('                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"')                    
Add-Line('                    xmlns:{3}="clr-namespace:{0}.Views.{2}"'  -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('                    xmlns:common="clr-namespace:{0}.Common;assembly=IT2021.Common"' -f  $data.Metadata.Solution)
Add-Line('                    xmlns:controls="clr-namespace:{0}.Controls"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('                    xmlns:views="clr-namespace:{0}.Views">' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('')

Add-Line('    <!--  Main Tab definitions  -->')
Add-Line('    <DataTemplate x:Key="{{x:Static common:ResourceKeySelector.{0}ListViewTabItemTemplate}}">' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        <{3}:{2}ListView DataContext="{{Binding DataContext.ListViewModel, RelativeSource={{RelativeSource FindAncestor, AncestorType={{x:Type UserControl}}}}}}" />' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('    </DataTemplate>')
Add-Line('    <DataTemplate x:Key="{{x:Static common:ResourceKeySelector.{0}ParentDetailViewTabItemTemplate}}">'  -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        <views:CommonParentDetailView DataContext="{Binding DataContext.ParentDetailViewModel, RelativeSource={RelativeSource FindAncestor, AncestorType={x:Type UserControl}}}" />')
Add-Line('    </DataTemplate>')

Add-Line('  <!--  Detail Tab definitions  -->')
Add-Line('  <DataTemplate x:Key="{{x:Static common:ResourceKeySelector.{0}DetailViewTabItemTemplate}}">' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('    <Border Style="{StaticResource {x:Static common:ResourceKeySelector.TabBorderStyle}}">')
Add-Line('      <{3}:{2}DetailView DataContext="{{Binding DataContext.{2}DetailViewModel, RelativeSource={{RelativeSource FindAncestor, AncestorType={{x:Type controls:IsEnableUserControl}}}}}}" />' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('    </Border>')
Add-Line('  </DataTemplate>')
Add-Line('</ResourceDictionary>')

# vypisu builder do hostu
Out-Builder
