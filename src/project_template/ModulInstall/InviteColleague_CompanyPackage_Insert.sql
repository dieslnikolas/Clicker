declare @ID_Company ID, @Company DN, @ID_PostCompanyMenuItem ID
declare Company_Cursor cursor for 
    select IA_Company.ID, IA_Company.DisplayName
    from IA_CompanyForm 
        inner join IA_CompanyMenuItem on IA_CompanyMenuItem.ID = IA_CompanyForm.ID_CompanyMenuItem
        inner join IA_Company on IA_Company.ID = IA_CompanyMenuItem.ID_Company
    where 
        [Name]='InviteColleague'
open Company_Cursor

fetch next from Company_Cursor
    into @ID_Company, @Company

--Parametry zápisu
declare @ID_User ID = 5696 --Roman v ostré sys administraci
declare @Note Note= 'Instalace byla provede ručně na verzi 3.1. Toto je pouze zpětné doplnění záznamu'
declare @ID_Package ID = (select ID from IA_Package where DisplayName='Pozvi kolegu')
declare @ID_PackageParameter ID = (select ID from IA_PackageParameter where ID_Package=@ID_Package)
declare @ID_CompanyPackage ID = null
print @ID_Package

declare @Count int = 0
while @@FETCH_STATUS=0
begin
    if not exists( select ID from IA_CompanyPackage 
        where ID_Company=@ID_Company and ID_Package=@ID_Package )
    begin
        select @ID_PostCompanyMenuItem=IA_CompanyMenuItem.ID 
        from    
            IA_CompanyMenuItem
                inner join IA_PostList on IA_PostList.ID_CompanyMenuItem=IA_CompanyMenuItem.ID
                inner join IA_Post on IA_Post.ID_PostList=IA_PostList.ID
                inner join IA_PostLanguage on IA_PostLanguage.ID_Post = IA_Post.ID
        where 
            IA_CompanyMenuItem.ID_Company=@ID_Company
            and IA_PostLanguage.DisplayName = N'📣 Důležité: Pozvi kolegu'

        set @Count += 1

        print convert(varchar, @ID_Company) + ':' + @Company + ' | ' + convert(varchar, @ID_PostCompanyMenuItem) + ' (' + convert(varchar, @Count) + ')'

        insert into IA_CompanyPackage(ID_Company, ID_Package, [Date], ID_User, [Note])
        values(@ID_Company, @ID_Package, GETDATE(), @ID_User, @Note)
        set @ID_CompanyPackage = @@IDENTITY

        insert into IA_CompanyPackageParameter ([ID_CompanyPackage], [ID_PackageParameter], [Value])
            values(@ID_CompanyPackage, @ID_PackageParameter, @ID_PostCompanyMenuItem)
    end
    fetch next from Company_Cursor
    into @ID_Company, @Company
end
close Company_Cursor
deallocate Company_Cursor