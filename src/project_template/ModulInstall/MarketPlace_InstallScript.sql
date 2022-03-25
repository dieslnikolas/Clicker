
BEGIN TRY
    BEGIN TRAN

---------------------- Konfigurace --------------------------
    declare @ModuleUrl DN = 'https://jobka-test-module.azurewebsites.net/marketplacemodule/'
    declare @ID_Company ID = 43 
    declare @ID_Login GUID = 'c0ca90fc-afdb-4266-85d3-fcf23afd15c9'
    select * from IA_Company where ID=@ID_Company
    ---------------------- Doplní se samo --------------------------------
        declare @ID_AdminUser ID = (select SF_Login.[ID_User] from SF_Login where SF_Login.[ID] = @ID_Login)
        declare @ID_CompanyBaseLanguage ID = dbo.IA_CompanyLanguage_Base(@ID_Company)
        declare @DateCreated datetime = GETUTCDATE()
    ---------------------- Názvy --------------------------------
        declare @FolderTitle DN = 'Solidní bazar'
        declare @ServiceFolderTitle DN = 'Konfigurace'
        declare @ApproversGroupTitle DN = @FolderTitle + ': Schvalovatelé'
        --Formuláře
            declare @SectionFormTitle DN = 'FM: Sekce'
            declare @AdFormTitle DN = 'FM: Inzerát'
            declare @CommentFormTitle DN = 'FM: Komentář'
            declare @NotificationFormTitle DN = 'FM: Vypnuté notifikace'
        --Přehledy
            declare @SectionListTitle DN = 'PH: Sekce'
            declare @AdListTitle DN = 'PH: Inzeráty'
            declare @MyAdListTitle DN = 'PH: Moje inzeráty'
            declare @AddToApproveListTitle DN = 'PH: Inzeráty ke schválení'
            declare @CommentListTitle DN = 'PH: Komentáře'
            declare @NotificationListTitle DN = 'PH: Vypnuté notifikace'
        --URL moduly
            declare @AdToAprroveUrlTitle DN = 'Inzeráty ke schválení'
            declare @MyAdUrlTitle DN = 'Moje inzeráty'
            declare @AddAdUrlTitle DN = 'Přidat inzerát'
            declare @AdListUrlTitle DN = 'Procházet inzeráty'

    ---------------------- Tabulky ------------------------
        --Schvalovatelé
        declare @Approvers StringList
        insert into @Approvers ([Value]) values
            ('666'), ('004')
    
        --Sekce
        declare @Sections StringList
        insert into @Sections ([Value]) VALUES
            (N'🚘  Auto-Moto'), (N'🏠  Byty, nemovitosti'), (N'🧸  Dětské zboží'), (N'📺  Elektro'), (N'💼  Firemní burza'), (N'⚽  Sportovní zboží'), (N'💬  Ostatní')

---------------------- Složky -------------------------------
    ---------------------- Root ---------------------------------
    declare @ID_FolderCompanyMenuItem ID
    exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Folder', @ID_Company=@ID_Company, @ID=@ID_FolderCompanyMenuItem out
    exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_FolderCompanyMenuItem, @DisplayName=@FolderTitle
    update IA_CompanyMenuItem set IsDisable = 1 where ID = @ID_FolderCompanyMenuItem
    declare @ID_RootFolder ID = (select ID from IA_Folder where ID_CompanyMenuItem = @ID_FolderCompanyMenuItem)
    
    ---------------------- Konfigurace --------------------------
    declare @ID_ServiceFolderCompanyMenuItem ID
    exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Folder', @ID_Company=@ID_Company, @ID=@ID_ServiceFolderCompanyMenuItem out
    exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_ServiceFolderCompanyMenuItem, @DisplayName=@ServiceFolderTitle
    update IA_CompanyMenuItem set IsDisable = 1, ID_CompanyMenuItemParent=@ID_FolderCompanyMenuItem where ID = @ID_ServiceFolderCompanyMenuItem

