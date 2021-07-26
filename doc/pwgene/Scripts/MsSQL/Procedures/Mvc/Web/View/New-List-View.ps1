 param (
    [Parameter(ValueFromPipeline = $true)]$data
 )

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateRazorLine $data

# usingy
Add-Line('@model {0}.Controllers{1}{2}{3}{3}{4}Model' -f $data.Metadata.AppNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName, (('.'+$data.Metadata.Prefix),'')[$data.Metadata.OperationType -eq 'BLANK'], $data.Metadata.Name)
Add-Line('@{')
Add-Line('  ViewBag.Title = Model.DisplayName;  //Resources.Dictionary.{0}{1}_All_Title; // {4}' -f ('',('.{0}_'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName, $data.Metadata.Prefix, $data.Metadata.Name, $data.Metadata.ProcedureDescription, $data.Metadata.AppNamespace)
Add-Line('}');
Add-Line('')

#sections
Add-Line('@section styles {')
Add-Line('  @Styles.Render("~/Content/datatables-init")')
Add-Line('}')
Add-Line('')
Add-Line('@section scripts {')
Add-Line('   @Scripts.Render("~/plugins/datatables-init")')
Add-Line('')
Add-Line('   <script type="text/javascript">')
Add-Line('      //$(document).ready(function () {')
Add-Line('      //   DatatablesInit()')
Add-Line('      //}')

Add-Line('   </script>')
Add-Line('}')

# breadcrumbs
Add-Line('<div class="row wrapper border-bottom white-bg page-heading">')
Add-Line('   <div class="app-title col-lg-12">')
Add-Line('      <div>')
Add-Line('         <h2>@Resources.Dictionary.{0}{1}_All_Title</h2>' -f ('',('.{0}_'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName, $data.Metadata.Prefix, $data.Metadata.Name, $data.Metadata.ProcedureDescription, $data.Metadata.AppNamespace)
Add-Line('      <p></p>')
Add-Line('      </div>')
Add-Line('      <ol class="app-breadcrumb breadcrumb">')
Add-Line('         <li class="breadcrumb-item"><a href="@Url.Action("Index", "Home")">@Resources.Dictionary.Home_Title</a></li>')
Add-Line('         <li class="breadcrumb-item"><strong>@ViewBag.Title</strong></li>')
Add-Line('      </ol>')
Add-Line('   </div>')
Add-Line('</div>')
Add-Line('')

# content wrapper
Add-Line('<div class="wrapper wrapper-content">')
Add-Line('   <div class="row animated fadeInRightBig">')
Add-Line('      <div class="col-lg-12">')
Add-Line('         <div class="ibox float-e-margins">')
Add-Line('')

## ibox title
Add-Line('            <div class="ibox-title">')
Add-Line('               <h5>@ViewBag.Title</h5>')
Add-Line('            </div>')
Add-Line('')

## ibox content
Add-Line('            <div class="ibox-content overflow-hidden">')
Add-Line('               <div class="ibox-buttons">')
Add-Line('               </div>')
Add-Line('')
Add-Line('               @Html.Partial("_AllFilter", Model.Filter)')
Add-Line('               @Html.Partial("_AllItems", Model.Items)')
Add-Line('            </div>')
Add-Line('')

# /content wrapper
Add-Line('         </div>')
Add-Line('      </div>')
Add-Line('   </div>')
Add-Line('</div>')

# ## data-table - footer
# Add-Line('        <div class="tile-footer">')
# Add-Line('          @if (Html.HasAction("{0}"))' -f $data.Metadata.ProcedureName.Replace('ALL','NEW'))
# Add-Line('          {')
# Add-Line('            @Html.ActionLink(Resources.Dictionary.Global_Button_Create, "Create", null, htmlAttributes: new {{ @class = "btn btn-primary" }})')
# Add-Line('          }')
# Add-Line('        </div>')

# vypisu builder do hostu
Out-Builder