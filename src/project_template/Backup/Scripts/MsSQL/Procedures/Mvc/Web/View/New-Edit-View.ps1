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
Add-Line('   <div class="col-lg-10">')
Add-Line('      <div>')
Add-Line('         <h2>@ViewBag.Title</h2>')
Add-Line('         <p></p>')
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
Add-Line('    <div>')   # box
    # ValidationSummary
    Add-Line('')
    Add-Line('        @Html.ValidationSummary(true, "", new { @class = "text-danger" })')
    Add-Line('')

Add-Line('        @using (Html.BeginForm("{1}", "{0}", new {{ ID = Model.ID }}, FormMethod.Post))' -f $data.Metadata.Name, $data.Metadata.Prefix)
Add-Line('        {')   # form
# General hidden fields
Add-Line('            @Html.AntiForgeryToken()')
Add-Line('            @Html.HiddenFor(model => model.ID)')
Add-Line('            <div class="ibox float-e-margins">')
Add-Line('')

## ibox title
Add-Line('                <div class="ibox-title">')
Add-Line('                    <h5>@ViewBag.Title</h5>')
Add-Line('                </div>')

## ibox content
Add-Line('                        <div class="ibox-content overflow-hidden">')
Add-Line('                            <div class="col-md-6">')  # left side

### Editors
$columns = $data.InputColumns.GetEnumerator()
foreach ($column in $columns)
{  
    $reqClass = ('',' required')[$column.Value.IsRequired] 

    if ($column.Value.Name -in ('ID_Login', 'ID')) {
        continue;
    }
 
    if ($columns.Value.Name -eq 'Description') {
        # textboxarea
        Add-Line('                                <div class="form-group">')
        Add-Line('                                    @Html.LabelFor(model => model.{0}, htmlAttributes: new {{ @class = "{1}" }})' -f $column.Value.Name, $reqClass)
        Add-Line('                                    @Html.TextAreaFor(model => model.{0}, htmlAttributes: new {{ @class = "form-control" }})' -f $column.Value.Name)
        Add-Line('                                    @Html.ValidationMessageFor(model => model.{0}, "", new {{ @class = "text-danger" }})' -f $column.Value.Name)
        Add-Line('                                </div>')
        Add-Line('')

    } elseif ($columns.Value.Type -eq 'DateTime') {
        # Datepicker
        Add-Line('                                <div class="form-group">')
        Add-Line('                                    @Html.LabelFor(model => model.{0}, new {{ @class = "form-check-label" }})' -f $column.Value.Name)
        Add-Line('                                    <div class="input-group date datepicker">')
        Add-Line('                                        <span class="input-group-addon"><i class="fas fa-calendar"></i></span>')
        Add-Line('                                        <input type="text" name="{0}" class="form-control" value="@(Model.{0}?.Date.ToString("d", System.Threading.Thread.CurrentThread.CurrentCulture))">' -f $column.Value.Name, $data.Metadata.PluralName)
        Add-Line('                                    </div>')
        Add-Line('                                    <div>@Html.ValidationMessageFor(model => model.{0}, "", new {{ @class = "text-danger" }})</div>' -f $column.Value.Name)
        Add-Line('                                </div>')
        
        # Add-Line('            <div class="form-group row col-md-6{0}">' -f $reqClass)
        # Add-Line('              @Html.LabelFor(model => model.{0}, htmlAttributes: new {{ @class = "col-form-label col-md-4" }})' -f $column.Value.Name)
        # Add-Line('              <div class="col-md-8">')
        # Add-Line('                <div class="input-group date">')
        # Add-Line('                  @Html.EditorFor(model => model.{0}, new {{ htmlAttributes = new {{ @class = "form-control js-datepicker" }} }})' -f $column.Value.Name)
        # Add-Line('                  <div class="input-group-addon"><span class="glyphicon glyphicon-th"></span></div>')
        # Add-Line('                  <div class="input-group-append"><span class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></span></div>')
        # Add-Line('                </div>')
        # Add-Line('                @Html.ValidationMessageFor(model => model.{0}, "", new {{ @class = "" }})' -f $column.Value.Name)
        # Add-Line('              </div>')
        # Add-Line('            </div>')
        Add-Line('')
    }elseif($columns.Value.Type -eq 'bool'){
        # checkbox
        Add-Line('                                <div class="form-check">')
        Add-Line('                                    @Html.CheckBoxFor(model => model.{0}, new {{ @class = "form-check-input" }})' -f $column.Value.Name)
        Add-Line('                                    @Html.LabelFor(model => model.{0}, new {{ @class = "form-check-label" }})' -f $column.Value.Name)
        Add-Line('                                    @Html.ValidationMessageFor(model => model.{0}, "", new {{ @class = "" }})' -f $column.Value.Name)
        Add-Line('                                </div>')
    } else {
        # editor
        Add-Line('                                <div class="form-group">')
        Add-Line('                                    @Html.LabelFor(model => model.{0}, new {{ @class = "{1}" }})' -f $column.Value.Name, $reqClass)
        Add-Line('                                    @Html.EditorFor(model => model.{0}, new {{ htmlAttributes = new {{ @class = "form-control", @placeholder = Resources.Dictionary.{1}_{0}_Placeholder }} }})' -f $column.Value.Name, $data.Metadata.PluralName)
        Add-Line('                                    @Html.ValidationMessageFor(model => model.{0}, "", new {{ @class = "text-danger" }})' -f $column.Value.Name)
        Add-Line('                                </div>')
    }
}

Add-Line('                            </div>')  # /left side
Add-Line('                            <div class="col-md-6">')  # right side
Add-Line('<!-- Right Side -->')
Add-Line('                            </div>')  # /right side
Add-Line('')
Add-Line('                        </div>')  # /ibox content
Add-Line('')
Add-Line('                        <div class="ibox-footer">')
Add-Line('                            <button id="btn-submit" class="btn btn-md btn-primary">@Resources.Dictionary.Global_Button_Save</button>')
Add-Line('                            <a class="btn btn-md btn-primary" href="@Url.Action("Detail", new { id = Model.ID })">@Resources.Dictionary.Global_Button_Back</a>')
Add-Line('                        </div>')

# # /content wrapper
Add-Line('                    </div>')    # /ibox
Add-Line('        }')   # /form
Add-Line('    </div>')  # /box
Add-Line('')
Add-Line('<!-- Second Box -->')
Add-Line('@*')
Add-Line('    <div>')
Add-Line('        <div class="row animated fadeInRightBig">')
Add-Line('            <div class="col-lg-12">')
Add-Line('                <div class="ibox float-e-margins">')
Add-Line('                    <div class="ibox-title">')
Add-Line('                        <h5>Title</h5>')
Add-Line('                    </div>')
Add-Line('')
Add-Line('                    <div class="ibox-content overflow-hidden">')
Add-Line('                        <!-- Content -->')
Add-Line('                    </div>')
Add-Line('')
Add-Line('                    <div class="ibox-footer">')
Add-Line('                        <!-- Footer -->')
Add-Line('                    </div>')
Add-Line('                </div>')
Add-Line('            </div>')
Add-Line('        </div>')
Add-Line('    </div>')  # /Box 2
Add-Line('*@')

Add-Line('')
Add-Line('</div>')

# vypisu builder do hostu
Out-Builder