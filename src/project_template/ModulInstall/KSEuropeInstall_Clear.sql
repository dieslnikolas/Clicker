declare @ID_Company ID = 2 --NAHRADIT!!!!!!!!!!!!!!!
declare @ID_Form ID = 31
-- declare @ID_Form ID = 33
-- declare @ID_Form ID = 32

delete IA_FormItemOptionLanguage
    from IA_FormItemOptionLanguage
     inner join IA_FormItemOption on IA_FormItemOptionLanguage.ID_FormItemOption=IA_FormItemOption.ID
     inner join IA_FormItem on IA_FormItemOption.ID_FormItem=IA_FormItem.ID
where IA_FormItem.ID_CompanyForm=@ID_Form

delete IA_FormItemOption
    from IA_FormItemOption inner join IA_FormItem on IA_FormItemOption.ID_FormItem=IA_FormItem.ID
where IA_FormItem.ID_CompanyForm=@ID_Form

delete IA_FormItemLanguage
    from IA_FormItemLanguage inner join IA_FormItem on IA_FormItemLanguage.ID_FormItem=IA_FormItem.ID
where IA_FormItem.ID_CompanyForm=@ID_Form

delete IA_FormItem where ID_CompanyForm=@ID_Form

---MAZÁNÍ RADĚJI PUSTIT RUČNĚ
delete IA_CompanyPluginParameter
from IA_CompanyPluginParameter
    inner join IA_CompanyPlugin on IA_CompanyPlugin.ID=IA_CompanyPluginParameter.ID_CompanyPlugin
where IA_CompanyPlugin.ID_Company=@ID_Company

delete IA_CompanyPlugin
from IA_CompanyPlugin
where IA_CompanyPlugin.ID_Company=@ID_Company

--IA_Export
delete IA_ExportParameter
from IA_ExportParameter
    inner join IA_Export on IA_Export.ID=IA_ExportParameter.ID_Export
where IA_Export.ID_Company=@ID_Company

delete IA_Export
from IA_Export
where IA_Export.ID_Company=@ID_Company

select * from SF_ServiceRequest
delete SF_ServiceRequest where SF_ServiceRequest.ID_ServiceRequestType in ('ia_exportExecute', 'ia_companyPluginExecute')

-- select * from IA_FormItemOption
-- select * from IA_FormItemOptionLanguage
-- select * from IA_FormItem where [Name] is not null
-- select * from IA_FormItem where [FilterSql] is not null
-- select * from IA_CompanyForm where ProcedureValidate is not null
select * from IA_Export
select * from IA_CompanyPlugin