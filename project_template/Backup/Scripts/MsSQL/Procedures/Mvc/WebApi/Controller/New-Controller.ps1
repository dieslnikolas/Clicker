param (
    [Parameter(ValueFromPipeline = $true)]$data
)

# inicializace builderu
Initialize-Builder

# generated
Get-GenerateLine $data

# usingy
Add-Line('using {0}.Controllers.{1}.{2};' -f $data.Metadata.AppWebApiNamespace, $data.Metadata.PluralName, ($data.Metadata.PrefixType+$data.Metadata.PrefixExtension))
Add-Line('using {0}.Services;' -f $data.Metadata.CoreNamespace)
Add-Line('using {0}.Mvc.Common;' -f $data.Metadata.FrameworkNamespace)
Add-Line('using System.Web.Http;')
Add-Line('using System.Collections.Generic;')
Add-Line('using System.Linq;')

Add-Line('')

# hlavicka
#Add-Line('namespace {0}.Controllers{1}{2}' -f $data.Metadata.AppNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)
Add-Line('namespace {0}.Controllers' -f $data.Metadata.AppWebApiNamespace, ('.',('.{0}.'-f $data.Metadata.Modules))[![string]::IsNullOrEmpty($data.Metadata.Modules)], $data.Metadata.PluralName)

Add-Line('{')
Add-Line('    /// <summary>')
Add-Line('    /// Implementace kontroleru pro entitu - {0}' -f $data.Metadata.Description)
Add-Line('    /// </summary>')
Add-Line('    public partial class {0}Controller : BaseApiController' -f $data.Metadata.Name)
Add-Line('    {')

if ($data.Metadata.OperationType -ne 'BLANK') {

    # if ($data.Metadata.OperationType -in ('ALL', 'DETAIL', 'DEL')) {
    if ($data.Metadata.RequestType -eq 'GET') {
        # GET - Builder
        Add-Line('        /// <summary>')
        Add-Line('        /// {0}' -f $data.Metadata.ProcedureDescription)
        Add-Line('        /// </summary>')
        Add-Line('        /// <param name="input">Vstupní model API</param>')
        Add-Line('        /// <returns>Výstupní obálka API</returns>')
        Add-Line('        [HttpGet]')
        if ($data.Metadata.OperationType -in ('ALL', 'DETAIL', 'DEL')) {
            Add-Line('        [ResponseType(typeof(List<{0}{1}OutputModel>))]' -f $data.Metadata.Name, $data.Metadata.Prefix)
        }
        else {
            Add-Line('        [ResponseType(typeof({0}{1}OutputModel))]' -f $data.Metadata.Name, $data.Metadata.Prefix)
        }
        Add-Line('        public IHttpActionResult {2}([FromUri] {0}{1}InputModel input)' -f $data.Metadata.Name, $data.Metadata.Prefix, ($data.Metadata.PrefixType+$data.Metadata.PrefixExtension))
        Add-Line('        {')
        Add-Line('            return AsResult(Handler.Get<{1}{2}{0}Builder>().Build(input));' -f $data.Metadata.Name, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
        Add-Line('        }')
    }
    #elseif ($data.Metadata.OperationType -in ('NEW', 'EDIT')) {
    elseif ($data.Metadata.RequestType -eq 'POST') { 
        # POST - Handler
        Add-Line('        /// <summary>')
        Add-Line('        /// {0}' -f $data.Metadata.ProcedureDescription)
        Add-Line('        /// </summary>')
        Add-Line('        /// <param name="input">Vstupní model API</param>')
        Add-Line('        /// <returns>Výstupní obálka API</returns>')
        Add-Line('        [HttpPost]')
        Add-Line('        [ResponseType(typeof({0}{1}OutputModel))]' -f $data.Metadata.Name, $data.Metadata.Prefix)
        Add-Line('        public IHttpActionResult {2}([FromBody] {0}{1}InputModel input)' -f $data.Metadata.Name, $data.Metadata.Prefix, ($data.Metadata.PrefixType+$data.Metadata.PrefixExtension))
        Add-Line('        {')
        Add-Line('            return AsResult(Handler.Get<{1}{2}{0}Handler>().Handle(input));' -f $data.Metadata.Name, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
        Add-Line('        }')
    }
    else {
        # GET/POST
        Add-Line('        // Unknown action')
        Add-Line('')
        Add-Line('        // POST')
        Add-Line('        /// <summary>')
        Add-Line('        /// {0}' -f $data.Metadata.ProcedureDescription)
        Add-Line('        /// </summary>')
        Add-Line('        /// <param name="input">Vstupní model API</param>')
        Add-Line('        /// <returns>Výstupní obálka API</returns>')
        Add-Line('        [HttpPost]')
        Add-Line('        [ResponseType(typeof({0}{1}OutputModel))]' -f $data.Metadata.Name, $data.Metadata.Prefix)
        Add-Line('        public IHttpActionResult {2}([FromBody] {0}{1}InputModel input)' -f $data.Metadata.Name, $data.Metadata.Prefix, ($data.Metadata.PrefixType+$data.Metadata.PrefixExtension))
        Add-Line('        {')
        Add-Line('            return AsResult(Handler.Get<{1}{2}{0}Handler>().Handler(input));' -f $data.Metadata.Name, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
        Add-Line('        }')
        Add-Line('')
        
        Add-Line('        // GET')
        Add-Line('        /// <summary>')
        Add-Line('        /// {0}' -f $data.Metadata.ProcedureDescription)
        Add-Line('        /// </summary>')
        Add-Line('        /// <param name="input">Vstupní model API</param>')
        Add-Line('        /// <returns>Výstupní obálka API</returns>')
        Add-Line('        //[HttpGet]')
        Add-Line('        [ResponseType(typeof({0}{1}OutputModel>))]' -f $data.Metadata.Name, $data.Metadata.Prefix)
        Add-Line('        //public IHttpActionResult {2}([FromUri] {0}{1}InputModel input)' -f $data.Metadata.Name, $data.Metadata.Prefix, ($data.Metadata.PrefixType+$data.Metadata.PrefixExtension))
        Add-Line('        //{')
        Add-Line('        //    return AsResult(Handler.Get<{1}{2}{0}Builder>().Build(input));' -f $data.Metadata.Name, $data.Metadata.PrefixType, $data.Metadata.PrefixExtension)
        Add-Line('        //}')
        
    }
}

# ukonceni tridy 
Add-Line('    }')
Add-Line('}')

# vypisu builder do hostu
Out-Builder