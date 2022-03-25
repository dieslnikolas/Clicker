declare @ID_CompanyMenuItem ID = 4737 --NAHRADIT!!!!!!!!!!!!!!!

declare @ID_Company ID = (select IA_CompanyMenuItem.ID_Company from IA_CompanyMenuItem where ID=@ID_CompanyMenuItem)
declare @CompanyDisplayName DN = (select DisplayName from IA_Company where ID=@ID_Company)

-- insert into IA_CustomProcedure (DisplayName, ID_CustomProcedureType, [Procedure], ParameterNote, Note)
--    values('Výplatní pásky: Zveřejnit sdělení', 'plugin', 'IA_Post_EditPublishEmail_PaySlip', 'ID_CompanyMenuItem - Modul ve kterém má plugin sdělení hledat', 'taskid#58365')
insert into IA_CompanyPlugin(DisplayName, ID_Company, [Procedure], Note, ID_Schedule, ScheduleCount, ScheduleTime)
    values('Výplatní pásky: Zveřejnit sdělení', @ID_Company, 'IA_Post_EditPublishEmail_PaySlip', 'taskid#58527', 'minute', 30, '9:00')

declare @ID_CompanyPlugin ID = @@IDENTITY
insert into IA_CompanyPluginParameter(ID_CompanyPlugin, [Key], [Value])
    values(@ID_CompanyPlugin, 'ID_CompanyMenuItem', @ID_CompanyMenuItem)

print 'Formulář nastaven. Firma: ' + @CompanyDisplayName