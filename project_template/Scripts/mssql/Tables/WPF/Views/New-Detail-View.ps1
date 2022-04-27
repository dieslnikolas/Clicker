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
Add-Line('<controls:IsEnableUserControl x:Class="{0}.Views.{2}.{2}DetailView"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('                              xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"')
Add-Line('                              xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"')
Add-Line('                              xmlns:common="clr-namespace:{0}.Common;assembly={0}.Common"' -f $data.Metadata.Solution)
Add-Line('                              xmlns:controls="clr-namespace:{0}.Controls"' -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name)
Add-Line('                              xmlns:d="http://schemas.microsoft.com/expression/blend/2008"')
Add-Line('                              xmlns:{3}="clr-namespace:{0}.Views.{2}"'  -f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('                              xmlns:dxlc="http://schemas.devexpress.com/winfx/2008/xaml/layoutcontrol"')
Add-Line('                              xmlns:dxmvvm="http://schemas.devexpress.com/winfx/2008/xaml/mvvm"')
Add-Line('                              xmlns:dxr="http://schemas.devexpress.com/winfx/2008/xaml/ribbon"')
Add-Line('                              xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"')
Add-Line('                              xmlns:vm="clr-namespace:{0}.ViewModels.{2}"'-f $data.Metadata.AppNamespace, $data.Metadata.Modules, $data.Metadata.Name, $lowerName)
Add-Line('                              d:DataContext="{{d:DesignInstance Type=vm:{0}DetailViewModel}}"' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('                              d:DesignHeight="400"')
Add-Line('                              d:DesignWidth="{StaticResource {x:Static common:ResourceKeySelector.MinDocumentWidth}}"')
Add-Line('                              mc:Ignorable="d">')


# telo
Add-Line('  <controls:LayoutControlExtended>')
Add-Line('    <controls:LayoutGroupExtended MinWidth="{StaticResource {x:Static common:ResourceKeySelector.MinDocumentWidth}}">')

# BaseInfo
Add-Line('      <controls:LayoutGroupExtended>')
Add-Line('        <{2}:{0}DetailView_BaseInfo />' -f $data.Metadata.Name, $data.Metadata.Prefix, $lowerName)
Add-Line('      </controls:LayoutGroupExtended>')

<# DXTabControlEx 
Add-Line('      <controls:LayoutGroupExtended>')
Add-Line('        <controls:DXTabControlEx Padding="0"')
Add-Line('                                 ItemContainerStyle="{StaticResource {x:Static common:ResourceKeySelector.ValidatableTabItemStyle}}"')
Add-Line('                                 ItemTemplateSelector="{StaticResource {x:Static common:ResourceKeySelector.TabItemTemplateSelector}}"')
Add-Line('                                 ItemsSource="{Binding DetailTabs.CollectionView, NotifyOnValidationError=True, ValidatesOnDataErrors=True}"')
Add-Line('                                 SelectedItem="{Binding DetailTabs.SelectedTab}"')
Add-Line('                                 TabContentCacheMode="CacheTabsOnSelecting" />')
Add-Line('      </controls:LayoutGroupExtended>')
#>
Add-Line('    </controls:LayoutGroupExtended>')
Add-Line('  </controls:LayoutControlExtended>')
Add-Line('</controls:IsEnableUserControl>')

# vypisu builder do hostu
Out-Builder
