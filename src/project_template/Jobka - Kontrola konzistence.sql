-- Každý uživatel mohl přečíst sdělení pouze jednou 
select ID_Employee, ID_Post, count(ID) from IA_PostRead group by ID_Employee, ID_Post having count(ID)>1

-- Každý uživatel může odpovědět na dotaz pouze jednou
select ID_Employee, ID_Survey, count(ID) from IA_Answer group by ID_Employee, ID_Survey having count(ID)>1

-- Menu: Duplicitni poradi (taskid#49837)
select ID_Company, [Order], count(ID) from IA_CompanyMenuItem group by ID_Company, [Order] having count(ID)>1

-- Menu: Polozky typu CustomPage, nemaji zadanou CustomPage
select * from
IA_CompanyMenuItem
where
	ID_MenuItem='CustomPage'
	and ID_CustomPage is null

-- Menu: CustomPage je v menu vicekrat
select ID_Company, ID_CustomPage, count(ID) from IA_CompanyMenuItem where ID_MenuItem='CustomPage' group by ID_Company, ID_CustomPage having count(ID)>1

-- Menu: Preklady menu jsou prirazene k jazykum jine firmy
select IA_CompanyMenuItem.ID_Company, IA_CompanyMenuItemLanguage.*
from
	IA_CompanyMenuItem
	inner join IA_CompanyMenuItemLanguage on IA_CompanyMenuItemLanguage.ID_CompanyMenuItem=IA_CompanyMenuItem.ID
	inner join IA_CompanyLanguage on IA_CompanyLanguage.ID=IA_CompanyMenuItemLanguage.ID_CompanyLanguage
where IA_CompanyMenuItem.ID_Company<>IA_CompanyLanguage.ID_Company
order by IA_CompanyMenuItem.ID_Company, IA_CompanyMenuItemLanguage.ID_CompanyMenuItem

-- Menu: Pro schránky není založený záznam IA_TrustBox
select *
from
	IA_CompanyMenuItem
	left join IA_TrustBox on IA_TrustBox.ID_CompanyMenuItem=IA_CompanyMenuItem.ID
where
	IA_CompanyMenuItem.ID_MenuItem='TrustBox'
	and IA_TrustBox.ID is null

-- Menu: Pro formuláře není založení záznam IA_CompanyForm
select *
from
	IA_CompanyMenuItem
	left join IA_CompanyForm on IA_CompanyForm.ID_CompanyMenuItem=IA_CompanyMenuItem.ID
where
	IA_CompanyMenuItem.ID_MenuItem='Form'
	and IA_CompanyForm.ID is null

-- Menu: Pro slo�ku nen� zalo�en� z�znam IA_Folder
select *
from
	IA_CompanyMenuItem
	left join IA_Folder on IA_Folder.ID_CompanyMenuItem=IA_CompanyMenuItem.ID
where
	IA_CompanyMenuItem.ID_MenuItem='Folder'
	and IA_Folder.ID is null

-- Menu: Pro chat nen� zalo�en� z�znam IA_Chat
select *
from
	IA_CompanyMenuItem
	left join IA_Chat on IA_Chat.ID_CompanyMenuItem=IA_CompanyMenuItem.ID
where
	IA_CompanyMenuItem.ID_MenuItem='Chat'
	and IA_Chat.ID is null

-- Menu: Pro p�ehled nen� zalo�en� z�znam IA_List
select *
from
	IA_CompanyMenuItem
	left join IA_List on IA_List.ID_CompanyMenuItem=IA_CompanyMenuItem.ID
where
	IA_CompanyMenuItem.ID_MenuItem='List'
	and IA_List.ID is null

-- Dve schranky odkazuji na stejnou polozku menu
select ID_CompanyMenuItem, count(ID) from IA_TrustBox group by ID_CompanyMenuItem having count(ID)>1

-- Nesoulad IsActive v kombinaci zamestnanec - uzivatel - qr kod
select *
from
	IA_Employee
	inner join SF_User on SF_User.ID=IA_Employee.ID_User
	inner join IA_EmployeeQRCode on IA_EmployeeQRCode.ID_Employee=IA_Employee.ID
where
	not
	((IA_Employee.IsActive=1 and SF_User.IsActive=1 and IA_EmployeeQRCode.IsActive=1)
	or (IA_Employee.IsActive=0 and SF_User.IsActive=0 and IA_EmployeeQRCode.IsActive=0))

-- Dotaz: Ma oznaceno IsOptions=1, ale nema odpovedi
select *
from IA_Survey
where
	IsOptions=1
	and not exists(select * from IA_SurveyOption where IA_SurveyOption.ID_Survey=IA_Survey.ID)

-- Firma nema statistiky
select IA_Company.*
from
	IA_Company
	left join IA_CompanyStatistics on IA_Company.ID=IA_CompanyStatistics.ID_Company and IA_CompanyStatistics.IsActual=1
where IA_CompanyStatistics.ID is null

-- Firma ma vice aktualnich statistik
select IA_Company.ID, IA_Company.DisplayName, 'Count'=count(IA_CompanyStatistics.ID)
from
	IA_Company
	inner join IA_CompanyStatistics on IA_Company.ID=IA_CompanyStatistics.ID_Company and IA_CompanyStatistics.IsActual=1
group by IA_Company.ID, IA_Company.DisplayName
having count(IA_CompanyStatistics.ID)>1

-- Konverzace bez přiřazeného modulu chatu (dlaždice)
select *
from IA_Conversation
where IA_Conversation.[ID_Chat] is null

-- Zprávy bez přiřazené konverzace
select *
from IA_EmployeeMessage
where IA_EmployeeMessage.[ID_Conversation] is null

-- Zaměstnanci bez osobní skupiny - měla by se vytvářet po každém založení zaměstnance
select 
	IA_Employee.ID,
	IA_Employee.ID_Company,
	SF_User.DisplayName
from IA_Employee
	inner join SF_User on SF_User.ID = IA_Employee.ID_User
where not exists(
	select 1
	from IA_EmployeeGroup
		inner join IA_Group on IA_Group.ID = IA_EmployeeGroup.ID_Group
	where IA_EmployeeGroup.ID_Employee = IA_Employee.ID
		and IA_Group.IsEmployee = 1
)

-- Zaměstnanec musí mít právě jednu osobní skupinu
select IA_Employee.ID
from IA_Employee
    inner join IA_EmployeeGroup on IA_EmployeeGroup.ID_Employee = IA_Employee.ID
    inner join IA_Group on IA_Group.ID = IA_EmployeeGroup.ID_Group
        and IA_Group.IsEmployee = 1
group by IA_Employee.ID
having count(IA_Employee.ID) != 1

-- SF_User může mít maximálnějednoho zaměstnance
select 
	IA_Employee.ID,
	count(*)
from SF_User
inner join IA_Employee on IA_Employee.ID_User = SF_User.ID
where IA_Employee.IsActive = 1
group by IA_Employee.ID
having count(*) > 1

-- V rámci firmy může být pouze jedno osobní číslo aktivní
select 
	IA_Employee.PersonalNumber,
    IA_Employee.DisplayName,
	IA_Employee.ID_Company,
    count(*)
from
	IA_EmployeeView IA_Employee
	inner join IA_Company on IA_Company.[ID] = IA_Employee.[ID_Company]
	inner join IA_EmployeeState on IA_EmployeeState.ID=IA_Employee.ID_EmployeeState
where
    IA_Employee.IsActive = 1
group by 
    IA_Employee.PersonalNumber,
    IA_Employee.DisplayName,
    IA_Employee.ID_Company
having count(*) > 1

-- Existuje aktivní osobní skupina bez zaměstnance
select distinct
    IA_EmployeeView.ID,
    IA_EmployeeView.IsActive,
    IA_Group.ID,
    IA_Group.IsActive,
    IA_Group.DisplayName
from IA_Group
left join IA_EmployeeView on IA_EmployeeView.ID_PersonalGroup = IA_Group.ID
where IA_Group.IsActive = 1
    and IA_Group.IsEmployee = 1
    and IA_EmployeeView.ID is null
    -- and IA_Group.ID_Company = 1
order by IA_Group.DisplayName

-- Poznávací značka musí být unikátní k zaměstnanci
select 
    IA_LicensePlate.Code,
    count(*)
from IA_LicensePlate
inner join IA_Employee on IA_Employee.ID = IA_LicensePlate.ID_Employee
where IA_LicensePlate.IsActive = 1
    and IA_Employee.IsActive = 1
group by IA_LicensePlate.Code
having count(*) > 1