---------------------- Skupina ------------------------------
    declare @ID_ApproversGroup ID
    exec IA_Group_NEW_Company @ID_Login=@ID_Login, @ID_Company=@ID_Company, @DisplayName=@ApproversGroupTitle, @Note=null, @ID=@ID_ApproversGroup out
    insert into IA_EmployeeGroup ([ID_Employee], [ID_Group])
    select IA_Employee.ID, @ID_ApproversGroup from @Approvers 
        inner join IA_Employee on IA_Employee.PersonalNumber=[Value] and IA_Employee.ID_Company=@ID_Company

---------------------- URL moduly ---------------------------
    ---------------------- Ke schválení ------------------------------
        declare @ID_ToApproveUrlMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Url', @ID_Company=@ID_Company, @ID=@ID_ToApproveUrlMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_ToApproveUrlMenuItem, @DisplayName=@AdToAprroveUrlTitle
        declare @ID_ToApproveUrl ID = (select ID from IA_UrlPage where ID_CompanyMenuItem = @ID_ToApproveUrlMenuItem)

        update IA_CompanyMenuItem set ID_CompanyMenuItemParent = @ID_FolderCompanyMenuItem, IsDisable=0 where ID=@ID_ToApproveUrlMenuItem
        update IA_UrlPage set [Url] = @ModuleUrl + 'ToApproveList?CompanyColor={CompanyColor}&ID_Login={ID_Login}&ID_Module=' + convert(varchar(max), @ID_RootFolder) where ID=@ID_ToApproveUrl

        insert into IA_CompanyMenuItemGroup(ID_CompanyMenuItem,ID_Group)
            values (@ID_ToApproveUrlMenuItem, @ID_ApproversGroup)

    ---------------------- Moje --------------------------------------
        declare @ID_MyAdUrlMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Url', @ID_Company=@ID_Company, @ID=@ID_MyAdUrlMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_MyAdUrlMenuItem, @DisplayName=@MyAdUrlTitle
        declare @ID_MyAdUrl ID = (select ID from IA_UrlPage where ID_CompanyMenuItem = @ID_MyAdUrlMenuItem)

        update IA_CompanyMenuItem set ID_CompanyMenuItemParent = @ID_FolderCompanyMenuItem, IsDisable=0 where ID=@ID_MyAdUrlMenuItem
        update IA_UrlPage set [Url] = @ModuleUrl + 'MyList?CompanyColor={CompanyColor}&ID_Login={ID_Login}&ID_Module=' + convert(varchar(max), @ID_RootFolder) where ID=@ID_MyAdUrl

    ---------------------- Nový --------------------------------------
        declare @ID_AddAdUrlMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Url', @ID_Company=@ID_Company, @ID=@ID_AddAdUrlMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_AddAdUrlMenuItem, @DisplayName=@AddAdUrlTitle
        declare @ID_AddAdUrl ID = (select ID from IA_UrlPage where ID_CompanyMenuItem = @ID_AddAdUrlMenuItem)

        update IA_CompanyMenuItem set ID_CompanyMenuItemParent = @ID_FolderCompanyMenuItem, IsDisable=0 where ID=@ID_AddAdUrlMenuItem
        update IA_UrlPage set [Url] = @ModuleUrl + 'Create?CompanyColor={CompanyColor}&CompanyAccentColor={CompanyAccentColor}&ID_Login={ID_Login}&ID_Module=' + convert(varchar(max), @ID_RootFolder) where ID=@ID_AddAdUrl

    ---------------------- Seznam ------------------------------------
        declare @ID_AdListUrlMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Url', @ID_Company=@ID_Company, @ID=@ID_AdListUrlMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_AdListUrlMenuItem, @DisplayName=@AdListUrlTitle
        declare @ID_AdListUrl ID = (select ID from IA_UrlPage where ID_CompanyMenuItem = @ID_AdListUrlMenuItem)

        update IA_CompanyMenuItem set ID_CompanyMenuItemParent = @ID_FolderCompanyMenuItem, IsDisable=0 where ID=@ID_AdListUrlMenuItem
        update IA_UrlPage set [Url] = @ModuleUrl + 'SectionList?CompanyColor={CompanyColor}&ID_Login={ID_Login}&ID_Module=' + convert(varchar(max), @ID_RootFolder) where ID=@ID_AdListUrl

