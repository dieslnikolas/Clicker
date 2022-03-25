    declare @ID_CompanyForm ID = 13
    
    declare @DataItemList IA_DataItemList
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(673, '2316', 0)
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(674, '2338', 0)
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(675, 'Pepa z Depa', 0)
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(676, '666', 0)
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(677, 'Uhelná pánev', 0)
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(678, 'Mamko Tatič', 0)
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(679, 'Kutač', 0)
    insert into @DataItemList (ID_FormItem, [Value], RowNumber)
        values(680, '265', 0)

    --Načtu jazyk firmy
    declare @ID_Company ID =(select IA_CompanyMenuItem.ID_Company from IA_CompanyForm 
                                inner join IA_CompanyMenuItem on IA_CompanyMenuItem.ID=IA_CompanyForm.ID_CompanyMenuItem
                            where IA_CompanyForm.ID=@ID_CompanyForm)
    declare @ID_CompanyLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company) 

    --Načtení konkrétních položek
    declare @PersonalNumber DN
    declare @Manager DN
    declare @ID_DoctorDay ID
    declare @ID_DoctorTime ID
    declare @ID_DoctorTimeItem ID
    declare @OrderTypeName DN
    select
        @PersonalNumber=case when IA_FormItem.Name like 'DoctorOrderPersonalNumber%' then DataItemList.[Value] else @PersonalNumber end,
        @Manager=case when IA_FormItem.Name like 'DoctorOrderManager%' then DataItemList.[Value] else @Manager end,
        @ID_DoctorDay=case when IA_FormItem.Name like 'DoctorOrderDay%' then cast(DataItemList.[Value] as int) else @ID_DoctorDay end,
        @ID_DoctorTime=case when IA_FormItem.Name like 'DoctorOrderTime%' then cast(DataItemList.[Value] as int) else @ID_DoctorTime end,
        @ID_DoctorTimeItem=case when IA_FormItem.Name like 'DoctorOrderTime%' then DataItemList.ID_FormItem else @ID_DoctorTimeItem end,
        @OrderTypeName=case when IA_FormItem.Name like 'DoctorOrderType%' then [IA_FormItemOption].[Name] else @OrderTypeName end
        from @DataItemList as DataItemList 
            inner join IA_FormItem on IA_FormItem.ID=DataItemList.ID_FormItem
            left join IA_FormItemOption on IA_FormItem.ID_FormItemType='Select' and IA_FormItemOption.ID=try_cast(DataItemList.[Value] as int)
             and IA_FormItem.ID_CompanyForm=@ID_CompanyForm 

    --Validace osobního čísla
    select 'Property'='', 'DisplayName'='Musíte zadat osobní číslo nebo zvolit vstupní prohlídku', 'Args'=''
    where isnull(@PersonalNumber, '')='' and @OrderTypeName not like 'DoctorOrderTypeOptionIn%'
    union

    --Validace vedoucího
    select 'Property'='', 'DisplayName'='Musíte zadat vedoucího nebo zvolit vstupní prohlídku', 'Args'=''
    where isnull(@Manager, '')='' and @OrderTypeName not like 'DoctorOrderTypeOptionIn%'
    union

    --Validace termínu
    select 'Property'='', 'DisplayName'='K zadanému termínu se již nelze přihlásit - byl uzavřen', 'Args'=''
    from IA_DataItem
    where IA_DataItem.ID=@ID_DoctorDay
        and dbo.IA_DataItem_Filter_KSEurope_DoctorOrder_IsDayOpen(IA_DataItem.ID_Data, @ID_CompanyLanguage)=0
    union

    --Validace času
    select 'Property'='', 'DisplayName'='Zadaný čas je již obsazený', 'Args'=''
    where dbo.IA_DataItem_Filter_KSEurope_DoctorOrder_IsTimeFree(@ID_DoctorTimeItem, @ID_DoctorTime)=0
    -- select * from IA_DataItem where ID=2340
    -- select * from IA_DataItem where ID_Data=642
    --select * from IA_FormItemOption where ID=263