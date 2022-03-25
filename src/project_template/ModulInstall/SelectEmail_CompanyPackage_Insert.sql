declare @ID_Company ID, @Company DN, @ID_CompanyForm ID
declare @ID_FormItem_SelectReceiverItem ID, @ID_FormItem_Email ID

declare Company_Cursor cursor for 
    select IA_CompanyForm.ID, IA_Company.ID, IA_Company.DisplayName
    from IA_CompanyForm 
        inner join IA_CompanyMenuItem on IA_CompanyMenuItem.ID = IA_CompanyForm.ID_CompanyMenuItem
        inner join IA_Company on IA_Company.ID = IA_CompanyMenuItem.ID_Company
    where 
        IA_CompanyForm.[ProcedureInsert]='IA_Data_OTHER_SelectReceiver'
open Company_Cursor

fetch next from Company_Cursor
    into @ID_CompanyForm, @ID_Company, @Company
    
--Parametry zápisu
declare @ID_User ID = 5696 --Roman v ostré sys administraci
declare @Note Note= 'Instalace byla provede ručně na verzi 3.1. Toto je pouze zpětné doplnění záznamu'
declare @ID_Package ID = (select ID from IA_Package where DisplayName='Email podle oddělení') --select * from IA_Package (ID 8)
print @ID_Package
declare @ID_PackageParameter_Email ID = (select ID from IA_PackageParameter where ID_Package=@ID_Package and [Key]='ID_EmailItem') --select * from IA_PackageParameter (13)
print @ID_PackageParameter_Email
declare @ID_PackageParameter_Select ID = (select ID from IA_PackageParameter where ID_Package=@ID_Package and [Key]='ID_SelectReceiverItem') --select * from IA_PackageParameter (14)
print @ID_PackageParameter_Select
declare @ID_CompanyPackage ID = null

declare @Count int = 0
while @@FETCH_STATUS=0
begin
    if not exists( select ID from IA_CompanyPackage 
        where ID_Company=@ID_Company and ID_Package=@ID_Package)
    begin
        --Načtu parametry
        select @ID_FormItem_SelectReceiverItem=SelectItem.ID, @ID_FormItem_Email=Email.ID
        from IA_FormItem SelectItem
            inner join IA_FormItem Source on Source.ID=SelectItem.ID_FormItemSource
            inner join IA_FormItem Email on Email.ID_CompanyForm=Source.ID_CompanyForm and Email.[Name]='Email'
        where 
            SelectItem.ID_CompanyForm=@ID_CompanyForm 
            and SelectItem.[Name]='SelectReceiver'
        
        set @Count += 1
        print convert(varchar, @ID_Company) + ':' + @Company + ' | ' 
            + convert(varchar, @ID_CompanyForm) + ', ' 
            + convert(varchar, @ID_FormItem_Email) + ', ' 
            + convert(varchar, @ID_FormItem_SelectReceiverItem) 
            + ' (' + convert(varchar, @Count) + ')'

        insert into IA_CompanyPackage(ID_Company, ID_Package, [Date], ID_User, [Note])
        values(@ID_Company, @ID_Package, GETDATE(), @ID_User, @Note)
        set @ID_CompanyPackage = @@IDENTITY

        insert into IA_CompanyPackageParameter ([ID_CompanyPackage], [ID_PackageParameter], [Value])
            values(@ID_CompanyPackage, @ID_PackageParameter_Email, @ID_FormItem_Email)
        insert into IA_CompanyPackageParameter ([ID_CompanyPackage], [ID_PackageParameter], [Value])
            values(@ID_CompanyPackage, @ID_PackageParameter_Select, @ID_FormItem_SelectReceiverItem)
    end
    fetch next from Company_Cursor
        into @ID_CompanyForm, @ID_Company, @Company
end
close Company_Cursor
deallocate Company_Cursor