---------------------- Formuláře ----------------------------
    ---------------------- Sekce --------------------------------
        ---------------------- Založení -----------------------------
        declare @ID_SectionFormCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_SectionFormCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_SectionFormCompanyMenuItem, @DisplayName=@SectionFormTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_SectionFormCompanyMenuItem

        ---------------------- Nastavení ----------------------------
        declare @ID_SectionCompanyForm ID
        set @ID_SectionCompanyForm = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_SectionFormCompanyMenuItem)
        update IA_CompanyForm set IsSaveAuthor = 1, IsInsertEmail = 0 where ID = @ID_SectionCompanyForm

        ---------------------- Položky ------------------------------
        insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsUpdate, IsInsert)
            values(1, @ID_SectionCompanyForm, 'Entry', 1, 1, 'Title', 1, 1, 1)
        declare @ID_TitleSectionFormItem ID = @@IDENTITY

        insert into IA_FormItemLanguage(ID_FormItem, ID_CompanyLanguage, DisplayName)
            values(@ID_TitleSectionFormItem, @ID_CompanyBaseLanguage, 'Název')

        ---------------------- Data ---------------------------------
            declare @Section DN
            declare @ID_SectionInitData ID
            declare SectionCursor cursor for
                select [Value] from @Sections

            open SectionCursor
            fetch next from SectionCursor into @Section

                while @@FETCH_STATUS = 0
                begin
                    insert into IA_Data ([ID_CompanyForm], [DateCreated], [ID_UserInsert])
                        values (@ID_SectionCompanyForm, @DateCreated, @ID_AdminUser)
                    set @ID_SectionInitData = @@IDENTITY

                    insert into IA_DataItem(ID_Data, ID_FormItem, [Value])
                    values (@ID_SectionInitData, @ID_TitleSectionFormItem, @Section)

                    fetch next from SectionCursor into @Section
                end

            close SectionCursor
            deallocate SectionCursor

    ---------------------- Inzerát ------------------------------
        ---------------------- Založení -----------------------------
        declare @ID_AdFormCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_AdFormCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_AdFormCompanyMenuItem, @DisplayName=@AdFormTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_AdFormCompanyMenuItem

        ---------------------- Nastavení ----------------------------
            declare @ID_AdCompanyForm ID
            set @ID_AdCompanyForm = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_AdFormCompanyMenuItem)

            declare @ProcedureParameters Note = (select 
                'ID_UrlPage_ToApprove'=@ID_ToApproveUrlMenuItem,
                'ID_UrlPage_MyAdvertisement'=@ID_MyAdUrlMenuItem,
                'ID_Group_Approvers'=@ID_ApproversGroup
                for json path, without_array_wrapper
            )

            update IA_CompanyForm set 
                IsSaveAuthor = 1, 
                IsInsertEmail=0,
                ProcedureInsert = 'IA_Data_OTHER_Marketplace_Insertion',
                ParametersInsert = @ProcedureParameters,
                ProcedureUpdate = 'IA_Data_OTHER_Marketplace_Insertion',
                ParametersUpdate = @ProcedureParameters,
                ProcedureValidate = 'IA_Data_VALIDATE_Marketplace_Insertion'
            where ID = @ID_AdCompanyForm

        ---------------------- Položky ------------------------------
            ------- Sekce ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate, ID_FormItemSource)
                values(1, @ID_AdCompanyForm, 'FormSelect', 0, 0, 'Section', 1, 0, 0, @ID_TitleSectionFormItem)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Sekce')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate, ID_FormItemSource)
                values(1, @ID_AdCompanyForm, 'FormSelect', 1, 1, 'Section_ToApprove', 1, 1, 1, @ID_TitleSectionFormItem)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Sekce - ke schválení')

            ------- Předmět ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 0, 2, 'Subject', 1, 0, 0)
            declare @ID_SubjectAdFormItem ID = @@IDENTITY
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@ID_SubjectAdFormItem, @ID_CompanyBaseLanguage, 'Předmět')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 1, 3, 'Subject_ToApprove', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Předmět - ke schválení')

            ------- Popis ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Editor', 0, 4, 'Description', 1, 0, 0)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Popis')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Editor', 1, 5, 'Description_ToApprove', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Popis - ke schválení')

            ------- Cena ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 0, 6, 'Price', 1, 0, 0)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Cena')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 1, 7, 'Price_ToApprove', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Cena - ke schválení')

            ------- Email ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 0, 8, 'Email', 1, 0, 0)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Email')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 0, 9, 'Email_ToApprove', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Email - ke schválení')

            ------- Telefon ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 0, 10, 'Phone', 1, 0, 0)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Telefon')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Entry', 0, 11, 'Phone_ToApprove', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Telefon - ke schválení')

            ------- 1 Fotografie ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Photo', 0, 12, 'PhotoFirst', 1, 0, 0)
            declare @ID_FirstPhotoAdFormItem ID = @@IDENTITY
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@ID_FirstPhotoAdFormItem, @ID_CompanyBaseLanguage, '1. Fotografie')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Photo', 0, 13, 'PhotoFirst_ToApprove', 1, 1, 1)
            declare @ID_FirstPhotoToApproveAdFormItem ID = @@IDENTITY
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@ID_FirstPhotoToApproveAdFormItem, @ID_CompanyBaseLanguage, '1. Fotografie - ke schválení')

            ------- 2 Fotografie ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Photo', 0, 14, 'PhotoSecond', 1, 0, 0)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, '2. Fotografie')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Photo', 0, 15, 'PhotoSecond_ToApprove', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, '2. Fotografie - ke schválení')

            ------- 3 Fotografie ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Photo', 0, 16, 'PhotoThird', 1, 0, 0)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, '3. Fotografie')

            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Photo', 0, 17, 'PhotoThird_ToApprove', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, '3. Fotografie - ke schválení')

            ------- Stav ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_AdCompanyForm, 'Select', 0, 18, 'State', 1, 0, 1)
            declare @ID_StateAdFormItem ID = @@IDENTITY
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@ID_StateAdFormItem, @ID_CompanyBaseLanguage, 'Stav')

            ------- Stav - možnosti - defautlní -------
            insert into IA_FormItemOption(ID_FormItem, DisplayName, IsActive, IsSynced, [Name])
                values (@ID_StateAdFormItem, 'Nový - ke schválení', 1, 1, 'New')
            declare @ID_NewStateFormItemOption ID = @@IDENTITY
            update IA_FormItem set DefaultValue=@ID_NewStateFormItemOption where ID = @ID_StateAdFormItem

            ------- Stav - možnosti - ostatní -------
            insert into IA_FormItemOption
                (ID_FormItem, DisplayName, IsActive, IsSynced, [Name])
            values
                    (@ID_StateAdFormItem, 'Upravený - ke schválení', 1, 1, 'Modified'),
                    (@ID_StateAdFormItem, 'Schválený', 1, 1, 'Approved'),
                    (@ID_StateAdFormItem, 'Zamítnutý', 1, 1, 'Rejected'),
                    (@ID_StateAdFormItem, 'Zrušený', 1, 1, 'Canceled'),
                    (@ID_StateAdFormItem, 'Úprava zamítnuta', 1, 1, 'EditRejected')

            insert into IA_FormItemOptionLanguage (ID_FormItemOption, DisplayName, ID_CompanyLanguage)
            select ID, DisplayName, @ID_CompanyBaseLanguage
                from IA_FormItemOption where ID_FormItem = @ID_StateAdFormItem

    ---------------------- Vypnuté notifikace -------------------
        ---------------------- Založení -----------------------------
        declare @ID_NotificationFormCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_NotificationFormCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_NotificationFormCompanyMenuItem, @DisplayName=@NotificationFormTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_NotificationFormCompanyMenuItem

        ---------------------- Nastavení ----------------------------
            declare @ID_NotificationCompanyForm ID
            set @ID_NotificationCompanyForm = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_NotificationFormCompanyMenuItem)

            update IA_CompanyForm set 
                IsSaveAuthor = 1, 
                IsInsertEmail=0,
                ProcedureValidate = 'IA_Data_VALIDATE_Marketplace_NotificationOff'
            where ID = @ID_NotificationCompanyForm
        
        ---------------------- Položky ------------------------------
            ------- Inzerát ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate, ID_FormItemSource)
                values(1, @ID_NotificationCompanyForm, 'FormSelect', 1, 0, 'InsertionName', 1, 1, 1, @ID_SubjectAdFormItem)
            declare @ID_AdCommentFormItem ID = @@IDENTITY
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@ID_AdCommentFormItem, @ID_CompanyBaseLanguage, 'Inzerát')

    ---------------------- Komentář -----------------------------
        ---------------------- Založení -----------------------------
        declare @ID_CommentFormCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='Form', @ID_Company=@ID_Company, @ID=@ID_CommentFormCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_CommentFormCompanyMenuItem, @DisplayName=@CommentFormTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_CommentFormCompanyMenuItem

        ---------------------- Nastavení ----------------------------
            declare @ID_CommentCompanyForm ID
            set @ID_CommentCompanyForm = (select ID from IA_CompanyForm where ID_CompanyMenuItem=@ID_CommentFormCompanyMenuItem)

            set @ProcedureParameters = (select 
                'NotificationTitle'=@FolderTitle,
                'NotificationMessage'='Nový komentář: ',
                'CMI_UrlPage_Insertions'=@ID_AdListUrlMenuItem,
                'ID_MuteNotificationCompanyForm'=@ID_NotificationCompanyForm
                for json path, without_array_wrapper
            )

            update IA_CompanyForm set 
                IsSaveAuthor = 1, 
                IsInsertEmail=0,
                ProcedureInsert = 'IA_Data_OTHER_Marketplace_Comment',
                ParametersInsert = @ProcedureParameters
            where ID = @ID_CommentCompanyForm
        
        ---------------------- Položky ------------------------------
            ------- Inzerát ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate, ID_FormItemSource)
                values(1, @ID_CommentCompanyForm, 'FormSelect', 1, 0, 'InsertionName', 1, 1, 1, @ID_SubjectAdFormItem)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Inzerát')

            ------- Komentář ------- 
            insert into IA_FormItem (IsActive, ID_CompanyForm, ID_FormItemType, IsRequired, [Order], [Name], IsSynced, IsInsert, IsUpdate)
                values(1, @ID_CommentCompanyForm, 'Editor', 1, 1, 'InsertionComment', 1, 1, 1)
            insert into IA_FormItemLanguage (ID_FormItem, ID_CompanyLanguage, DisplayName)
                values(@@IDENTITY, @ID_CompanyBaseLanguage, 'Zadejte váš komentář')

