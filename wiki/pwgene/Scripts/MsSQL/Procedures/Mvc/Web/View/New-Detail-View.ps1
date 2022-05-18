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
Add-Line('  ViewBag.Title = Resources.Dictionary.{0}{1}_{2}_Title;  //{4}' -f $data.Metadata.Modules, $data.Metadata.PluralName,$data.Metadata.Prefix, $data.Metadata.Name, $data.Metadata.ProcedureDescription, $data.Metadata.AppNamespace)
Add-Line('}');
Add-Line('')

#section .css
Add-Line('@section styles {')
Add-Line('    @*@Styles.Render("~/skeleton/select2/css")*@')
Add-Line('    @*@Styles.Render("~/skeleton/datepicker/css")*@')
Add-Line('}')
Add-Line('')

# section .js
Add-Line('@section scripts {')
Add-Line('    @*@Scripts.Render("~/skeleton/select2")*@')
Add-Line('    @*@Scripts.Render("~/skeleton/datepicker")*@')
Add-Line('    @*@Scripts.Render("~/skeleton/ajax")*@')
Add-Line('    @*@Scripts.Render("~/plugins/sweetAlert")*@')
Add-Line('    <script type="text/javascript">')
Add-Line('        $(document).ready(function () {')

Add-Line('@*')  # DatePicker
Add-Line('            // Datepicker')
Add-Line('            $(''.datepicker'').datepicker({')
Add-Line('                todayBtn: "linked",')
Add-Line('                calendarWeeks: true,')
Add-Line('                autoclose: true,')
Add-Line('                language: "@(System.Threading.Thread.CurrentThread.CurrentCulture)"')
Add-Line('            });')
Add-Line('*@')

Add-Line('        });') # /$(document).ready


Add-Line('    </script>')
Add-Line('}')

# breadcrumbs
Add-Line('<div class="row wrapper border-bottom white-bg page-heading">')
Add-Line('   <div class="app-title col-lg-12">')
Add-Line('      <div>')
Add-Line('         <h2>@ViewBag.Title</h2>' -f $data.Metadata.Modules, $data.Metadata.PluralName,$data.Metadata.Prefix, $data.Metadata.Name, $data.Metadata.ProcedureDescription, $data.Metadata.AppNamespace)
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
Add-Line('    <div>')   # Box


Add-Line('        <div class="row animated fadeInRightBig">')
Add-Line('            <div class="col-lg-12">')
Add-Line('                <div class="ibox float-e-margins">')
Add-Line('')

Add-Line('')
Add-Line('                    @Html.ValidationSummary(true, "", new { @class = "text-danger" })')
Add-Line('')

## ibox title
Add-Line('                    <div class="ibox-title">')
Add-Line('                        <h5>@Model.DisplayName</h5>')
Add-Line('                    </div>')
Add-Line('')

## ibox content
Add-Line('                    <div class="ibox-content overflow-hidden">')

### Table (detail)
Add-Line('                        <div class="col-sm-6">')
Add-Line('                            <table class="table-condensed ibox-table-detail">')

$columns = $data.OutputColumns.GetEnumerator()
foreach ($column in $columns)
{  
    if ($column.Value.Name -in ('ID_Login', 'IsActive')) {
        continue;
    }

    if ($column.Value.Name.StartsWith('ID')) { 
        continue;
    }
    
    if ($columns.Value.Type -eq 'bool') {
        # Display Yes/No
        Add-Line('                                <tr>')
        Add-Line('                                    <th class="title">@Html.DisplayNameFor(model => model.{0}): </th>' -f $column.Value.name)
        if($columns.Value.IsNullable){
            Add-Line('                                    <td class="text">@(Model.{0}.HasValue && Model.{0}.Value ? Resources.Dictionary.Global_Yes : Resources.Dictionary.Global_No)</td>' -f $column.Value.name)
        }else{
            Add-Line('                                    <td class="text">@(Model.{0} ? Resources.Dictionary.Global_Yes : Resources.Dictionary.Global_No)</td>' -f $column.Value.name)
        }
        Add-Line('                                </tr>')
    } else {
        # Display
        Add-Line('                                <tr>')
        Add-Line('                                    <th class="title">@Html.DisplayNameFor(model => model.{0}): </th>' -f $column.Value.name)
        Add-Line('                                    <td class="text">@Html.DisplayFor(model => model.{0})</td>' -f $column.Value.Name)
        Add-Line('                                </tr>')
    }
}

Add-Line('                            </table>')
Add-Line('                        </div>')

### Next to table
Add-Line('                        <div class="col-sm-6">')
Add-Line('<!-- Right Side -->')
Add-Line('                        </div>')

Add-Line('                    </div>')  # /ibox content
Add-Line('')

## Ibox footer
Add-Line('                    <div class="ibox-footer">')
Add-Line('                        @if (Html.HasAction("{0}"))' -f $data.Metadata.ProcedureName.Replace($data.Metadata.OperationType, "EDIT"))
Add-Line('                        {')
Add-Line('                            <a class="btn btn-primary" href="@Url.Action("Edit", new { id = Model.ID })">@Resources.Dictionary.Global_Button_Edit</a>')
Add-Line('                        }')
Add-Line('                        <a class="btn btn-primary" href="@Url.Action("All")">@Resources.Dictionary.Global_Button_Back</a>')
Add-Line('                    </div>')

# /content wrapper
Add-Line('                </div>')
Add-Line('            </div>')
Add-Line('        </div>')

Add-Line('    </div>')  # /Box
Add-Line('    @*')
Add-Line('    <div>')   # Box 2
Add-Line('<!-- Second box -->')

Add-Line('        <div class="row animated fadeInRightBig">')
Add-Line('            <div class="col-lg-12">')
Add-Line('                <div class="ibox float-e-margins">')
Add-Line('                    <div class="ibox-title">')
Add-Line('                        <h5>Title</h5>')
Add-Line('                    </div>')
Add-Line('')
Add-Line('                    <div class="ibox-content overflow-hidden">')
Add-Line('                      <!-- Content -->')
Add-Line('                    </div>')
Add-Line('')
Add-Line('                    <div class="ibox-footer">')
Add-Line('                      <!-- Footer -->')
Add-Line('                    </div>')


Add-Line('                </div>')
Add-Line('            </div>')
Add-Line('        </div>')


Add-Line('    </div>')  # /Box 2
Add-Line('    *@')
Add-Line('</div>')

# vypisu builder do hostu
Out-Builder