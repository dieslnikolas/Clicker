 param (
    [Parameter(ValueFromPipeline = $true)]$data
 )

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateRazorLine $data

# usingy
Add-Line('@model {0}.Controllers{1}{2}{3}{3}{4}FilterModel' -f $data.Metadata.AppNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName, (('.'+$data.Metadata.Prefix),'')[$data.Metadata.OperationType -eq 'BLANK'], $data.Metadata.Name)
Add-Line('')
Add-Line('<div class="row">')
$columns = $data.OutputColumns.GetEnumerator()

# Filtry
foreach ($column in $columns)
{
   if($column.Value.Name -in ('ID_Login', 'IsActive')){
      continue;
   }

   if($column.Value.Name.StartsWith('ID', "CurrentCultureIgnoreCase")){
      continue;
   }

   Add-Line('   <div class="col-md-2">')
   Add-Line('      <div class="form-group">')
   Add-Line('         @Html.LabelFor(model => model.{0})' -f $column.Value.Name)
   Add-Line('         @Html.EditorFor(model => model.{0}, new {{ htmlAttributes = new {{ @placeholder = Resources.Dictionary.{1}_{0}_Placeholder }} }})' -f $column.Value.Name, $data.Metadata.PluralName)
   Add-Line('      </div>')
   Add-Line('   </div>')
}

# Hledat tlačítko
Add-Line('   <div class="col-sm-2">')
Add-Line('      <label>&#8203;</label>')
Add-Line('      <button id="search" type="submit" class="btn btn-as-block btn-search">@Resources.Dictionary.Global_Button_Search <i class="fas fa-search"></i></button>')
Add-Line('   </div>')

Add-Line('</div>')   # /row

# vypisu builder do hostu
Out-Builder