---------------------- Přehledy -----------------------------
    ---------------------- Sekce --------------------------------
        ---------------------- Založení -----------------------------
        declare @ID_SectionListCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_SectionListCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_SectionListCompanyMenuItem, @DisplayName=@SectionListTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_SectionListCompanyMenuItem

        ---------------------- Nastavení ----------------------------
            declare @ID_SectionList ID
            set @ID_SectionList = (select ID from IA_List where ID_CompanyMenuItem=@ID_SectionListCompanyMenuItem)
            update IA_List set
                ID_CompanyForm = @ID_SectionCompanyForm,
                ID_FormItemDisplayName = @ID_TitleSectionFormItem,
                ID_ListType='Plain',
                IsDateVisible = 0
            where ID=@ID_SectionList

    ---------------------- Inzeráty -----------------------------
        ---------------------- Založení -----------------------------
        declare @ID_AdListCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_AdListCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_AdListCompanyMenuItem, @DisplayName=@AdListTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_AdListCompanyMenuItem

        ---------------------- Nastavení SQL ------------------------
            declare @CustomSelectSql Note = '
                declare @ID_Section ID = (
                    select Parameters.value
                    from openjson(@Search) as Parameters
                    where Parameters.[key] = ''ID_Section'')

                declare @ID_SubjectFormItem ID = (select ID from IA_FormItem where ID_CompanyForm=@ID_CompanyForm and [Name]=''Subject'')
                declare @ID_PhotoFormItem ID = (select ID from IA_FormItem where ID_CompanyForm=@ID_CompanyForm and [Name]=''PhotoFirst'')
                declare @ID_SectionFormItem ID = (select ID from IA_FormItem where ID_CompanyForm=@ID_CompanyForm and [Name] = ''Section'')
                declare @ID_StateFormItem ID = (select ID from IA_FormItem where ID_CompanyForm=@ID_CompanyForm and [Name] = ''State'')

                declare @ID_StateApproved ID
                declare @ID_StateModified ID
                declare @ID_StateEditRejected ID

                select
                    @ID_StateApproved = case when IA_FormItemOption.Name=''Approved'' then IA_FormItemOption.ID else @ID_StateApproved end,
                    @ID_StateModified = case when IA_FormItemOption.Name=''Modified'' then IA_FormItemOption.ID else @ID_StateModified end,
                    @ID_StateEditRejected = case when IA_FormItemOption.Name=''EditRejected'' then IA_FormItemOption.ID else @ID_StateEditRejected end
                from IA_FormItemOption where ID_FormItem=@ID_StateFormItem

                select
                    IA_Data.ID,
                    ''DisplayName''=[Subject].[Value],
                    ''Date''=convert(varchar, IA_Data.DateCreated, 126),
                    ''DateType''=''DateTime'',
                    ''Description''=SF_User.DisplayName,
                    ''ID_Document''=Photo.ID_Document,
                    ''DocumentHash''=SF_DocumentVersion.[Hash],
                    ''DocumentUrl''=DocumentView.DocumentUrl,
                    ''Highlighted''= convert(bit, 0),
                    ''DetailCrossLink''=null,
                    ''ID_ListType''=@ID_ListType
                from IA_Data
                    inner join SF_User on SF_User.ID = IA_Data.ID_UserInsert
                    inner join IA_DataItem [Subject] on [Subject].ID_Data = IA_Data.ID
                        and [Subject].ID_FormItem = @ID_SubjectFormItem
                    inner join IA_DataItem [State] on [State].ID_Data = IA_Data.ID
                        and [State].ID_FormItem = @ID_StateFormItem
                    -- Dokument
                    inner join IA_DataItem Photo on Photo.ID_Data = IA_Data.ID
                        and Photo.ID_FormItem = @ID_PhotoFormItem
                    left join SF_Document on SF_Document.ID=Photo.ID_Document
                        left join SF_DocumentVersion on SF_DocumentVersion.ID=SF_Document.ID_DocumentVersion
                    cross apply dbo.IA_Company_DocumentView(@ID_Login, Photo.ID_Document, default) DocumentView
                    -- Sekce
                    inner join IA_DataItem SectionItem on SectionItem.ID_Data = IA_Data.ID
                        and SectionItem.ID_FormItem = @ID_SectionFormItem
                    inner join IA_DataItem Section on Section.ID = try_cast(SectionItem.Value as int)
                        and Section.ID_Data = @ID_Section
                where
                    IA_Data.ID_CompanyForm=@ID_CompanyForm
                    and [State].[Value] in (@ID_StateApproved, @ID_StateEditRejected, @ID_StateModified)
                            '

        ---------------------- Nastavení ----------------------------
            declare @ID_AdList ID
            set @ID_AdList = (select ID from IA_List where ID_CompanyMenuItem=@ID_AdListCompanyMenuItem)
            update IA_List set
                ID_CompanyForm = @ID_AdCompanyForm,
                ID_ListType = 'SmallPicture',
                IsDateVisible = 1,
                CustomSelectSql = @CustomSelectSql
            where ID=@ID_AdList

    ---------------------- Moje Inzeráty ------------------------
        ---------------------- Založení -----------------------------
        declare @ID_MyAdListCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_MyAdListCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_MyAdListCompanyMenuItem, @DisplayName=@MyAdListTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_MyAdListCompanyMenuItem

        ---------------------- Nastavení ----------------------------
            declare @ID_MyAdList ID
            set @ID_MyAdList = (select ID from IA_List where ID_CompanyMenuItem=@ID_MyAdListCompanyMenuItem)
            update IA_List set
                ID_CompanyForm = @ID_AdCompanyForm,
                FilterSql = '(IA_Data.ID_UserInsert = {ID_User}) and (dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') != dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''Canceled''))',
                ID_FormItemPicture=@ID_FirstPhotoToApproveAdFormItem,
                ID_ListType='SmallPicture',
                DisplayNameSql='''['' + dbo.IA_DataItem_Name_FormatOutputValue(@ID_Login, IA_Data.ID, ''Section_ToApprove'', @ID_CompanyLanguage) + ''] '' + dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''Subject_ToApprove'')',
                DescriptionSql='''Stav: '' + dbo.IA_DataItem_Name_FormatOutputValue(@ID_Login, IA_Data.ID, ''State'', @ID_CompanyLanguage)'
            where ID=@ID_MyAdList

    ---------------------- Inzeráty ke schválení ----------------
        ---------------------- Založení -----------------------------
        declare @ID_AdToApproveListCompanyMenuItem ID
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_AdToApproveListCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_AdToApproveListCompanyMenuItem, @DisplayName=@AddToApproveListTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_AdToApproveListCompanyMenuItem

        ---------------------- Nastavení ----------------------------
            declare @ID_AdToApproveList ID
            set @ID_AdToApproveList = (select ID from IA_List where ID_CompanyMenuItem=@ID_AdToApproveListCompanyMenuItem)
            update IA_List set
                ID_CompanyForm = @ID_AdCompanyForm,
                FilterSql = '(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') = dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''New''))or(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'') = dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''Modified''))',
                ID_ListType = 'SmallPicture',
                DisplayNameSql = N'IIF(dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''State'')=dbo.IA_FormItemOption_Name(@ID_Login, IA_Data.ID, ''State'', ''Modified''), N''✏️ '', '''') + ''['' + dbo.IA_DataItem_Name_FormatOutputValue(@ID_Login, IA_Data.ID, ''Section_ToApprove'', @ID_CompanyLanguage) + ''] '' + dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''Subject_ToApprove'')',
                DescriptionSql = '(select SF_User.DisplayName from SF_User where SF_User.ID=IA_Data.ID_UserInsert)',  
                ID_FormItemPicture = @ID_FirstPhotoToApproveAdFormItem         
            where ID=@ID_AdToApproveList

    ---------------------- Komentáře ----------------------------
        ---------------------- Založení -----------------------------
        declare @ID_CommentListCompanyMenuItem ID 
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_CommentListCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_CommentListCompanyMenuItem, @DisplayName=@CommentListTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_CommentListCompanyMenuItem

        ---------------------- Nastavení SQL ------------------------
            set @CustomSelectSql = '
                declare @ID_Insertion ID = (
                    select Parameters.value     
                    from openjson(@Search) as Parameters     
                    where Parameters.[key] = ''ID_Insertion'')  
                    
                declare @ID_CommentFormItem ID = (
                    select ID from IA_FormItem 
                    where ID_CompanyForm=@ID_CompanyForm 
                        and [Name]=''InsertionComment'') 
                        
                declare @ID_InsertionFormItem ID = (
                    select ID from IA_FormItem 
                    where ID_CompanyForm=@ID_CompanyForm 
                    and [Name]=''InsertionName'')  
                    
                select      
                    IA_Data.ID,     
                    ''DisplayName''=SF_User.DisplayName,
                    ''Date''=convert(varchar, IA_Data.DateCreated, 126),
                    ''DateType''=''DateTime'',     
                    ''Description''=Comment.[Value],     
                    ''ID_Document''=null,     
                    ''DocumentHash''=null,     
                    ''DocumentUrl''=null,     
                    ''Highlighted''= convert(bit, 0),
                    ''DetailCrossLink''=null,
                    ''ID_ListType''=@ID_ListType 
                from IA_Data
                    inner join SF_User on SF_User.ID = IA_Data.ID_UserInsert
                    inner join IA_DataItem Comment on Comment.ID_Data = IA_Data.ID
                        and Comment.ID_FormItem = @ID_CommentFormItem     
                    inner join IA_DataItem InsertionItem on InsertionItem.ID_Data = IA_Data.ID         
                        and InsertionItem.ID_FormItem = @ID_InsertionFormItem
                    inner join IA_DataItem Insertion on Insertion.ID = try_cast(InsertionItem.Value as int)         
                        and Insertion.ID_Data = @ID_Insertion 
                where     
                    IA_Data.ID_CompanyForm=@ID_CompanyForm'
        
        ---------------------- Nastavení ----------------------------
            declare @ID_CommentList ID
            set @ID_CommentList = (select ID from IA_List where ID_CompanyMenuItem=@ID_CommentListCompanyMenuItem)
            update IA_List set
                ID_CompanyForm = @ID_CommentCompanyForm,
                ID_ListType = 'Plain',
                CustomSelectSql = @CustomSelectSql
            where ID=@ID_CommentList

    ---------------------- Vypnuté notifikace -------------------
        ---------------------- Založení -----------------------------
        declare @ID_NotificationListCompanyMenuItem ID 
        exec IA_CompanyMenuItem_NEW_Company @ID_Login=@ID_Login, @ID_MenuItem='List', @ID_Company=@ID_Company, @ID=@ID_NotificationListCompanyMenuItem out
        exec IA_CompanyMenuItemLanguage_NEW_Edit @ID_Login=@ID_Login, @ID_CompanyLanguage=@ID_CompanyBaseLanguage, @ID_CompanyMenuItem=@ID_NotificationListCompanyMenuItem, @DisplayName=@NotificationListTitle
        update IA_CompanyMenuItem set ID_CompanyMenuItemParent=@ID_ServiceFolderCompanyMenuItem where ID=@ID_NotificationListCompanyMenuItem

        ---------------------- Nastavení ----------------------------
            declare @ID_NotificationList ID
            set @ID_NotificationList = (select ID from IA_List where ID_CompanyMenuItem=@ID_NotificationListCompanyMenuItem)
            update IA_List set
                ID_CompanyForm = @ID_NotificationCompanyForm,
                FilterSql = 'IA_Data.ID_UserInsert = {ID_User}',
                ID_FormItemDescription = @ID_AdCommentFormItem,
                ID_ListType='Plain',
                DisplayNameSql = 'dbo.IA_DataItem_Name(@ID_Login, IA_Data.ID, ''InsertionName'')'
            where ID=@ID_NotificationList

---------------------- Výpis pro konfiguraci ----------------
    declare @Settings Note = (select 
                'ID_Module'= @ID_RootFolder,
                'ItemSettings'=(select 
                'ID_MyMarketplace'=@ID_MyAdListCompanyMenuItem,
                'ID_Marketplace'=@ID_AdListCompanyMenuItem,
                'ID_MarketplaceToApprove'=@ID_AdToApproveListCompanyMenuItem,
                'ID_MarketplaceForm'=@ID_AdFormCompanyMenuItem,
                'BatchSize'=15,
                'ID_CommentForm'=@ID_CommentFormCompanyMenuItem,
                'ID_Comments'=@ID_CommentListCompanyMenuItem,
                'ID_NotificationOffForm'=@ID_NotificationFormCompanyMenuItem,
                'ID_NotificationsOff'=@ID_NotificationListCompanyMenuItem,
                'ID_Section'=@ID_SectionListCompanyMenuItem
                for json path
            )
            for json path, without_array_wrapper)

    set @Settings=REPLACE(REPLACE(@Settings, '[', ''), ']', '')
    select @Settings

COMMIT TRAN
--ROLLBACK TRAN
END TRY

BEGIN CATCH
    IF (@@TRANCOUNT > 0)
    BEGIN
        ROLLBACK TRAN
    END
END CATCH