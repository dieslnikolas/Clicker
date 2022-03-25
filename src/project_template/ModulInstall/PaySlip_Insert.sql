declare @Sql Note = N'
--Parametry
declare @ID_Company ID = {ID_Company}
declare @ID_CompanyMenuItem ID = {ID_CompanyMenuItem}

insert into IA_CompanyPlugin(DisplayName, ID_Company, [Procedure], Note, ID_Schedule, ScheduleCount, ScheduleTime)
    values(''Výplatní pásky: Zveřejnit sdělení'', @ID_Company, ''IA_Post_EditPublishEmail_PaySlip'', ''taskid#58527'', ''minute'', 30, ''9:00'')

declare @ID_CompanyPlugin ID = @@IDENTITY
insert into IA_CompanyPluginParameter(ID_CompanyPlugin, [Key], [Value])
    values(@ID_CompanyPlugin, ''ID_CompanyMenuItem'', @ID_CompanyMenuItem)
'

declare @Note Note = '- Pro instalaci tohoto modulu musíte mít v BO založený modul sdělení do kterého chcete zveřejňovat výplatní pásky'

insert into IA_Package (DisplayName, Script, Note)
    values('Výplatní pásky', @Sql, @Note)
declare @ID_Package ID = @@IDENTITY

insert into IA_PackageParameter(ID_Package, [Key], DefaultValue, Note, ID_ParameterType)
    values(@ID_Package, 'ID_CompanyMenuItem', null, 'ID položky menu pod kterou se nachází sdělení, která budou obsahovat výplatní pásky', 'ID_CompanyMenuItem')