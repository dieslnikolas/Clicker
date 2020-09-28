import { Component } from '@angular/core';
import { Db } from 'src/utils/db'

@Component({
  selector: 'app-root',
  templateUrl: './index.component.html',
  styles: []
})
export class AppComponent {
    title = 'Frameduck';
	sql = '';

	onGenerateDB() {

		// try db
		let db = new Db();
		db.exec('select * from sys.tables');

		this.sql = `-- Database: EvidenceDevel
		--Date: 25.09.2020 12: 41: 35

		print 'CurrentTime: START - ' + convert(varchar, getdate(), 120)

		GO

		--Delete all constraints

		declare @table varchar(250), @constraint varchar(250)
		declare @cmd varchar(max)

		declare tbl cursor local forward_only static for
	select tables.name, constraints.name
from sysobjects as tables
inner join sysobjects as constraints on constraints.parent_obj = object_id(tables.name)
where tables.type = 'u'
and constraints.xtype in ('C', 'F', 'UQ', 'D')
and object_name(tables.id) in ('CR_Action', 'CR_ActionType', 'CR_Document', 'CR_DocumentState', 'CR_DocumentVersion', 'CR_Email', 'CR_EmailAddress', 'CR_EmailDocument', 'CR_EmailState', 'CR_EmailTemplate', 'CR_EmailType', 'CR_EmailTypeVariable', 'CR_Entity', 'CR_EntityLog', 'CR_EntityLogType', 'CR_EntityType', 'CR_Language', 'CR_Log', 'CR_Login', 'CR_LogSeverity', 'CR_LogType', 'CR_Module', 'CR_Operation', 'CR_PageState', 'CR_PageStateItem', 'CR_Permission', 'CR_PermissionGroup', 'CR_Role', 'CR_RolePermission', 'CR_Setting', 'CR_Table', 'CR_User', 'CR_UserPermission', 'CR_UserRole')
order by constraints.xtype asc

open tbl
fetch next from tbl into @table, @constraint
while (@@fetch_status=0)
begin
set @cmd = 'ALTER TABLE [' + @table + '] DROP CONSTRAINT [' + @constraint + ']'
exec(@cmd)
fetch next from tbl into @table, @constraint
end
close tbl
deallocate tbl

GO

print 'CurrentTime: ConstraintsDel - ' + convert(varchar, getdate(), 120)

GO

--Delete all indices
declare @sql varchar(max)
set @sql=''

declare @drop varchar(max)
declare tbl_Indexy cursor local forward_only static for
select 'DROP INDEX [' + object_name(sysindexes.id) + '].[' + sysindexes.name + ']
'
from
sysindexes
left join sysobjects on sysindexes.id = sysobjects.id
where sysindexes.indid <> 0
and(sysindexes.status & 64 = 0)
and(sysindexes.status & 2048 = 0)-- not primary key
and object_name(sysobjects.id) in ('CR_Action', 'CR_ActionType', 'CR_Document', 'CR_DocumentState', 'CR_DocumentVersion', 'CR_Email', 'CR_EmailAddress', 'CR_EmailDocument', 'CR_EmailState', 'CR_EmailTemplate', 'CR_EmailType', 'CR_EmailTypeVariable', 'CR_Entity', 'CR_EntityLog', 'CR_EntityLogType', 'CR_EntityType', 'CR_Language', 'CR_Log', 'CR_Login', 'CR_LogSeverity', 'CR_LogType', 'CR_Module', 'CR_Operation', 'CR_PageState', 'CR_PageStateItem', 'CR_Permission', 'CR_PermissionGroup', 'CR_Role', 'CR_RolePermission', 'CR_Setting', 'CR_Table', 'CR_User', 'CR_UserPermission', 'CR_UserRole')

open tbl_Indexy
fetch next from tbl_Indexy into @drop
while (@@fetch_status=0)
begin
set @sql=@sql+@drop
fetch next from tbl_Indexy into @drop
end
close tbl_Indexy
deallocate tbl_Indexy

exec(@sql)

GO

print 'CurrentTime: IndecesDel - ' + convert(varchar, getdate(), 120)

GO

--Delete all computed columns

declare  @table varchar(250), @column varchar(250), @sql varchar(max)

declare tbl cursor local forward_only static for
select sys.tables.name, col.name
from sys.computed_columns as col
inner join sys.tables on col.object_id = sys.tables.object_id
where sys.tables.name in ('CR_Action', 'CR_ActionType', 'CR_Document', 'CR_DocumentState', 'CR_DocumentVersion', 'CR_Email', 'CR_EmailAddress', 'CR_EmailDocument', 'CR_EmailState', 'CR_EmailTemplate', 'CR_EmailType', 'CR_EmailTypeVariable', 'CR_Entity', 'CR_EntityLog', 'CR_EntityLogType', 'CR_EntityType', 'CR_Language', 'CR_Log', 'CR_Login', 'CR_LogSeverity', 'CR_LogType', 'CR_Module', 'CR_Operation', 'CR_PageState', 'CR_PageStateItem', 'CR_Permission', 'CR_PermissionGroup', 'CR_Role', 'CR_RolePermission', 'CR_Setting', 'CR_Table', 'CR_User', 'CR_UserPermission', 'CR_UserRole')

open tbl
fetch next from tbl into @table, @column
while (@@fetch_status=0)
begin

set @sql='ALTER TABLE [dbo].[' + @table + '] DROP COLUMN [' + @column + ']'
exec(@sql)

fetch next from tbl into @table, @column
end
close tbl
deallocate tbl

GO

print 'CurrentTime: ColumnsComputedDel - ' + convert(varchar, getdate(), 120)

GO

--Delete all triggers

declare TblTriggers cursor local forward_only static for
select triggers.name from sys.triggers
inner join sys.tables as tables on triggers.parent_id = tables.object_id
where tables.name in (
	'CR_Action', 'CR_ActionType', 'CR_Document', 'CR_DocumentState', 'CR_DocumentVersion', 'CR_Email', 'CR_EmailAddress', 'CR_EmailDocument', 'CR_EmailState', 'CR_EmailTemplate', 'CR_EmailType', 'CR_EmailTypeVariable', 'CR_Entity', 'CR_EntityLog', 'CR_EntityLogType', 'CR_EntityType', 'CR_Language', 'CR_Log', 'CR_Login', 'CR_LogSeverity', 'CR_LogType', 'CR_Module', 'CR_Operation', 'CR_PageState', 'CR_PageStateItem', 'CR_Permission', 'CR_PermissionGroup', 'CR_Role', 'CR_RolePermission', 'CR_Setting', 'CR_Table', 'CR_User', 'CR_UserPermission', 'CR_UserRole')

declare @name varchar(250)
open TblTriggers
fetch next from TblTriggers into @name
while (@@FETCH_STATUS=0)
begin
exec('DROP TRIGGER [' + @name + ']')
fetch next from TblTriggers into @name
end
close TblTriggers
deallocate TblTriggers

GO

print 'CurrentTime: TriggersDel - ' + convert(varchar, getdate(), 120)

GO

--Create user defined types

if not exists(select * from sys.types where name = 'DN' and is_user_defined = 1)
begin
create type[DN] from nvarchar(255) NOT NULL
end

GO

if not exists(select * from sys.types where name = 'GUID' and is_user_defined = 1)
begin
create type[GUID] from uniqueidentifier NOT NULL
end

GO

if not exists(select * from sys.types where name = 'ID' and is_user_defined = 1)
begin
create type[ID] from int NOT NULL
end

GO

if not exists(select * from sys.types where name = 'IDVC' and is_user_defined = 1)
begin
create type[IDVC] from nvarchar(50) NOT NULL
end

GO

if not exists(select * from sys.types where name = 'IsActive' and is_user_defined = 1)
begin
create type[IsActive] from bit NOT NULL
end

GO

if not exists(select * from sys.types where name = 'Note' and is_user_defined = 1)
begin
create type[Note] from nvarchar(max) NULL
end

GO

if not exists(select * from sys.types where name = 'ValidateMessages' and is_user_defined = 1)
begin
create type[ValidateMessages] as table(
	[Property] nvarchar(255)  NULL,
		[DisplayName] nvarchar(255)  NULL,
			[ResourceName] nvarchar(255)  NULL,
				[Args] nvarchar(max)  NULL
	)
end

GO

if not exists(select * from sys.types where name = 'StringList' and is_user_defined = 1)
begin
create type[StringList] as table(
	[Value] Note  NULL
	)
end

GO

print 'CurrentTime: UserTypes - ' + convert(varchar, getdate(), 120)

GO

--Create tables(with PK)

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Action')
begin
CREATE TABLE[CR_Action]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_ActionType')
begin
CREATE TABLE[CR_ActionType]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Document')
begin
CREATE TABLE[CR_Document]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_DocumentState')
begin
CREATE TABLE[CR_DocumentState]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_DocumentVersion')
begin
CREATE TABLE[CR_DocumentVersion]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Email')
begin
CREATE TABLE[CR_Email]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EmailAddress')
begin
CREATE TABLE[CR_EmailAddress]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EmailDocument')
begin
CREATE TABLE[CR_EmailDocument]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EmailState')
begin
CREATE TABLE[CR_EmailState]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EmailTemplate')
begin
CREATE TABLE[CR_EmailTemplate]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EmailType')
begin
CREATE TABLE[CR_EmailType]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EmailTypeVariable')
begin
CREATE TABLE[CR_EmailTypeVariable]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Entity')
begin
CREATE TABLE[CR_Entity]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EntityLog')
begin
CREATE TABLE[CR_EntityLog]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EntityLogType')
begin
CREATE TABLE[CR_EntityLogType]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_EntityType')
begin
CREATE TABLE[CR_EntityType]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Language')
begin
CREATE TABLE[CR_Language]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Log')
begin
CREATE TABLE[CR_Log]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Login')
begin
CREATE TABLE[CR_Login]
	(
		[ID] GUID  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_LogSeverity')
begin
CREATE TABLE[CR_LogSeverity]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_LogType')
begin
CREATE TABLE[CR_LogType]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Module')
begin
CREATE TABLE[CR_Module]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Operation')
begin
CREATE TABLE[CR_Operation]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_PageState')
begin
CREATE TABLE[CR_PageState]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_PageStateItem')
begin
CREATE TABLE[CR_PageStateItem]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Permission')
begin
CREATE TABLE[CR_Permission]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_PermissionGroup')
begin
CREATE TABLE[CR_PermissionGroup]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Role')
begin
CREATE TABLE[CR_Role]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_RolePermission')
begin
CREATE TABLE[CR_RolePermission]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Setting')
begin
CREATE TABLE[CR_Setting]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_Table')
begin
CREATE TABLE[CR_Table]
	(
		[ID] IDVC  NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_User')
begin
CREATE TABLE[CR_User]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_UserPermission')
begin
CREATE TABLE[CR_UserPermission]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

if not exists(select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'CR_UserRole')
begin
CREATE TABLE[CR_UserRole]
	(
		[ID] ID IDENTITY NOT NULL
	)
end

GO

print 'CurrentTime: CreateTables - ' + convert(varchar, getdate(), 120)

GO

--Create columns

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'DisplayName')
alter table[CR_Action] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Action] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_Action] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID_Table')
alter table[CR_Action] add[ID_Table] IDVC NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID_Table' and IS_NULLABLE = 'YES')
	alter table[CR_Action] alter column[ID_Table] IDVC NULL
else
alter table[CR_Action] alter column[ID_Table] IDVC NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID_TableRelation')
alter table[CR_Action] add[ID_TableRelation] IDVC NULL
else
alter table[CR_Action] alter column[ID_TableRelation] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID_ActionType')
alter table[CR_Action] add[ID_ActionType] IDVC NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID_ActionType' and IS_NULLABLE = 'YES')
	alter table[CR_Action] alter column[ID_ActionType] IDVC NULL
else
alter table[CR_Action] alter column[ID_ActionType] IDVC NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'RequiredRecord')
alter table[CR_Action] add[RequiredRecord] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'RequiredRecord' and IS_NULLABLE = 'YES')
	alter table[CR_Action] alter column[RequiredRecord] bit NULL
else
alter table[CR_Action] alter column[RequiredRecord] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'IsAnonymous')
alter table[CR_Action] add[IsAnonymous] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'IsAnonymous' and IS_NULLABLE = 'YES')
	alter table[CR_Action] alter column[IsAnonymous] bit NULL
else
alter table[CR_Action] alter column[IsAnonymous] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_ActionType' and COLUMN_NAME = 'IsActive')
alter table[CR_ActionType] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_ActionType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_ActionType] alter column[IsActive] bit NULL
else
alter table[CR_ActionType] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_ActionType' and COLUMN_NAME = 'DisplayName')
alter table[CR_ActionType] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_ActionType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_ActionType] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_ActionType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Document' and COLUMN_NAME = 'ID_DocumentVersion')
alter table[CR_Document] add[ID_DocumentVersion] ID NULL
else
alter table[CR_Document] alter column[ID_DocumentVersion] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Document' and COLUMN_NAME = 'ID_DocumentState')
alter table[CR_Document] add[ID_DocumentState] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Document' and COLUMN_NAME = 'ID_DocumentState' and IS_NULLABLE = 'YES')
	alter table[CR_Document] alter column[ID_DocumentState] nvarchar(50) NULL
else
alter table[CR_Document] alter column[ID_DocumentState] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'DisplayName')
alter table[CR_DocumentState] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentState] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_DocumentState] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'IsActive')
alter table[CR_DocumentState] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentState] alter column[IsActive] bit NULL
else
alter table[CR_DocumentState] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'Description')
alter table[CR_DocumentState] add[Description] Note NULL
else
alter table[CR_DocumentState] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'DisplayName')
alter table[CR_DocumentVersion] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_DocumentVersion] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Date')
alter table[CR_DocumentVersion] add[Date] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[Date] datetime NULL
else
alter table[CR_DocumentVersion] alter column[Date] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ID_Document')
alter table[CR_DocumentVersion] add[ID_Document] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ID_Document' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[ID_Document] int NULL
else
alter table[CR_DocumentVersion] alter column[ID_Document] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ID_User')
alter table[CR_DocumentVersion] add[ID_User] ID NULL
else
alter table[CR_DocumentVersion] alter column[ID_User] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Size')
alter table[CR_DocumentVersion] add[Size] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Size' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[Size] int NULL
else
alter table[CR_DocumentVersion] alter column[Size] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'FileName')
alter table[CR_DocumentVersion] add[FileName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'FileName' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[FileName] nvarchar(255) NULL
else
alter table[CR_DocumentVersion] alter column[FileName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ContentType')
alter table[CR_DocumentVersion] add[ContentType] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ContentType' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[ContentType] nvarchar(255) NULL
else
alter table[CR_DocumentVersion] alter column[ContentType] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Extension')
alter table[CR_DocumentVersion] add[Extension] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Extension' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[Extension] nvarchar(255) NULL
else
alter table[CR_DocumentVersion] alter column[Extension] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Hash')
alter table[CR_DocumentVersion] add[Hash] DN NULL
else
alter table[CR_DocumentVersion] alter column[Hash] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Version')
alter table[CR_DocumentVersion] add[Version] int NULL
else
alter table[CR_DocumentVersion] alter column[Version] int NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ImageWidth')
alter table[CR_DocumentVersion] add[ImageWidth] int NULL
else
alter table[CR_DocumentVersion] alter column[ImageWidth] int NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ImageHeight')
alter table[CR_DocumentVersion] add[ImageHeight] int NULL
else
alter table[CR_DocumentVersion] alter column[ImageHeight] int NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Storage')
alter table[CR_DocumentVersion] add[Storage] nvarchar(284) NULL
else
alter table[CR_DocumentVersion] alter column[Storage] nvarchar(284) NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'FileNameExtension')
alter table[CR_DocumentVersion] add[FileNameExtension] nvarchar(510) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'FileNameExtension' and IS_NULLABLE = 'YES')
	alter table[CR_DocumentVersion] alter column[FileNameExtension] nvarchar(510) NULL
else
alter table[CR_DocumentVersion] alter column[FileNameExtension] nvarchar(510) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ID_EmailType')
alter table[CR_Email] add[ID_EmailType] IDVC NULL
else
alter table[CR_Email] alter column[ID_EmailType] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ID_Object')
alter table[CR_Email] add[ID_Object] ID NULL
else
alter table[CR_Email] alter column[ID_Object] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ID_EmailState')
alter table[CR_Email] add[ID_EmailState] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ID_EmailState' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[ID_EmailState] nvarchar(50) NULL
else
alter table[CR_Email] alter column[ID_EmailState] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'FromEmail')
alter table[CR_Email] add[FromEmail] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'FromEmail' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[FromEmail] nvarchar(255) NULL
else
alter table[CR_Email] alter column[FromEmail] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'FromName')
alter table[CR_Email] add[FromName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'FromName' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[FromName] nvarchar(255) NULL
else
alter table[CR_Email] alter column[FromName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ReplyToEmail')
alter table[CR_Email] add[ReplyToEmail] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ReplyToEmail' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[ReplyToEmail] nvarchar(255) NULL
else
alter table[CR_Email] alter column[ReplyToEmail] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ReplyToName')
alter table[CR_Email] add[ReplyToName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ReplyToName' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[ReplyToName] nvarchar(255) NULL
else
alter table[CR_Email] alter column[ReplyToName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Subject')
alter table[CR_Email] add[Subject] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Subject' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[Subject] nvarchar(255) NULL
else
alter table[CR_Email] alter column[Subject] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Body')
alter table[CR_Email] add[Body] nvarchar(max) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Body' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[Body] nvarchar(max) NULL
else
alter table[CR_Email] alter column[Body] nvarchar(max) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'BlindCopy')
alter table[CR_Email] add[BlindCopy] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'BlindCopy' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[BlindCopy] bit NULL
else
alter table[CR_Email] alter column[BlindCopy] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Date')
alter table[CR_Email] add[Date] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
	alter table[CR_Email] alter column[Date] datetime NULL
else
alter table[CR_Email] alter column[Date] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'DateSent')
alter table[CR_Email] add[DateSent] datetime NULL
else
alter table[CR_Email] alter column[DateSent] datetime NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ErrorMessage')
alter table[CR_Email] add[ErrorMessage] Note NULL
else
alter table[CR_Email] alter column[ErrorMessage] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailAddress' and COLUMN_NAME = 'ID_Email')
alter table[CR_EmailAddress] add[ID_Email] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailAddress' and COLUMN_NAME = 'ID_Email' and IS_NULLABLE = 'YES')
	alter table[CR_EmailAddress] alter column[ID_Email] int NULL
else
alter table[CR_EmailAddress] alter column[ID_Email] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailAddress' and COLUMN_NAME = 'Email')
alter table[CR_EmailAddress] add[Email] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailAddress' and COLUMN_NAME = 'Email' and IS_NULLABLE = 'YES')
	alter table[CR_EmailAddress] alter column[Email] nvarchar(255) NULL
else
alter table[CR_EmailAddress] alter column[Email] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailDocument' and COLUMN_NAME = 'ID_Email')
alter table[CR_EmailDocument] add[ID_Email] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailDocument' and COLUMN_NAME = 'ID_Email' and IS_NULLABLE = 'YES')
	alter table[CR_EmailDocument] alter column[ID_Email] int NULL
else
alter table[CR_EmailDocument] alter column[ID_Email] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailDocument' and COLUMN_NAME = 'ID_Document')
alter table[CR_EmailDocument] add[ID_Document] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailDocument' and COLUMN_NAME = 'ID_Document' and IS_NULLABLE = 'YES')
	alter table[CR_EmailDocument] alter column[ID_Document] int NULL
else
alter table[CR_EmailDocument] alter column[ID_Document] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailState' and COLUMN_NAME = 'IsActive')
alter table[CR_EmailState] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailState' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_EmailState] alter column[IsActive] bit NULL
else
alter table[CR_EmailState] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailState' and COLUMN_NAME = 'DisplayName')
alter table[CR_EmailState] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailState' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_EmailState] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_EmailState] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'DisplayName')
alter table[CR_EmailTemplate] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_EmailTemplate] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_EmailTemplate] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'ID_EmailType')
alter table[CR_EmailTemplate] add[ID_EmailType] IDVC NULL
else
alter table[CR_EmailTemplate] alter column[ID_EmailType] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'Body')
alter table[CR_EmailTemplate] add[Body] nvarchar(max) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'Body' and IS_NULLABLE = 'YES')
	alter table[CR_EmailTemplate] alter column[Body] nvarchar(max) NULL
else
alter table[CR_EmailTemplate] alter column[Body] nvarchar(max) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'Subject')
alter table[CR_EmailTemplate] add[Subject] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'Subject' and IS_NULLABLE = 'YES')
	alter table[CR_EmailTemplate] alter column[Subject] nvarchar(255) NULL
else
alter table[CR_EmailTemplate] alter column[Subject] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'IsActive')
alter table[CR_EmailType] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_EmailType] alter column[IsActive] bit NULL
else
alter table[CR_EmailType] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'DisplayName')
alter table[CR_EmailType] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_EmailType] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_EmailType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'ID_Table')
alter table[CR_EmailType] add[ID_Table] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'ID_Table' and IS_NULLABLE = 'YES')
	alter table[CR_EmailType] alter column[ID_Table] nvarchar(50) NULL
else
alter table[CR_EmailType] alter column[ID_Table] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'ID_EmailTemplate')
alter table[CR_EmailType] add[ID_EmailTemplate] ID NULL
else
alter table[CR_EmailType] alter column[ID_EmailTemplate] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'Procedure')
alter table[CR_EmailType] add[Procedure] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'Procedure' and IS_NULLABLE = 'YES')
	alter table[CR_EmailType] alter column[Procedure] nvarchar(255) NULL
else
alter table[CR_EmailType] alter column[Procedure] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'DisplayName')
alter table[CR_EmailTypeVariable] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_EmailTypeVariable] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_EmailTypeVariable] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'ID_EmailType')
alter table[CR_EmailTypeVariable] add[ID_EmailType] IDVC NULL
else
alter table[CR_EmailTypeVariable] alter column[ID_EmailType] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'Variable')
alter table[CR_EmailTypeVariable] add[Variable] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'Variable' and IS_NULLABLE = 'YES')
	alter table[CR_EmailTypeVariable] alter column[Variable] nvarchar(255) NULL
else
alter table[CR_EmailTypeVariable] alter column[Variable] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'ID_EntityType')
alter table[CR_Entity] add[ID_EntityType] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'ID_EntityType' and IS_NULLABLE = 'YES')
	alter table[CR_Entity] alter column[ID_EntityType] nvarchar(50) NULL
else
alter table[CR_Entity] alter column[ID_EntityType] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'DateInsert')
alter table[CR_Entity] add[DateInsert] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'DateInsert' and IS_NULLABLE = 'YES')
	alter table[CR_Entity] alter column[DateInsert] datetime NULL
else
alter table[CR_Entity] alter column[DateInsert] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'ID_UserInsert')
alter table[CR_Entity] add[ID_UserInsert] ID NULL
else
alter table[CR_Entity] alter column[ID_UserInsert] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'DateUpdate')
alter table[CR_Entity] add[DateUpdate] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'DateUpdate' and IS_NULLABLE = 'YES')
	alter table[CR_Entity] alter column[DateUpdate] datetime NULL
else
alter table[CR_Entity] alter column[DateUpdate] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'ID_UserUpdate')
alter table[CR_Entity] add[ID_UserUpdate] ID NULL
else
alter table[CR_Entity] alter column[ID_UserUpdate] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'DateDelete')
alter table[CR_Entity] add[DateDelete] datetime NULL
else
alter table[CR_Entity] alter column[DateDelete] datetime NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'ID_UserDelete')
alter table[CR_Entity] add[ID_UserDelete] ID NULL
else
alter table[CR_Entity] alter column[ID_UserDelete] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_Entity')
alter table[CR_EntityLog] add[ID_Entity] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_Entity' and IS_NULLABLE = 'YES')
	alter table[CR_EntityLog] alter column[ID_Entity] int NULL
else
alter table[CR_EntityLog] alter column[ID_Entity] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_User')
alter table[CR_EntityLog] add[ID_User] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
	alter table[CR_EntityLog] alter column[ID_User] int NULL
else
alter table[CR_EntityLog] alter column[ID_User] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'DateTime')
alter table[CR_EntityLog] add[DateTime] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'DateTime' and IS_NULLABLE = 'YES')
	alter table[CR_EntityLog] alter column[DateTime] datetime NULL
else
alter table[CR_EntityLog] alter column[DateTime] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_EntityLogType')
alter table[CR_EntityLog] add[ID_EntityLogType] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_EntityLogType' and IS_NULLABLE = 'YES')
	alter table[CR_EntityLog] alter column[ID_EntityLogType] nvarchar(50) NULL
else
alter table[CR_EntityLog] alter column[ID_EntityLogType] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'Description')
alter table[CR_EntityLog] add[Description] Note NULL
else
alter table[CR_EntityLog] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_Object')
alter table[CR_EntityLog] add[ID_Object] ID NULL
else
alter table[CR_EntityLog] alter column[ID_Object] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'Data')
alter table[CR_EntityLog] add[Data] DN NULL
else
alter table[CR_EntityLog] alter column[Data] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'IsHidden')
alter table[CR_EntityLog] add[IsHidden] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'IsHidden' and IS_NULLABLE = 'YES')
	alter table[CR_EntityLog] alter column[IsHidden] bit NULL
else
alter table[CR_EntityLog] alter column[IsHidden] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'IsActive')
alter table[CR_EntityLogType] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_EntityLogType] alter column[IsActive] bit NULL
else
alter table[CR_EntityLogType] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'DisplayName')
alter table[CR_EntityLogType] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_EntityLogType] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_EntityLogType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'ID_EntityType')
alter table[CR_EntityLogType] add[ID_EntityType] IDVC NULL
else
alter table[CR_EntityLogType] alter column[ID_EntityType] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'Note')
alter table[CR_EntityLogType] add[Note] Note NULL
else
alter table[CR_EntityLogType] alter column[Note] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'ID_Table')
alter table[CR_EntityType] add[ID_Table] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'ID_Table' and IS_NULLABLE = 'YES')
	alter table[CR_EntityType] alter column[ID_Table] nvarchar(50) NULL
else
alter table[CR_EntityType] alter column[ID_Table] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'DisplayName')
alter table[CR_EntityType] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_EntityType] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_EntityType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'ID_ActionLogAll')
alter table[CR_EntityType] add[ID_ActionLogAll] IDVC NULL
else
alter table[CR_EntityType] alter column[ID_ActionLogAll] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Language' and COLUMN_NAME = 'IsActive')
alter table[CR_Language] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Language' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_Language] alter column[IsActive] bit NULL
else
alter table[CR_Language] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Language' and COLUMN_NAME = 'DisplayName')
alter table[CR_Language] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Language' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Language] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_Language] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID_User')
alter table[CR_Log] add[ID_User] ID NULL
else
alter table[CR_Log] alter column[ID_User] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID_LogSeverity')
alter table[CR_Log] add[ID_LogSeverity] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID_LogSeverity' and IS_NULLABLE = 'YES')
	alter table[CR_Log] alter column[ID_LogSeverity] nvarchar(50) NULL
else
alter table[CR_Log] alter column[ID_LogSeverity] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID_LogType')
alter table[CR_Log] add[ID_LogType] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID_LogType' and IS_NULLABLE = 'YES')
	alter table[CR_Log] alter column[ID_LogType] nvarchar(50) NULL
else
alter table[CR_Log] alter column[ID_LogType] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'DisplayName')
alter table[CR_Log] add[DisplayName] nvarchar(max) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Log] alter column[DisplayName] nvarchar(max) NULL
else
alter table[CR_Log] alter column[DisplayName] nvarchar(max) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'Date')
alter table[CR_Log] add[Date] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
	alter table[CR_Log] alter column[Date] datetime NULL
else
alter table[CR_Log] alter column[Date] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'Url')
alter table[CR_Log] add[Url] DN NULL
else
alter table[CR_Log] alter column[Url] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'IP')
alter table[CR_Log] add[IP] DN NULL
else
alter table[CR_Log] alter column[IP] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'Browser')
alter table[CR_Log] add[Browser] DN NULL
else
alter table[CR_Log] alter column[Browser] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'Description')
alter table[CR_Log] add[Description] Note NULL
else
alter table[CR_Log] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'IsProcessed')
alter table[CR_Log] add[IsProcessed] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'IsProcessed' and IS_NULLABLE = 'YES')
	alter table[CR_Log] alter column[IsProcessed] bit NULL
else
alter table[CR_Log] alter column[IsProcessed] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'ID_User')
alter table[CR_Login] add[ID_User] ID NULL
else
alter table[CR_Login] alter column[ID_User] ID NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'IP')
alter table[CR_Login] add[IP] DN NULL
else
alter table[CR_Login] alter column[IP] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'Browser')
alter table[CR_Login] add[Browser] DN NULL
else
alter table[CR_Login] alter column[Browser] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'Date')
alter table[CR_Login] add[Date] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
	alter table[CR_Login] alter column[Date] datetime NULL
else
alter table[CR_Login] alter column[Date] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'DateLogout')
alter table[CR_Login] add[DateLogout] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'DateLogout' and IS_NULLABLE = 'YES')
	alter table[CR_Login] alter column[DateLogout] datetime NULL
else
alter table[CR_Login] alter column[DateLogout] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'IsSuccess')
alter table[CR_Login] add[IsSuccess] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'IsSuccess' and IS_NULLABLE = 'YES')
	alter table[CR_Login] alter column[IsSuccess] bit NULL
else
alter table[CR_Login] alter column[IsSuccess] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogSeverity' and COLUMN_NAME = 'IsActive')
alter table[CR_LogSeverity] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogSeverity' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_LogSeverity] alter column[IsActive] bit NULL
else
alter table[CR_LogSeverity] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogSeverity' and COLUMN_NAME = 'DisplayName')
alter table[CR_LogSeverity] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogSeverity' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_LogSeverity] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_LogSeverity] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogType' and COLUMN_NAME = 'IsActive')
alter table[CR_LogType] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_LogType] alter column[IsActive] bit NULL
else
alter table[CR_LogType] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogType' and COLUMN_NAME = 'DisplayName')
alter table[CR_LogType] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_LogType] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_LogType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'IsActive')
alter table[CR_Module] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_Module] alter column[IsActive] bit NULL
else
alter table[CR_Module] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'DisplayName')
alter table[CR_Module] add[DisplayName] DN NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Module] alter column[DisplayName] DN NULL
else
alter table[CR_Module] alter column[DisplayName] DN NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'ShortName')
alter table[CR_Module] add[ShortName] IDVC NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'ShortName' and IS_NULLABLE = 'YES')
	alter table[CR_Module] alter column[ShortName] IDVC NULL
else
alter table[CR_Module] alter column[ShortName] IDVC NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'Description')
alter table[CR_Module] add[Description] Note NULL
else
alter table[CR_Module] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'IsActive')
alter table[CR_Operation] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_Operation] alter column[IsActive] bit NULL
else
alter table[CR_Operation] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'DisplayName')
alter table[CR_Operation] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Operation] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_Operation] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'Operator')
alter table[CR_Operation] add[Operator] IDVC NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'Operator' and IS_NULLABLE = 'YES')
	alter table[CR_Operation] alter column[Operator] IDVC NULL
else
alter table[CR_Operation] alter column[Operator] IDVC NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'PageUrl')
alter table[CR_PageState] add[PageUrl] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'PageUrl' and IS_NULLABLE = 'YES')
	alter table[CR_PageState] alter column[PageUrl] nvarchar(255) NULL
else
alter table[CR_PageState] alter column[PageUrl] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'ID_User')
alter table[CR_PageState] add[ID_User] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
	alter table[CR_PageState] alter column[ID_User] int NULL
else
alter table[CR_PageState] alter column[ID_User] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'DisplayName')
alter table[CR_PageState] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_PageState] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_PageState] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'DateCreate')
alter table[CR_PageState] add[DateCreate] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'DateCreate' and IS_NULLABLE = 'YES')
	alter table[CR_PageState] alter column[DateCreate] datetime NULL
else
alter table[CR_PageState] alter column[DateCreate] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'IsDefault')
alter table[CR_PageState] add[IsDefault] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'IsDefault' and IS_NULLABLE = 'YES')
	alter table[CR_PageState] alter column[IsDefault] bit NULL
else
alter table[CR_PageState] alter column[IsDefault] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'ID_PageState')
alter table[CR_PageStateItem] add[ID_PageState] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'ID_PageState' and IS_NULLABLE = 'YES')
	alter table[CR_PageStateItem] alter column[ID_PageState] int NULL
else
alter table[CR_PageStateItem] alter column[ID_PageState] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'ControlID')
alter table[CR_PageStateItem] add[ControlID] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'ControlID' and IS_NULLABLE = 'YES')
	alter table[CR_PageStateItem] alter column[ControlID] nvarchar(255) NULL
else
alter table[CR_PageStateItem] alter column[ControlID] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'Key')
alter table[CR_PageStateItem] add[Key] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'Key' and IS_NULLABLE = 'YES')
	alter table[CR_PageStateItem] alter column[Key] nvarchar(255) NULL
else
alter table[CR_PageStateItem] alter column[Key] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'Value')
alter table[CR_PageStateItem] add[Value] Note NULL
else
alter table[CR_PageStateItem] alter column[Value] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'IsActive')
alter table[CR_Permission] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_Permission] alter column[IsActive] bit NULL
else
alter table[CR_Permission] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'DisplayName')
alter table[CR_Permission] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Permission] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_Permission] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'Description')
alter table[CR_Permission] add[Description] Note NULL
else
alter table[CR_Permission] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'ID_PermissionGroup')
alter table[CR_Permission] add[ID_PermissionGroup] IDVC NULL
else
alter table[CR_Permission] alter column[ID_PermissionGroup] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'IsActive')
alter table[CR_PermissionGroup] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_PermissionGroup] alter column[IsActive] bit NULL
else
alter table[CR_PermissionGroup] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'DisplayName')
alter table[CR_PermissionGroup] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_PermissionGroup] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_PermissionGroup] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'Description')
alter table[CR_PermissionGroup] add[Description] Note NULL
else
alter table[CR_PermissionGroup] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'IsActive')
alter table[CR_Role] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_Role] alter column[IsActive] bit NULL
else
alter table[CR_Role] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'DisplayName')
alter table[CR_Role] add[DisplayName] DN NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Role] alter column[DisplayName] DN NULL
else
alter table[CR_Role] alter column[DisplayName] DN NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'Key')
alter table[CR_Role] add[Key] DN NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'Key' and IS_NULLABLE = 'YES')
	alter table[CR_Role] alter column[Key] DN NULL
else
alter table[CR_Role] alter column[Key] DN NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'IsDefault')
alter table[CR_Role] add[IsDefault] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'IsDefault' and IS_NULLABLE = 'YES')
	alter table[CR_Role] alter column[IsDefault] bit NULL
else
alter table[CR_Role] alter column[IsDefault] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'ID_Entity')
alter table[CR_Role] add[ID_Entity] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'ID_Entity' and IS_NULLABLE = 'YES')
	alter table[CR_Role] alter column[ID_Entity] int NULL
else
alter table[CR_Role] alter column[ID_Entity] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_RolePermission' and COLUMN_NAME = 'ID_Role')
alter table[CR_RolePermission] add[ID_Role] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_RolePermission' and COLUMN_NAME = 'ID_Role' and IS_NULLABLE = 'YES')
	alter table[CR_RolePermission] alter column[ID_Role] int NULL
else
alter table[CR_RolePermission] alter column[ID_Role] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_RolePermission' and COLUMN_NAME = 'ID_Permission')
alter table[CR_RolePermission] add[ID_Permission] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_RolePermission' and COLUMN_NAME = 'ID_Permission' and IS_NULLABLE = 'YES')
	alter table[CR_RolePermission] alter column[ID_Permission] nvarchar(50) NULL
else
alter table[CR_RolePermission] alter column[ID_Permission] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Setting' and COLUMN_NAME = 'DisplayName')
alter table[CR_Setting] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Setting' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Setting] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_Setting] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Setting' and COLUMN_NAME = 'Description')
alter table[CR_Setting] add[Description] Note NULL
else
alter table[CR_Setting] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Setting' and COLUMN_NAME = 'Value')
alter table[CR_Setting] add[Value] Note NULL
else
alter table[CR_Setting] alter column[Value] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'IsActive')
alter table[CR_Table] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_Table] alter column[IsActive] bit NULL
else
alter table[CR_Table] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'DisplayName')
alter table[CR_Table] add[DisplayName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_Table] alter column[DisplayName] nvarchar(255) NULL
else
alter table[CR_Table] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'ID_TableParent')
alter table[CR_Table] add[ID_TableParent] IDVC NULL
else
alter table[CR_Table] alter column[ID_TableParent] IDVC NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'IsActionParent')
alter table[CR_Table] add[IsActionParent] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'IsActionParent' and IS_NULLABLE = 'YES')
	alter table[CR_Table] alter column[IsActionParent] bit NULL
else
alter table[CR_Table] alter column[IsActionParent] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'ID_Module')
alter table[CR_Table] add[ID_Module] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'ID_Module' and IS_NULLABLE = 'YES')
	alter table[CR_Table] alter column[ID_Module] nvarchar(50) NULL
else
alter table[CR_Table] alter column[ID_Module] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IsActive')
alter table[CR_User] add[IsActive] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[IsActive] bit NULL
else
alter table[CR_User] alter column[IsActive] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Email')
alter table[CR_User] add[Email] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Email' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[Email] nvarchar(255) NULL
else
alter table[CR_User] alter column[Email] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IsEnabled')
alter table[CR_User] add[IsEnabled] bit NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IsEnabled' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[IsEnabled] bit NULL
else
alter table[CR_User] alter column[IsEnabled] bit NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Username')
alter table[CR_User] add[Username] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Username' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[Username] nvarchar(255) NULL
else
alter table[CR_User] alter column[Username] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Password')
alter table[CR_User] add[Password] nvarchar(255) NULL
else
alter table[CR_User] alter column[Password] nvarchar(255) NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Salt')
alter table[CR_User] add[Salt] nvarchar(255) NULL
else
alter table[CR_User] alter column[Salt] nvarchar(255) NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'ID_Entity')
alter table[CR_User] add[ID_Entity] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'ID_Entity' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[ID_Entity] int NULL
else
alter table[CR_User] alter column[ID_Entity] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'ID_Language')
alter table[CR_User] add[ID_Language] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'ID_Language' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[ID_Language] nvarchar(50) NULL
else
alter table[CR_User] alter column[ID_Language] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'DegreeBefore')
alter table[CR_User] add[DegreeBefore] DN NULL
else
alter table[CR_User] alter column[DegreeBefore] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'DegreeAfter')
alter table[CR_User] add[DegreeAfter] DN NULL
else
alter table[CR_User] alter column[DegreeAfter] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'FirstName')
alter table[CR_User] add[FirstName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'FirstName' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[FirstName] nvarchar(255) NULL
else
alter table[CR_User] alter column[FirstName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'LastName')
alter table[CR_User] add[LastName] nvarchar(255) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'LastName' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[LastName] nvarchar(255) NULL
else
alter table[CR_User] alter column[LastName] nvarchar(255) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Mobile')
alter table[CR_User] add[Mobile] DN NULL
else
alter table[CR_User] alter column[Mobile] DN NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'BirthDay')
alter table[CR_User] add[BirthDay] date NULL
else
alter table[CR_User] alter column[BirthDay] date NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'PasswordRequestTimeout')
alter table[CR_User] add[PasswordRequestTimeout] datetime NULL
else
alter table[CR_User] alter column[PasswordRequestTimeout] datetime NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'PasswordRequest')
alter table[CR_User] add[PasswordRequest] uniqueidentifier NULL
else
alter table[CR_User] alter column[PasswordRequest] uniqueidentifier NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'DateLastPasswordChange')
alter table[CR_User] add[DateLastPasswordChange] datetime NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'DateLastPasswordChange' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[DateLastPasswordChange] datetime NULL
else
alter table[CR_User] alter column[DateLastPasswordChange] datetime NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IncorrectPasswordCount')
alter table[CR_User] add[IncorrectPasswordCount] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IncorrectPasswordCount' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[IncorrectPasswordCount] int NULL
else
alter table[CR_User] alter column[IncorrectPasswordCount] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Description')
alter table[CR_User] add[Description] Note NULL
else
alter table[CR_User] alter column[Description] Note NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'DisplayName')
alter table[CR_User] add[DisplayName] nvarchar(511) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
	alter table[CR_User] alter column[DisplayName] nvarchar(511) NULL
else
alter table[CR_User] alter column[DisplayName] nvarchar(511) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserPermission' and COLUMN_NAME = 'ID_User')
alter table[CR_UserPermission] add[ID_User] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserPermission' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
	alter table[CR_UserPermission] alter column[ID_User] int NULL
else
alter table[CR_UserPermission] alter column[ID_User] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserPermission' and COLUMN_NAME = 'ID_Permission')
alter table[CR_UserPermission] add[ID_Permission] nvarchar(50) NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserPermission' and COLUMN_NAME = 'ID_Permission' and IS_NULLABLE = 'YES')
	alter table[CR_UserPermission] alter column[ID_Permission] nvarchar(50) NULL
else
alter table[CR_UserPermission] alter column[ID_Permission] nvarchar(50) NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserRole' and COLUMN_NAME = 'ID_User')
alter table[CR_UserRole] add[ID_User] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserRole' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
	alter table[CR_UserRole] alter column[ID_User] int NULL
else
alter table[CR_UserRole] alter column[ID_User] int NOT NULL

GO

if not exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserRole' and COLUMN_NAME = 'ID_Role')
alter table[CR_UserRole] add[ID_Role] int NULL
else if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserRole' and COLUMN_NAME = 'ID_Role' and IS_NULLABLE = 'YES')
	alter table[CR_UserRole] alter column[ID_Role] int NULL
else
alter table[CR_UserRole] alter column[ID_Role] int NOT NULL

GO

print 'CurrentTime: Columns - ' + convert(varchar, getdate(), 120)

GO

--Create / update functions before views

print 'CurrentTime: Functions before views - ' + convert(varchar, getdate(), 120)

GO

--Create / update views

print 'CurrentTime: Views - ' + convert(varchar, getdate(), 120)

GO

--Create / update functions after views

if exists(select * from sysobjects where name = 'CR_Action_ALL_Tab')
begin
drop function CR_Action_ALL_Tab
end

GO




/* Vrátí seznam všech akcí, které lze vyvolat nad zadanou tabulkou (bez uplatnění skutečných oprávnění) */
CREATE FUNCTION[dbo].[CR_Action_ALL_Tab]
	(
	@ID_Login GUID, --přihlašovací token
@ID IDVC, --akce
@ID_Table IDVC, --tabulka
@RequiredRecord bit-- zda chci akce, které vyžadují záznam v tabulce
)
RETURNS TABLE
RETURN
	(
		select
		ID, DisplayName
	from
		CR_Action
	where
			(ID =@ID or @ID is null)
and ID_Table =@ID_Table
and RequiredRecord =@RequiredRecord
and(IsAnonymous = 1 or @ID_Login is not null)
)








GO

if exists(select * from sysobjects where name = 'CR_Login_ALL_Permission')
begin
drop function CR_Login_ALL_Permission
end

GO




/* Vypis vsech opravneni uzivatele */
CREATE FUNCTION[dbo].[CR_Login_ALL_Permission]
	(	
	@ID_Login GUID
)
RETURNS TABLE
AS
RETURN
	(
		select CR_UserPermission.ID_Permission 
	from CR_UserPermission 
	inner join CR_Login on CR_Login.ID_User = CR_UserPermission.ID_User
	where CR_Login.ID =@ID_Login
union
select CR_RolePermission.ID_Permission from CR_UserRole
inner join CR_RolePermission on CR_RolePermission.ID_Role = CR_UserRole.ID_Role
inner join CR_Login on CR_Login.ID_User = CR_UserRole.ID_User
where CR_Login.ID =@ID_Login
)







GO

if exists(select * from sysobjects where name = 'CR_Login_User')
begin
drop function CR_Login_User
end

GO





/* Vrati ID uživatele pro prihlaseneho uzivatele */
CREATE FUNCTION[dbo].[CR_Login_User]
	(
	@ID GUID
)
RETURNS ID
BEGIN
return (select top(1) ID_User from CR_Login where ID =@ID)
END








GO

if exists(select * from sysobjects where name = 'CR_Permission_ALL_Login')
begin
drop function CR_Permission_ALL_Login
end

GO




/* Vrátí seznam všech práv pro uživatele */
CREATE FUNCTION[dbo].[CR_Permission_ALL_Login]
	(
	@ID_Login GUID-- přihlašovací token
)
RETURNS TABLE
AS
RETURN
	(
		select
		CR_Permission.ID, CR_Permission.DisplayName
	from
		[CR_Login]
		inner join[CR_User] on[CR_User].ID = [CR_Login].ID_User
		inner join CR_UserRole on CR_UserRole.ID_User = [CR_User].ID
		inner join CR_RolePermission on CR_RolePermission.ID_Role = CR_UserRole.ID_Role
		inner join CR_Permission on CR_Permission.ID = CR_RolePermission.ID_Permission
	where
		CR_Login.ID =@ID_Login
union
select
CR_Permission.ID, CR_Permission.DisplayName
from
[CR_Login]
inner join[CR_User] on[CR_User].ID = [CR_Login].ID_User
inner join CR_UserPermission on CR_UserPermission.ID_User = [CR_User].ID
inner join CR_Permission on CR_Permission.ID = CR_UserPermission.ID_Permission
where
CR_Login.ID =@ID_Login
)








GO

if exists(select * from sysobjects where name = 'CR_Setting_Value')
begin
drop function CR_Setting_Value
end

GO




/* Return settings value */
CREATE FUNCTION[dbo].[CR_Setting_Value]
	(@ID IDVC)
RETURNS Note
BEGIN
return (select[Value] from CR_Setting where ID =@ID)
END







GO

print 'CurrentTime: Functions after views - ' + convert(varchar, getdate(), 120)

GO

print 'CurrentTime: Data - ' + convert(varchar, getdate(), 120)

GO

print 'CurrentTime: Delete data - ' + convert(varchar, getdate(), 120)

GO

--Create constraints

print 'CurrentTime: Constraints: Check - ' + convert(varchar, getdate(), 120)

GO

alter table[CR_ActionType] ADD CONSTRAINT[DF_CR_ActionType_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_ActionType] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Document] ADD CONSTRAINT[DF_CR_Document_ID_DocumentState] DEFAULT((N'ready')) FOR[ID_DocumentState]

GO

update[CR_Document] set[ID_DocumentState] = (N'ready') where[ID_DocumentState] is null

GO

alter table[CR_DocumentState] ADD CONSTRAINT[DF_CR_DocumentState_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_DocumentState] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_DocumentVersion] ADD CONSTRAINT[DF_CR_DocumentVersion_Date] DEFAULT((getdate())) FOR[Date]

GO

update[CR_DocumentVersion] set[Date] = (getdate()) where[Date] is null

GO

alter table[CR_Email] ADD CONSTRAINT[DF_CR_Email_Date] DEFAULT((getdate())) FOR[Date]

GO

update[CR_Email] set[Date] = (getdate()) where[Date] is null

GO

alter table[CR_EmailState] ADD CONSTRAINT[DF_CR_EmailState_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_EmailState] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_EmailType] ADD CONSTRAINT[DF_CR_EmailType_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_EmailType] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Entity] ADD CONSTRAINT[DF_CR_Entity_DateInsert] DEFAULT((getdate())) FOR[DateInsert]

GO

update[CR_Entity] set[DateInsert] = (getdate()) where[DateInsert] is null

GO

alter table[CR_Entity] ADD CONSTRAINT[DF_CR_Entity_DateUpdate] DEFAULT((getdate())) FOR[DateUpdate]

GO

update[CR_Entity] set[DateUpdate] = (getdate()) where[DateUpdate] is null

GO

alter table[CR_EntityLog] ADD CONSTRAINT[DF_CR_EntityLog_DateTime] DEFAULT((getdate())) FOR[DateTime]

GO

update[CR_EntityLog] set[DateTime] = (getdate()) where[DateTime] is null

GO

alter table[CR_EntityLog] ADD CONSTRAINT[DF_CR_EntityLog_IsHidden] DEFAULT(((0))) FOR[IsHidden]

GO

update[CR_EntityLog] set[IsHidden] = ((0)) where[IsHidden] is null

GO

alter table[CR_EntityLogType] ADD CONSTRAINT[DF_CR_EntityLogType_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_EntityLogType] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Language] ADD CONSTRAINT[DF_CR_Language_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_Language] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Log] ADD CONSTRAINT[DF_CR_Log_Date] DEFAULT((getdate())) FOR[Date]

GO

update[CR_Log] set[Date] = (getdate()) where[Date] is null

GO

alter table[CR_Log] ADD CONSTRAINT[DF_CR_Log_IsProcessed] DEFAULT(((0))) FOR[IsProcessed]

GO

update[CR_Log] set[IsProcessed] = ((0)) where[IsProcessed] is null

GO

alter table[CR_Login] ADD CONSTRAINT[DF_CR_Login_Date] DEFAULT((getdate())) FOR[Date]

GO

update[CR_Login] set[Date] = (getdate()) where[Date] is null

GO

alter table[CR_Login] ADD CONSTRAINT[DF_CR_Login_DateLogout] DEFAULT((dateadd(minute, (30), getdate()))) FOR[DateLogout]

GO

update[CR_Login] set[DateLogout] = (dateadd(minute, (30), getdate())) where[DateLogout] is null

GO

alter table[CR_Login] ADD CONSTRAINT[DF_CR_Login_IsAuthenticated] DEFAULT(((0))) FOR[IsSuccess]

GO

update[CR_Login] set[IsSuccess] = ((0)) where[IsSuccess] is null

GO

alter table[CR_LogSeverity] ADD CONSTRAINT[DF_CR_LogSeverity_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_LogSeverity] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_LogType] ADD CONSTRAINT[DF_CR_LogType_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_LogType] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Module] ADD CONSTRAINT[DF_CR_Module_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_Module] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Operation] ADD CONSTRAINT[DF_CR_Operation_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_Operation] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_PageState] ADD CONSTRAINT[DF_CR_PageState_DateCreate] DEFAULT((getdate())) FOR[DateCreate]

GO

update[CR_PageState] set[DateCreate] = (getdate()) where[DateCreate] is null

GO

alter table[CR_PageState] ADD CONSTRAINT[DF_CR_PageState_IsDefault] DEFAULT(((0))) FOR[IsDefault]

GO

update[CR_PageState] set[IsDefault] = ((0)) where[IsDefault] is null

GO

alter table[CR_Permission] ADD CONSTRAINT[DF_CR_Permission_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_Permission] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_PermissionGroup] ADD CONSTRAINT[DF_CR_PermissionGroup_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_PermissionGroup] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Role] ADD CONSTRAINT[DF_CR_Role_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_Role] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_Role] ADD CONSTRAINT[DF_CR_Role_IsDefault] DEFAULT(((0))) FOR[IsDefault]

GO

update[CR_Role] set[IsDefault] = ((0)) where[IsDefault] is null

GO

alter table[CR_Table] ADD CONSTRAINT[DF_CR_Table_Module] DEFAULT((N'core')) FOR[ID_Module]

GO

update[CR_Table] set[ID_Module] = (N'core') where[ID_Module] is null

GO

alter table[CR_Table] ADD CONSTRAINT[DF_CR_Table_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_Table] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_User] ADD CONSTRAINT[DF_CR_User_DateLastPasswordChange] DEFAULT((getdate())) FOR[DateLastPasswordChange]

GO

update[CR_User] set[DateLastPasswordChange] = (getdate()) where[DateLastPasswordChange] is null

GO

alter table[CR_User] ADD CONSTRAINT[DF_CR_User_ID_Language] DEFAULT((N'cs')) FOR[ID_Language]

GO

update[CR_User] set[ID_Language] = (N'cs') where[ID_Language] is null

GO

alter table[CR_User] ADD CONSTRAINT[DF_CR_User_IncorrectPasswordCount] DEFAULT(((0))) FOR[IncorrectPasswordCount]

GO

update[CR_User] set[IncorrectPasswordCount] = ((0)) where[IncorrectPasswordCount] is null

GO

alter table[CR_User] ADD CONSTRAINT[DF_CR_User_IsActive] DEFAULT(((1))) FOR[IsActive]

GO

update[CR_User] set[IsActive] = ((1)) where[IsActive] is null

GO

alter table[CR_User] ADD CONSTRAINT[DF_CR_User_IsEnabled] DEFAULT(((1))) FOR[IsEnabled]

GO

update[CR_User] set[IsEnabled] = ((1)) where[IsEnabled] is null

GO

print 'CurrentTime: Constraints: Default - ' + convert(varchar, getdate(), 120)

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Action] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Action] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID_Table' and IS_NULLABLE = 'YES')
    alter table[CR_Action] alter column[ID_Table] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'ID_ActionType' and IS_NULLABLE = 'YES')
    alter table[CR_Action] alter column[ID_ActionType] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'RequiredRecord' and IS_NULLABLE = 'YES')
    alter table[CR_Action] alter column[RequiredRecord] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Action' and COLUMN_NAME = 'IsAnonymous' and IS_NULLABLE = 'YES')
    alter table[CR_Action] alter column[IsAnonymous] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_ActionType' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_ActionType] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_ActionType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_ActionType] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_ActionType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_ActionType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Document' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Document] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Document' and COLUMN_NAME = 'ID_DocumentState' and IS_NULLABLE = 'YES')
    alter table[CR_Document] alter column[ID_DocumentState] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentState] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentState] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentState' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentState] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[Date] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ID_Document' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[ID_Document] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Size' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[Size] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'FileName' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[FileName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'ContentType' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[ContentType] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_DocumentVersion' and COLUMN_NAME = 'Extension' and IS_NULLABLE = 'YES')
    alter table[CR_DocumentVersion] alter column[Extension] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ID_EmailState' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[ID_EmailState] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'FromEmail' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[FromEmail] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'FromName' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[FromName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ReplyToEmail' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[ReplyToEmail] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'ReplyToName' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[ReplyToName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Subject' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[Subject] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Body' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[Body] nvarchar(max) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'BlindCopy' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[BlindCopy] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Email' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
    alter table[CR_Email] alter column[Date] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailAddress' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EmailAddress] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailAddress' and COLUMN_NAME = 'ID_Email' and IS_NULLABLE = 'YES')
    alter table[CR_EmailAddress] alter column[ID_Email] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailAddress' and COLUMN_NAME = 'Email' and IS_NULLABLE = 'YES')
    alter table[CR_EmailAddress] alter column[Email] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailDocument' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EmailDocument] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailDocument' and COLUMN_NAME = 'ID_Email' and IS_NULLABLE = 'YES')
    alter table[CR_EmailDocument] alter column[ID_Email] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailDocument' and COLUMN_NAME = 'ID_Document' and IS_NULLABLE = 'YES')
    alter table[CR_EmailDocument] alter column[ID_Document] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailState' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EmailState] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailState' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_EmailState] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailState' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_EmailState] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EmailTemplate] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_EmailTemplate] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'Body' and IS_NULLABLE = 'YES')
    alter table[CR_EmailTemplate] alter column[Body] nvarchar(max) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTemplate' and COLUMN_NAME = 'Subject' and IS_NULLABLE = 'YES')
    alter table[CR_EmailTemplate] alter column[Subject] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EmailType] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_EmailType] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_EmailType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'ID_Table' and IS_NULLABLE = 'YES')
    alter table[CR_EmailType] alter column[ID_Table] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailType' and COLUMN_NAME = 'Procedure' and IS_NULLABLE = 'YES')
    alter table[CR_EmailType] alter column[Procedure] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EmailTypeVariable] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_EmailTypeVariable] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EmailTypeVariable' and COLUMN_NAME = 'Variable' and IS_NULLABLE = 'YES')
    alter table[CR_EmailTypeVariable] alter column[Variable] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Entity] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'ID_EntityType' and IS_NULLABLE = 'YES')
    alter table[CR_Entity] alter column[ID_EntityType] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'DateInsert' and IS_NULLABLE = 'YES')
    alter table[CR_Entity] alter column[DateInsert] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Entity' and COLUMN_NAME = 'DateUpdate' and IS_NULLABLE = 'YES')
    alter table[CR_Entity] alter column[DateUpdate] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLog] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_Entity' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLog] alter column[ID_Entity] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLog] alter column[ID_User] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'DateTime' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLog] alter column[DateTime] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'ID_EntityLogType' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLog] alter column[ID_EntityLogType] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLog' and COLUMN_NAME = 'IsHidden' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLog] alter column[IsHidden] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLogType] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLogType] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityLogType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_EntityLogType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_EntityType] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'ID_Table' and IS_NULLABLE = 'YES')
    alter table[CR_EntityType] alter column[ID_Table] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_EntityType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_EntityType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Language' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Language] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Language' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_Language] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Language' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Language] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Log] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID_LogSeverity' and IS_NULLABLE = 'YES')
    alter table[CR_Log] alter column[ID_LogSeverity] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'ID_LogType' and IS_NULLABLE = 'YES')
    alter table[CR_Log] alter column[ID_LogType] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Log] alter column[DisplayName] nvarchar(max) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
    alter table[CR_Log] alter column[Date] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Log' and COLUMN_NAME = 'IsProcessed' and IS_NULLABLE = 'YES')
    alter table[CR_Log] alter column[IsProcessed] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Login] alter column[ID] uniqueidentifier NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'Date' and IS_NULLABLE = 'YES')
    alter table[CR_Login] alter column[Date] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'DateLogout' and IS_NULLABLE = 'YES')
    alter table[CR_Login] alter column[DateLogout] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Login' and COLUMN_NAME = 'IsSuccess' and IS_NULLABLE = 'YES')
    alter table[CR_Login] alter column[IsSuccess] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogSeverity' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_LogSeverity] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogSeverity' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_LogSeverity] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogSeverity' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_LogSeverity] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogType' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_LogType] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogType' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_LogType] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_LogType' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_LogType] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Module] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_Module] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Module] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Module' and COLUMN_NAME = 'ShortName' and IS_NULLABLE = 'YES')
    alter table[CR_Module] alter column[ShortName] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Operation] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_Operation] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Operation] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Operation' and COLUMN_NAME = 'Operator' and IS_NULLABLE = 'YES')
    alter table[CR_Operation] alter column[Operator] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_PageState] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'PageUrl' and IS_NULLABLE = 'YES')
    alter table[CR_PageState] alter column[PageUrl] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
    alter table[CR_PageState] alter column[ID_User] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_PageState] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'DateCreate' and IS_NULLABLE = 'YES')
    alter table[CR_PageState] alter column[DateCreate] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageState' and COLUMN_NAME = 'IsDefault' and IS_NULLABLE = 'YES')
    alter table[CR_PageState] alter column[IsDefault] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_PageStateItem] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'ID_PageState' and IS_NULLABLE = 'YES')
    alter table[CR_PageStateItem] alter column[ID_PageState] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'ControlID' and IS_NULLABLE = 'YES')
    alter table[CR_PageStateItem] alter column[ControlID] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PageStateItem' and COLUMN_NAME = 'Key' and IS_NULLABLE = 'YES')
    alter table[CR_PageStateItem] alter column[Key] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Permission] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_Permission] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Permission' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Permission] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_PermissionGroup] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_PermissionGroup] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_PermissionGroup' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_PermissionGroup] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Role] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_Role] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Role] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'Key' and IS_NULLABLE = 'YES')
    alter table[CR_Role] alter column[Key] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'IsDefault' and IS_NULLABLE = 'YES')
    alter table[CR_Role] alter column[IsDefault] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Role' and COLUMN_NAME = 'ID_Entity' and IS_NULLABLE = 'YES')
    alter table[CR_Role] alter column[ID_Entity] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_RolePermission' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_RolePermission] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_RolePermission' and COLUMN_NAME = 'ID_Role' and IS_NULLABLE = 'YES')
    alter table[CR_RolePermission] alter column[ID_Role] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_RolePermission' and COLUMN_NAME = 'ID_Permission' and IS_NULLABLE = 'YES')
    alter table[CR_RolePermission] alter column[ID_Permission] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Setting' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Setting] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Setting' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Setting] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_Table] alter column[ID] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_Table] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'DisplayName' and IS_NULLABLE = 'YES')
    alter table[CR_Table] alter column[DisplayName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'IsActionParent' and IS_NULLABLE = 'YES')
    alter table[CR_Table] alter column[IsActionParent] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_Table' and COLUMN_NAME = 'ID_Module' and IS_NULLABLE = 'YES')
    alter table[CR_Table] alter column[ID_Module] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IsActive' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[IsActive] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Email' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[Email] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IsEnabled' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[IsEnabled] bit NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'Username' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[Username] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'ID_Entity' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[ID_Entity] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'ID_Language' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[ID_Language] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'FirstName' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[FirstName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'LastName' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[LastName] nvarchar(255) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'DateLastPasswordChange' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[DateLastPasswordChange] datetime NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_User' and COLUMN_NAME = 'IncorrectPasswordCount' and IS_NULLABLE = 'YES')
    alter table[CR_User] alter column[IncorrectPasswordCount] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserPermission' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_UserPermission] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserPermission' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
    alter table[CR_UserPermission] alter column[ID_User] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserPermission' and COLUMN_NAME = 'ID_Permission' and IS_NULLABLE = 'YES')
    alter table[CR_UserPermission] alter column[ID_Permission] nvarchar(50) NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserRole' and COLUMN_NAME = 'ID' and IS_NULLABLE = 'YES')
    alter table[CR_UserRole] alter column[ID] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserRole' and COLUMN_NAME = 'ID_User' and IS_NULLABLE = 'YES')
    alter table[CR_UserRole] alter column[ID_User] int NOT NULL

GO

if exists(select * from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'CR_UserRole' and COLUMN_NAME = 'ID_Role' and IS_NULLABLE = 'YES')
    alter table[CR_UserRole] alter column[ID_Role] int NOT NULL

GO

print 'CurrentTime: Constraints: NotNull - ' + convert(varchar, getdate(), 120)

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Operation' and is_primary_key = 1)
alter table[CR_Operation] ADD CONSTRAINT[PK_CR_Operation] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_ActionType' and is_primary_key = 1)
alter table[CR_ActionType] ADD CONSTRAINT[PK_CR_ActionType] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Log' and is_primary_key = 1)
alter table[CR_Log] ADD CONSTRAINT[PK_CR_Log] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Login' and is_primary_key = 1)
alter table[CR_Login] ADD CONSTRAINT[PK_CR_Login] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_LogSeverity' and is_primary_key = 1)
alter table[CR_LogSeverity] ADD CONSTRAINT[PK_CR_LogSeverity] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_LogType' and is_primary_key = 1)
alter table[CR_LogType] ADD CONSTRAINT[PK_CR_LogType] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_PageState' and is_primary_key = 1)
alter table[CR_PageState] ADD CONSTRAINT[PK_CR_PageState] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Action' and is_primary_key = 1)
alter table[CR_Action] ADD CONSTRAINT[PK_CR_Action] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_PageStateItem' and is_primary_key = 1)
alter table[CR_PageStateItem] ADD CONSTRAINT[PK_CR_PageStateItem] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Permission' and is_primary_key = 1)
alter table[CR_Permission] ADD CONSTRAINT[PK_CR_Permission] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_PermissionGroup' and is_primary_key = 1)
alter table[CR_PermissionGroup] ADD CONSTRAINT[PK_CR_PermissionGroup] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Role' and is_primary_key = 1)
alter table[CR_Role] ADD CONSTRAINT[PK_CR_Role] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_RolePermission' and is_primary_key = 1)
alter table[CR_RolePermission] ADD CONSTRAINT[PK_CR_RolePermission] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Setting' and is_primary_key = 1)
alter table[CR_Setting] ADD CONSTRAINT[PK_CR_Setting] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Table' and is_primary_key = 1)
alter table[CR_Table] ADD CONSTRAINT[PK_CR_Table] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_UserPermission' and is_primary_key = 1)
alter table[CR_UserPermission] ADD CONSTRAINT[PK_CR_UserPermission] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_UserRole' and is_primary_key = 1)
alter table[CR_UserRole] ADD CONSTRAINT[PK_CR_UserRole] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Document' and is_primary_key = 1)
alter table[CR_Document] ADD CONSTRAINT[PK_CR_Document] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_DocumentState' and is_primary_key = 1)
alter table[CR_DocumentState] ADD CONSTRAINT[PK_CR_DocumentState] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_DocumentVersion' and is_primary_key = 1)
alter table[CR_DocumentVersion] ADD CONSTRAINT[PK_CR_DocumentVersion] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Entity' and is_primary_key = 1)
alter table[CR_Entity] ADD CONSTRAINT[PK_CR_Entity] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EntityLog' and is_primary_key = 1)
alter table[CR_EntityLog] ADD CONSTRAINT[PK_CR_EntityLog] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EntityLogType' and is_primary_key = 1)
alter table[CR_EntityLogType] ADD CONSTRAINT[PK_CR_EntityLogType] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EntityType' and is_primary_key = 1)
alter table[CR_EntityType] ADD CONSTRAINT[PK_CR_EntityType] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Email' and is_primary_key = 1)
alter table[CR_Email] ADD CONSTRAINT[PK_CR_Email] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EmailAddress' and is_primary_key = 1)
alter table[CR_EmailAddress] ADD CONSTRAINT[PK_CR_EmailAddress] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EmailDocument' and is_primary_key = 1)
alter table[CR_EmailDocument] ADD CONSTRAINT[PK_CR_EmailDocument] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EmailState' and is_primary_key = 1)
alter table[CR_EmailState] ADD CONSTRAINT[PK_CR_EmailState] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EmailTemplate' and is_primary_key = 1)
alter table[CR_EmailTemplate] ADD CONSTRAINT[PK_CR_EmailTemplate] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EmailType' and is_primary_key = 1)
alter table[CR_EmailType] ADD CONSTRAINT[PK_CR_EmailType] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_EmailTypeVariable' and is_primary_key = 1)
alter table[CR_EmailTypeVariable] ADD CONSTRAINT[PK_CR_EmailTypeVariable] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Language' and is_primary_key = 1)
alter table[CR_Language] ADD CONSTRAINT[PK_CR_Language] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_User' and is_primary_key = 1)
alter table[CR_User] ADD CONSTRAINT[PK_CR_User] PRIMARY KEY([ID])

GO

if not exists(select * from sys.indexes where name = 'PK_CR_Module' and is_primary_key = 1)
alter table[CR_Module] ADD CONSTRAINT[PK_CR_Module] PRIMARY KEY([ID])

GO

print 'CurrentTime: Constraints: Primary Keys - ' + convert(varchar, getdate(), 120)

GO

print 'CurrentTime: Constraints - ' + convert(varchar, getdate(), 120)

GO

--Create computed columns

alter table[CR_DocumentVersion] drop column Storage

GO

alter table[CR_DocumentVersion] add[Storage] as ((((((((((CONVERT([char](4), datepart(year, [Date]), (0)) + '\')+right('00'+CONVERT([varchar](10),datepart(month,[Date]),(0)),(2)))+'\')+right('00'+CONVERT([varchar](10),datepart(day,[Date]),(0)),(2)))+'\')+CONVERT([char](4),datepart(year,[Date]),(0)))+right('00'+CONVERT([varchar](10),datepart(month,[Date]),(0)),(2)))+right('00'+CONVERT([varchar](10),datepart(day,[Date]),(0)),(2)))+right('0000000000'+CONVERT([varchar](10),[ID],(0)),(10)))+[Extension])

GO

alter table[CR_DocumentVersion] drop column FileNameExtension

GO

alter table[CR_DocumentVersion] add[FileNameExtension] as ([FileName]+ [Extension])

GO

alter table[CR_User] drop column DisplayName

GO

alter table[CR_User] add[DisplayName] as (([LastName]+ ' ') +[FirstName])

GO

print 'CurrentTime: ColumnsComputed - ' + convert(varchar, getdate(), 120)

GO

--Create triggers

print 'CurrentTime: Triggers - ' + convert(varchar, getdate(), 120)

GO

--Create foreign keys

alter table[CR_EmailType] ADD CONSTRAINT[FK_CR_EmailType_CR_Table] FOREIGN KEY([ID_Table]) REFERENCES[CR_Table]([ID])

GO

alter table[CR_Table] ADD CONSTRAINT[FK_CR_Table_CR_TableParent] FOREIGN KEY([ID_TableParent]) REFERENCES[CR_Table]([ID])

GO

alter table[CR_DocumentVersion] ADD CONSTRAINT[FK_CR_DocumentVersion_CR_Document] FOREIGN KEY([ID_Document]) REFERENCES[CR_Document]([ID])

GO

alter table[CR_EmailDocument] ADD CONSTRAINT[FK_CR_EmailDocument_CR_Document] FOREIGN KEY([ID_Document]) REFERENCES[CR_Document]([ID])

GO

alter table[CR_Document] ADD CONSTRAINT[FK_CR_Document_CR_DocumentState] FOREIGN KEY([ID_DocumentState]) REFERENCES[CR_DocumentState]([ID])

GO

alter table[CR_Document] ADD CONSTRAINT[FK_CR_Document_CR_DocumentVersion] FOREIGN KEY([ID_DocumentVersion]) REFERENCES[CR_DocumentVersion]([ID])

GO

alter table[CR_Role] ADD CONSTRAINT[FK_CR_Role_CR_Entity] FOREIGN KEY([ID_Entity]) REFERENCES[CR_Entity]([ID])

GO

alter table[CR_EntityLog] ADD CONSTRAINT[FK_CR_EntityLog_CR_Entity] FOREIGN KEY([ID_Entity]) REFERENCES[CR_Entity]([ID])

GO

alter table[CR_EntityLog] ADD CONSTRAINT[FK_CR_EntityLog_CR_EntityLogType] FOREIGN KEY([ID_EntityLogType]) REFERENCES[CR_EntityLogType]([ID])

GO

alter table[CR_Entity] ADD CONSTRAINT[FK_CR_Entity_CR_EntityType] FOREIGN KEY([ID_EntityType]) REFERENCES[CR_EntityType]([ID])

GO

alter table[CR_EmailAddress] ADD CONSTRAINT[FK_CR_EmailAddress_CR_Email] FOREIGN KEY([ID_Email]) REFERENCES[CR_Email]([ID])

GO

alter table[CR_EmailDocument] ADD CONSTRAINT[FK_CR_EmailDocument_CR_Email] FOREIGN KEY([ID_Email]) REFERENCES[CR_Email]([ID])

GO

alter table[CR_Email] ADD CONSTRAINT[FK_CR_Email_CR_EmailState] FOREIGN KEY([ID_EmailState]) REFERENCES[CR_EmailState]([ID])

GO

alter table[CR_EmailType] ADD CONSTRAINT[FK_CR_EmailType_CR_EmailTemplate] FOREIGN KEY([ID_EmailTemplate]) REFERENCES[CR_EmailTemplate]([ID])

GO

alter table[CR_EmailTemplate] ADD CONSTRAINT[FK_CR_EmailTemplate_CR_EmailType] FOREIGN KEY([ID_EmailType]) REFERENCES[CR_EmailType]([ID])

GO

alter table[CR_EmailTypeVariable] ADD CONSTRAINT[FK_CR_EmailTypeVariable_CR_EmailType] FOREIGN KEY([ID_EmailType]) REFERENCES[CR_EmailType]([ID])

GO

alter table[CR_Email] ADD CONSTRAINT[FK_CR_Email_CR_EmailType] FOREIGN KEY([ID_EmailType]) REFERENCES[CR_EmailType]([ID])

GO

alter table[CR_Action] ADD CONSTRAINT[FK_CR_Action_CR_Table] FOREIGN KEY([ID_Table]) REFERENCES[CR_Table]([ID])

GO

alter table[CR_Action] ADD CONSTRAINT[FK_CR_Action_CR_TableRelation] FOREIGN KEY([ID_TableRelation]) REFERENCES[CR_Table]([ID])

GO

alter table[CR_Action] ADD CONSTRAINT[FK_CR_Action_CR_ActionType] FOREIGN KEY([ID_ActionType]) REFERENCES[CR_ActionType]([ID])

GO

alter table[CR_User] ADD CONSTRAINT[FK_CR_User_CR_Entity] FOREIGN KEY([ID_Entity]) REFERENCES[CR_Entity]([ID])

GO

alter table[CR_User] ADD CONSTRAINT[FK_CR_User_CR_Language] FOREIGN KEY([ID_Language]) REFERENCES[CR_Language]([ID])

GO

alter table[CR_UserRole] ADD CONSTRAINT[FK_CR_UserRole_CR_User] FOREIGN KEY([ID_User]) REFERENCES[CR_User]([ID])

GO

alter table[CR_Login] ADD CONSTRAINT[FK_CR_Login_CR_User] FOREIGN KEY([ID_User]) REFERENCES[CR_User]([ID])

GO

alter table[CR_EntityLog] ADD CONSTRAINT[FK_CR_EntityLog_CR_User] FOREIGN KEY([ID_User]) REFERENCES[CR_User]([ID])

GO

alter table[CR_DocumentVersion] ADD CONSTRAINT[FK_CR_DocumentVersion_CR_User] FOREIGN KEY([ID_User]) REFERENCES[CR_User]([ID])

GO

alter table[CR_PageState] ADD CONSTRAINT[FK_CR_PageState_CR_User] FOREIGN KEY([ID_User]) REFERENCES[CR_User]([ID])

GO

alter table[CR_UserPermission] ADD CONSTRAINT[FK_CR_UserPermission_CR_User] FOREIGN KEY([ID_User]) REFERENCES[CR_User]([ID])

GO

alter table[CR_Table] ADD CONSTRAINT[FK_CR_Table_CR_Module] FOREIGN KEY([ID_Module]) REFERENCES[CR_Module]([ID])

GO

alter table[CR_RolePermission] ADD CONSTRAINT[FK_CR_RolePermission_CR_Role] FOREIGN KEY([ID_Role]) REFERENCES[CR_Role]([ID])

GO

alter table[CR_UserRole] ADD CONSTRAINT[FK_CR_UserRole_CR_Role] FOREIGN KEY([ID_Role]) REFERENCES[CR_Role]([ID])

GO

alter table[CR_Log] ADD CONSTRAINT[FK_CR_Log_CR_LogSeverity] FOREIGN KEY([ID_LogSeverity]) REFERENCES[CR_LogSeverity]([ID])

GO

alter table[CR_Log] ADD CONSTRAINT[FK_CR_Log_CR_LogType] FOREIGN KEY([ID_LogType]) REFERENCES[CR_LogType]([ID])

GO

alter table[CR_PageStateItem] ADD CONSTRAINT[FK_CR_PageStateItem_CR_PageState] FOREIGN KEY([ID_PageState]) REFERENCES[CR_PageState]([ID])

GO

alter table[CR_UserPermission] ADD CONSTRAINT[FK_CR_UserPermission_CR_Permission] FOREIGN KEY([ID_Permission]) REFERENCES[CR_Permission]([ID])

GO

alter table[CR_RolePermission] ADD CONSTRAINT[FK_CR_RolePermission_CR_Permission] FOREIGN KEY([ID_Permission]) REFERENCES[CR_Permission]([ID])

GO

alter table[CR_Permission] ADD CONSTRAINT[FK_CR_Permission_CR_PermissionGroup] FOREIGN KEY([ID_PermissionGroup]) REFERENCES[CR_PermissionGroup]([ID])

GO

alter table[CR_EntityType] ADD CONSTRAINT[FK_CR_EntityType_CR_Table] FOREIGN KEY([ID_Table]) REFERENCES[CR_Table]([ID])

GO

print 'CurrentTime: ContraintsForeignKeys - ' + convert(varchar, getdate(), 120)

GO

--Create / update procedures

if exists(select * from sysobjects where name = 'CR_Document_ALL')
begin
drop procedure CR_Document_ALL
end

GO




/* Správa úložiště */
CREATE PROCEDURE[dbo].[CR_Document_ALL]
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@FileName DN = null,
@DisplayName DN = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_Document nastala chyba'

--vrátim záznamy podle zadaných filtrů
select top(@Top)
CR_Document.ID,
	CR_Document.[ID_DocumentVersion],
	'DocumentVersion' = CR_DocumentVersion.[DisplayName],
	'DocumentVersion_Date' = CR_DocumentVersion.[Date],
	'DocumentVersion_User' = CR_User.DisplayName,
	'DocumentVersion_Size' = CR_DocumentVersion.[Size],
	'DocumentVersion_FileNameExtension' = CR_DocumentVersion.FileNameExtension,
	'DocumentVersion_ContentType' = CR_DocumentVersion.[ContentType],
	'DocumentVersion_Version' = CR_DocumentVersion.[Version],
	'DocumentVersion_ImageWidth' = CR_DocumentVersion.ImageWidth,
	'DocumentVersion_ImageHeight' = CR_DocumentVersion.ImageHeight,
	'Download' = 'Stáhnout'
from
CR_Document
inner join CR_DocumentVersion on CR_Document.ID_DocumentVersion = CR_DocumentVersion.ID
inner join CR_User on CR_DocumentVersion.ID_User = CR_User.ID
where
	(CR_Document.ID =@ID or @ID is null)
and(CR_DocumentVersion.DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
and(CR_DocumentVersion.FileNameExtension like '%' +@FileName+'%' or @FileName is null)

order by CR_DocumentVersion.[Date] desc

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Document_DEL')
begin
drop procedure CR_Document_DEL
end

GO




CREATE PROCEDURE[dbo].[CR_Document_DEL]
@ID_Login GUID,
@ID int
AS
BEGIN

begin tran

declare @Error int,@Message Note
set @Message = 'Při smazání objektu CR_Document nastala chyba'

update CR_Document set CR_Document.ID_DocumentVersion = null where ID =@ID
if @@error<>0
goto FAILED

delete from CR_DocumentVersion where CR_DocumentVersion.ID_Document =@ID
if @@error<>0
goto FAILED

delete from CR_Document where ID =@ID
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Document_DETAIL')
begin
drop procedure CR_Document_DETAIL
end

GO




/* Načtení detailních informací o dokumentu */
CREATE PROCEDURE[dbo].[CR_Document_DETAIL]
@ID_Login GUID,
@ID ID,
@CheckPermission bit = 1
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektu CR_Document nastala chyba'

--TODO: Zabezpečit proceduru CR_Document_DETAIL
--exec @Error=CR_Document_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_ActionType='detail', @CheckPermission=@CheckPermission
--if @Error<>0
--goto FAILED

select
CR_Document.ID,
	'DocumentVersion_ID' = CR_DocumentVersion.ID,
	'DocumentVersion' = CR_DocumentVersion.[DisplayName],
	'DocumentVersion_Date' = CR_DocumentVersion.[Date],
	'DocumentVersion_ID_Document' = CR_DocumentVersion.[ID_Document],
	'DocumentVersion_ID_User' = CR_DocumentVersion.[ID_User],
	'DocumentVersion_User' = CR_User.DisplayName,
	'DocumentVersion_Size' = CR_DocumentVersion.[Size],
	'DocumentVersion_FileName' = CR_DocumentVersion.[FileName],
	'DocumentVersion_ContentType' = CR_DocumentVersion.[ContentType],
	'DocumentVersion_Extension' = CR_DocumentVersion.[Extension],
	'DocumentVersion_Storage' = CR_DocumentVersion.[Storage],
	'DocumentVersion_Hash' = CR_DocumentVersion.[Hash],
	'DocumentVersion_Version' = CR_DocumentVersion.[Version],
	'DocumentVersion_FileNameExtension' = CR_DocumentVersion.FileNameExtension,
	'DocumentVersion_ImageWidth' = CR_DocumentVersion.ImageWidth,
	'DocumentVersion_ImageHeight' = CR_DocumentVersion.ImageHeight
from
CR_Document
inner join CR_DocumentVersion on CR_Document.ID_DocumentVersion = CR_DocumentVersion.ID
inner join CR_User on CR_DocumentVersion.ID_User = CR_User.ID
where CR_Document.ID =@ID

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Document_EDIT')
begin
drop procedure CR_Document_EDIT
end

GO





CREATE PROCEDURE[dbo].[CR_Document_EDIT]
@ID_Login GUID,
@ID int,
@ID_DocumentVersion int
AS
BEGIN

begin tran

declare @Error int,@Message Note
set @Message = 'Při editaci objektu CR_Document nastala chyba'

update CR_Document
set[ID_DocumentVersion] =@ID_DocumentVersion
where ID =@ID

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Document_NEW')
begin
drop procedure CR_Document_NEW
end

GO




/* Založení dokumentu v úložišti */
CREATE PROCEDURE[dbo].[CR_Document_NEW]
@ID_Login GUID,
@ID int out,
@ID_Document int = null, --Pokud je zadano, tak vytvorim k existujicimu dokumentu novou verzi
@Size int,
@Hash DN,
	--Nazev a typ souboru
@UseCurrentVersion bit = 0, --Pri ulozeni nove verze umozni nezadavat nazev a typ soubor.Prevezme se z predchozi verze
@DisplayName DN = null,
@FileName DN = null,
@ContentType DN = null,
@Extension DN = null,
@ID_User ID = null, --Autor dokumentu(pokud neni zadano, tak se nastavi podle prihlaseneho uzivatele)
--Obrázek
@ImageWidth int = null,
@ImageHeight int = null
AS
BEGIN

begin tran

declare @ID_DocumentVersion int, @Error int,@Message Note
set @Message = 'Při založení objektu CR_Document nastala chyba'

if (@ID_Document is null)
begin
--new document
insert into CR_Document([ID_DocumentVersion]) values(null)
if @@error<>0
goto FAILED

set @ID_Document=@@IDENTITY
end else begin
--new version

--nactu nazev souboru a typ a z predchozi verze
if @UseCurrentVersion=1
begin
--nactu ID prihlaseneho uzivatele
if @ID_User is null
begin
set @ID_User=(select CR_Login.ID_User from CR_Login where CR_Login.ID =@ID_Login)
end

select
@DisplayName = CR_DocumentVersion.DisplayName,
			@FileName = CR_DocumentVersion.[FileName],
			@ContentType = CR_DocumentVersion.ContentType,
			@Extension = CR_DocumentVersion.Extension,
			@ID_User = isnull(@ID_User, CR_DocumentVersion.ID_User)
from
CR_DocumentVersion
inner join CR_Document on CR_Document.ID_DocumentVersion = CR_DocumentVersion.ID
where CR_Document.ID =@ID_Document
end
end

set @ID=@ID_Document

--new version
exec @Error=CR_DocumentVersion_NEW
@ID_Login=@ID_Login,
@ID=@ID_DocumentVersion out,
	@ID_Document=@ID_Document,
@Size=@Size,
@DisplayName=@DisplayName,
@FileName=@FileName,
@ContentType=@ContentType,
@Extension=@Extension,
@Hash=@Hash,
@ImageWidth=@ImageWidth,
@ImageHeight=@ImageHeight,
@ID_User=@ID_User
if @Error<>0 goto FAILED

--set actual version
update CR_Document
set ID_DocumentVersion =@ID_DocumentVersion
where CR_Document.ID =@ID_Document

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_DocumentVersion_DEL')
begin
drop procedure CR_DocumentVersion_DEL
end

GO




CREATE PROCEDURE[dbo].[CR_DocumentVersion_DEL]
@ID_Login GUID,
@ID int
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Při smazání objektu CR_DocumentVersion nastala chyba'

--remove actual version
declare @ID_Document int
set @ID_Document=(select CR_DocumentVersion.ID_Document from CR_DocumentVersion where ID =@ID)
update CR_Document set CR_Document.ID_DocumentVersion = null where ID =@ID_Document

-- delete version
delete from CR_DocumentVersion where ID =@ID

--set actual version
declare @ID_DocumentVersionLast int
set @ID_DocumentVersionLast=(select top 1 CR_DocumentVersion.ID from CR_DocumentVersion where
CR_DocumentVersion.ID_Document =@ID_Document order by CR_DocumentVersion.[Date] asc)
if (@ID_DocumentVersionLast is not null)
begin
update CR_Document set CR_Document.ID_DocumentVersion =@ID_DocumentVersionLast where ID =@ID_Document
end else begin
delete from CR_Document where ID =@ID_Document
end

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_DocumentVersion_DETAIL')
begin
drop procedure CR_DocumentVersion_DETAIL
end

GO




CREATE PROCEDURE[dbo].[CR_DocumentVersion_DETAIL]
@ID_Login GUID,
@ID int
AS
BEGIN

select
CR_DocumentVersion.ID,
	CR_DocumentVersion.[DisplayName],
	CR_DocumentVersion.[Date],
	CR_DocumentVersion.[ID_Document],
	CR_DocumentVersion.[ID_User],
	'User' = CR_User.DisplayName,
	CR_DocumentVersion.[Size],
	CR_DocumentVersion.[FileName],
	CR_DocumentVersion.[ContentType],
	CR_DocumentVersion.[Extension],
	CR_DocumentVersion.[Storage],
	CR_DocumentVersion.[Hash],
	CR_DocumentVersion.[Version]
from
CR_DocumentVersion
inner join CR_User on CR_DocumentVersion.ID_User = CR_User.ID
where CR_DocumentVersion.ID =@ID

END








GO

if exists(select * from sysobjects where name = 'CR_DocumentVersion_NEW')
begin
drop procedure CR_DocumentVersion_NEW
end

GO




/* Založení verze dokumentu */
CREATE PROCEDURE[dbo].[CR_DocumentVersion_NEW]
@ID_Login GUID,
@ID int out,
@ID_Document int,
@Size int,
@Hash DN,
	--Název a typ souboru
@DisplayName DN,
@FileName DN,
@ContentType DN,
@Extension DN,
	--Autor dokumentu(pokud neni zadano, tak se nastavi podle prihlaseneho uzivatele)
@ID_User ID = null,
	--Obrázek
@ImageWidth int = null,
@ImageHeight int = null
AS
BEGIN

begin tran

declare @Version int, @Error int, @Message varchar(500)
set @Message = 'Při založení objektu CR_DocumentVersion nastala chyba'

--spocitam verzi dokumentu
set @Version = (select isnull(max([Version]) + 1, 1) from CR_DocumentVersion where CR_DocumentVersion.ID_Document =@ID_Document)

--nactu ID prihlaseneho uzivatele
if @ID_User is null
begin
set @ID_User=(select CR_Login.ID_User from CR_Login where CR_Login.ID =@ID_Login)
end

--zalozeni zaznamu
insert into CR_DocumentVersion([DisplayName], [Date], [ID_Document], [ID_User], [Size], [FileName], [ContentType], [Extension], [Hash], [Version], [ImageWidth], [ImageHeight])
values(@DisplayName, getdate(), @ID_Document, @ID_User, @Size, @FileName, @ContentType, @Extension, @Hash, @Version, @ImageWidth, @ImageHeight)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

commit tran

return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Email_ALL_Unsent')
begin
drop procedure CR_Email_ALL_Unsent
end

GO




/* IsPrecontrol.Service: Načte seznam e-mailů k odeslání */
CREATE PROCEDURE[dbo].[CR_Email_ALL_Unsent]
@ID_Login GUID
AS
BEGIN

--vratim 20 nejstarsich e - mailu k odeslani(zpravy se sluzbe predavaji po davkach 20 zprav, aby pri hromadnych rozeslanich nedoslo k zahlceni sluzby a SMTP serveru)
select top 20
CR_Email.ID,
	CR_Email.[ID_Object],
	CR_Email.[ID_EmailState],
	CR_Email.[FromEmail],
	CR_Email.[FromName],
	CR_Email.[ReplyToEmail],
	CR_Email.[ReplyToName],
	CR_Email.[Subject],
	CR_Email.[Body],
	CR_Email.[BlindCopy]
from
CR_Email with (nolock)
inner join CR_EmailState on CR_Email.ID_EmailState = CR_EmailState.ID
where
	(CR_Email.ID_EmailState = 'prepared'
	and(CR_Email.[DateSent] is null or CR_Email.[DateSent] <= getdate()))
order by CR_Email.[Date]

END







GO

if exists(select * from sysobjects where name = 'CR_Email_EDIT')
begin
drop procedure CR_Email_EDIT
end

GO




/* Editace e-mailu */
CREATE PROCEDURE[dbo].[CR_Email_EDIT]
@ID_Login GUID,
@ID ID,
@ID_EmailState IDVC,
@ErrorMessage Note = null
AS
BEGIN

begin tran

--ochrana k výpadkům
set ARITHABORT ON

declare @Error int, @Message varchar(500)
set @Message = 'Při editaci objektu CR_Email nastala chyba'

if @ID_EmailState ='error' begin
--Oznacim e - mail jako chybny
update CR_Email
set[ID_EmailState] =@ID_EmailState,
[DateSent] = null,
	[ErrorMessage] =@ErrorMessage
where ID =@ID
end

if @ID_EmailState='sent' begin
--Oznacim e - mail jako odeslany
update CR_Email
set[ID_EmailState] =@ID_EmailState,
[DateSent] = getdate(),
	[ErrorMessage] =@ErrorMessage
where ID =@ID
end

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Email_NEW_IncorrectPasswordBlock')
begin
drop procedure CR_Email_NEW_IncorrectPasswordBlock
end

GO




/* Založení záznamu v tabulce CR_Email - Zablokování účtu */
CREATE PROCEDURE[dbo].[CR_Email_NEW_IncorrectPasswordBlock]
@ID_Login GUID,
@ID_EmailType IDVC = null,
@ID_Object ID = null,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note, @Email DN, @Subject DN, @Body Note
set @Message = 'Při založení objektu CR_Email nastala chyba'

select @Subject='[Preventado] Zablokování účtu', @Body='Dobrý den,<br/>
	< br />
	Na Vašem účtu byl proveden několikanásobný pokus o přístup do aplikace.< br />
		Účet byl preventivně zablokován.< br />
			<br/>
Pro obnovení účtu využijte funkci "Zapomenuté heslo".< br />

	<br/>
Děkujeme, <br/>
Tým IS - Precontrol'

select
@Email=CR_User.Email,
	@Subject=replace(@Subject,
'{PasswordRequest}', CR_User.PasswordRequest),
@Body=replace(@Body,
'{PasswordRequest}', CR_User.PasswordRequest)
from
CR_User
where CR_User.ID =@ID_Object

--vložení záznamu do tabulky
insert into[CR_Email]([ID_EmailState], [ID_EmailType], [ID_Object], [FromEmail], [FromName], [ReplyToEmail], [ReplyToName], [Subject], [Body], [BlindCopy])
select 'prepared', 
		@ID_EmailType,
@ID_Object,
dbo.CR_Setting_Value('EmailFrom'),
	dbo.CR_Setting_Value('EmailFromName'),
	dbo.CR_Setting_Value('EmailReplyTo'),
	dbo.CR_Setting_Value('EmailReplyToName'),
		@Subject,
@Body,
0
if @@error<>0
goto FAILED

set @ID=@@IDENTITY

insert into[CR_EmailAddress](ID_Email, Email)
values(@ID, @Email)
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_EmailAddress_ALL_Email')
begin
drop procedure CR_EmailAddress_ALL_Email
end

GO




/* Načtení seznamu záznamů v tabulce CR_EmailAddress */
CREATE PROCEDURE[dbo].[CR_EmailAddress_ALL_Email]
@ID_Login GUID,
	@Top int = 500,
	@ID ID = null,
	@ID_Email ID
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_EmailAddress nastala chyba'

--vrátim záznamy podle zadaných filtrů
select
CR_EmailAddress.ID,
	CR_EmailAddress.[ID_Email],
	CR_EmailAddress.[Email]
from
CR_EmailAddress
where
CR_EmailAddress.ID_Email =@ID_Email
and CR_EmailAddress.Email <> ''

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Entity_DEL')
begin
drop procedure CR_Entity_DEL
end

GO




/* Smaže kompletně entitu */
CREATE PROCEDURE[dbo].[CR_Entity_DEL]
@ID_Login GUID,
@ID ID
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Při smazání objektu CR_Entity nastala chyba'

if @ID is null
begin
set @Message += ': Není zadaný parametr @ID!'
goto FAILED
end

if exists(select col.*
	from
		CR_Entity
		inner join CR_EntityType on CR_EntityType.ID = CR_Entity.ID_EntityType
		inner join sys.tables as tables on CR_EntityType.ID_Table = tables.name
		inner join sys.columns as col on tables.object_id = col.object_id
	where CR_Entity.ID =@ID and col.name = 'IsActive')
begin
--Tabulka ma sloupec IsActive => Pouze entitu oznacim jako smazanou

--přihlášený uživatel
declare @ID_User ID
select @ID_User=[dbo].[CR_Login_User](@ID_Login)

--editace záznamu
update CR_Entity
set ID_UserDelete =@ID_User,
DateDelete = getdate()
where ID =@ID

if @@error<>0
goto FAILED

end else begin
--Tabulka nema sloupec IsActive => Entity uplne smazu

--historie
delete from CR_EntityLog where CR_EntityLog.ID_Entity =@ID
if @@error<>0
goto FAILED

--entita
delete from CR_Entity where ID =@ID
if @@error<>0
goto FAILED
end

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Entity_EDIT')
begin
drop procedure CR_Entity_EDIT
end

GO




/* Editace entity */
CREATE PROCEDURE[dbo].[CR_Entity_EDIT]
@ID_Login GUID,
@ID ID
AS
BEGIN

begin tran

declare @Error int, @Message varchar(max)
set @Message = 'Při editaci objektu SF_Entity nastala chyba'

--přihlášený uživatel
declare @ID_User ID
select @ID_User=[dbo].[CR_Login_User](@ID_Login)

--editace záznamu
update CR_Entity
set ID_UserUpdate =@ID_User,
DateUpdate = getdate()
where ID =@ID

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Entity_NEW')
begin
drop procedure CR_Entity_NEW
end

GO




/* Založení záznamu v tabulce CR_Entity */
CREATE PROCEDURE[dbo].[CR_Entity_NEW]
@ID_Login GUID,
@ID_EntityType IDVC,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_Entity nastala chyba'

--přihlášený uživatel
declare @ID_User ID
select @ID_User=[dbo].[CR_Login_User](@ID_Login)

--vložení záznamu do tabulky
insert into CR_Entity([ID_EntityType], [ID_UserInsert], [ID_UserUpdate])
values(@ID_EntityType, @ID_User, @ID_User)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Entity_VERIFY')
begin
drop procedure CR_Entity_VERIFY
end

GO




/* Ověří akci pro zadanou entitu a načte její ID */
CREATE PROCEDURE[dbo].[CR_Entity_VERIFY]
@ID_Login GUID,
	--Bud zadam ID entity
@ID ID = null out, --ID entity
--Nebo typ entity a ID v tabulce s daty
@ID_EntityType IDVC = null, --Typ entity
@ID_Object ID = null, --ID entity v tabulce s daty(PF_Unit.ID apod.)
--Ostatni parametry
@ID_Action IDVC-- Potřebná akce
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při ověření akce pro entitu nastala chyba'

if @ID_Action is null
begin
set @Message = @Message + ': Není zadaná vyžadovaná akce!'
goto FAILED
end

declare @ID_Table IDVC, @SQL Note, @Temp StringList

if @ID is null
begin
--Je zadane ID v datove tabulce

--Nactu ID_Table
set @ID_Table = (select ID_Table from CR_EntityType where CR_EntityType.ID =@ID_EntityType)

if @ID_Table is null
begin
set @Message = @Message + ': Nebyla nalezena tabulka pro zadaný ID_EntityType=' + isnull(@ID_EntityType, 'null')
goto FAILED
end

--Nactu ID_Entity
set @SQL = 'select ID_Entity from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object)
insert into @Temp(Value)
exec(@SQL)
set @ID = (select Value from @Temp)

if @ID is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID=' + isnull(convert(varchar,@ID_Object), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end else begin
--Dohledam v jake tabulce ma entita data a jeji ID
set @ID_Table = (select CR_EntityType.ID_Table from CR_Entity inner join CR_EntityType on CR_Entity.ID_EntityType = CR_EntityType.ID where CR_Entity.ID =@ID)

--Nactu v tabulce s daty
set @SQL = 'select ID from ' +@ID_Table+' where ID_Entity=' + convert(varchar,@ID)
insert into @Temp(Value)
exec(@SQL)
set @ID_Object = (select Value from @Temp)

if @ID_Object is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID_Entity=' + isnull(convert(varchar,@ID), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end

--oprávnění k akci
declare @ActionProcedure DN = @ID_Table + '_ACTION'
exec @Error=@ActionProcedure @ID_Login=@ID_Login, @ID=@ID_Object, @ID_Action=@ID_Action
if @Error<>0
goto FAILED

return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_EntityLog_ALL')
begin
drop procedure CR_EntityLog_ALL
end

GO




/* Načtení seznamu záznamů v tabulce CR_EntityLog */
CREATE PROCEDURE[dbo].[CR_EntityLog_ALL]
@ID_Login GUID,
@ID_EntityType IDVC, --Typ entity
@ID_Object ID, --ID entity v tabulce s daty
--filtry
@ID_User ID = null,
@ID_EntityLogType IDVC = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_EntityLog nastala chyba'

--Ověření oprávnění
declare @ID_Action IDVC = (select ID_ActionLogAll from CR_EntityType where ID =@ID_EntityType)
declare @ID_Entity ID
exec @Error=CR_Entity_VERIFY
@ID_Login=@ID_Login,
@ID_EntityType=@ID_EntityType,
@ID_Object=@ID_Object,
@ID_Action=@ID_Action,
@ID=@ID_Entity out
if @Error<>0
goto FAILED

--přihlášený uživatel
declare @ID_LoggedUser ID
select @ID_LoggedUser=[dbo].[CR_Login_User](@ID_Login)

--vrátim záznamy podle zadaných filtrů
select
CR_EntityLog.ID,
	CR_EntityLog.[ID_Entity],
	CR_EntityLog.[ID_User],
	CR_EntityLog.[DateTime],
	'User' = CR_User.[DisplayName],
	CR_EntityLog.[Data],
	CR_EntityLog.[ID_EntityLogType],
	'EntityLogType' = CR_EntityLogType.[DisplayName],
	CR_EntityLog.[Description],
	CR_EntityLog.[ID_Object]
from
CR_EntityLog
inner join CR_User on CR_EntityLog.ID_User = CR_User.ID
inner join CR_EntityLogType on CR_EntityLog.ID_EntityLogType = CR_EntityLogType.ID
where
CR_EntityLog.ID_Entity =@ID_Entity AND CR_EntityLog.IsHidden = 0
and(CR_EntityLog.ID_User =@ID_User or @ID_User is null)
and(CR_EntityLog.ID_EntityLogType =@ID_EntityLogType or @ID_EntityLogType is null)
order by CR_EntityLog.ID desc

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_EntityLog_NEW')
begin
drop procedure CR_EntityLog_NEW
end

GO




/* Založení záznamu v tabulce CR_EntityLog */
CREATE PROCEDURE[dbo].[CR_EntityLog_NEW]
@ID_Login GUID,
@ID_Entity ID,
@ID_EntityLogType IDVC,
	--nepovinné
@Description Note = null, --Podrobnosti
@ID_Object ID = null, --ID záznamu, ke kterému se historie vztahuje
@Data DN = null, --Související data(zadaná hodnota apod.)
@IsHidden bit = 0,
	--výstup
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_EntityLog nastala chyba'

--přihlášený uživatel
declare @ID_User ID
select @ID_User=[dbo].[CR_Login_User](@ID_Login)

--vložení záznamu do tabulky
insert into CR_EntityLog([ID_Entity], [ID_User], [ID_EntityLogType], [Description], [ID_Object], [Data], [IsHidden])
values(@ID_Entity, @ID_User, @ID_EntityLogType, @Description, @ID_Object, @Data, @IsHidden)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_EntityLog_NEW_Bit')
begin
drop procedure CR_EntityLog_NEW_Bit
end

GO




/* Zápis do historie entity: Změna vlastnosti typu bit */
CREATE PROCEDURE[dbo].[CR_EntityLog_NEW_Bit]
@ID_Login GUID,
@ID_Entity ID, --ID entity(pokud není zadáno, tak se automaticky
@ID_EntityLogType IDVC, --událost
@DisplayName DN, --název vlastnosti,
@Property DN, --název vlastnosti v tabulce(jméno sloupce)
@Value bit, --nová hodnota vlastnosti
--nepovinné
@ID_Table IDVC = null, --Tabulka, kde došlo ke změně(pokud není zadano, tak se automaticky načte podle entity)
@ID_Object ID = null, --ID záznamu, kde došlo ke změně(pokud není zadáno, tak se automaticky načte podle entity)
@ValueOld bit = null -- Původní hodnota(pokud není zadáno, tak se automaticky z tabulky načte současná hodnota)
AS
BEGIN

begin tran

declare @SQL varchar(max), @Temp StringList, @ValueVarchar DN, @ValueOldVarchar DN
declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_EntityLog nastala chyba'

if @ID_Entity is null
begin
set @Message = @Message + ': Není zadáno ID_Entity!'
goto FAILED
end

--načtu údaje o entitě a editovaném záznamu
if @ID_Table is null
begin
set @ID_Table = (select CR_EntityType.ID_Table
from
CR_Entity
inner join CR_EntityType on CR_EntityType.ID = CR_Entity.ID_EntityType
where CR_Entity.ID =@ID_Entity)
end

if @ID_Object is null
begin
set @SQL = 'select ID from ' +@ID_Table+' where ID_Entity=' + convert(varchar,@ID_Entity)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ID_Object = (select Value from @Temp)

if @ID_Object is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID_Entity=' + isnull(convert(varchar,@ID_Entity), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end

--nová hodnota
set @ValueVarchar = case when @Value=1  then 'Ano' when @Value=0 then 'Ne' Else null End

--načtu původní hodnotu
if @ValueOld is null
begin
set @SQL = 'select case when [' + @Property +']=1 then ''Ano'' when [' + @Property+ ']=0 then ''Ne'' else null end from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ValueOldVarchar = (select Value from @Temp)
end else begin
set @ValueOldVarchar = case when @ValueOld=1  then 'Ano' when @ValueOld=0 then 'Ne' Else null End
end

--zapisu zmenu do historie entity
exec @Error=CR_EntityLog_NEW_Property
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType=@ID_EntityLogType,
@DisplayName=@DisplayName,
@Property=@Property,
@Value=@ValueVarchar,
@ID_Table=@ID_Table,
@ID_Object=@ID_Object,
@Data=@Value,
@ValueOld=@ValueOldVarchar
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_EntityLog_NEW_Date')
begin
drop procedure CR_EntityLog_NEW_Date
end

GO




/* Zápis do historie entity: Změna vlastnosti typu bit */
CREATE PROCEDURE[dbo].[CR_EntityLog_NEW_Date]
@ID_Login GUID,
@ID_Entity ID, --ID entity(pokud není zadáno, tak se automaticky
@ID_EntityLogType IDVC, --událost
@DisplayName DN, --název vlastnosti,
@Property DN, --název vlastnosti v tabulce(jméno sloupce)
@Value date, --nová hodnota vlastnosti
--nepovinné
@ID_Table IDVC = null, --Tabulka, kde došlo ke změně(pokud není zadano, tak se automaticky načte podle entity)
@ID_Object ID = null, --ID záznamu, kde došlo ke změně(pokud není zadáno, tak se automaticky načte podle entity)
@ValueOld date = null -- Původní hodnota(pokud není zadáno, tak se automaticky z tabulky načte současná hodnota)
AS
BEGIN

begin tran

declare @SQL varchar(max), @Temp StringList, @ValueVarchar DN, @ValueOldVarchar DN
declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_EntityLog nastala chyba'

if @ID_Entity is null
begin
set @Message = @Message + ': Není zadáno ID_Entity!'
goto FAILED
end

--načtu údaje o entitě a editovaném záznamu
if @ID_Table is null
begin
set @ID_Table = (select CR_EntityType.ID_Table
from
CR_Entity
inner join CR_EntityType on CR_EntityType.ID = CR_Entity.ID_EntityType
where CR_Entity.ID =@ID_Entity)
end

if @ID_Object is null
begin
set @SQL = 'select ID from ' +@ID_Table+' where ID_Entity=' + convert(varchar,@ID_Entity)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ID_Object = (select Value from @Temp)

if @ID_Object is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID_Entity=' + isnull(convert(varchar,@ID_Entity), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end

--nová hodnota
set @ValueVarchar = convert(varchar, @Value, 104)

--načtu původní hodnotu
if @ValueOld is null
begin
set @SQL = 'select convert(varchar, [' +@Property+'], 104) from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object) delete from @Temp
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ValueOldVarchar = (select Value from @Temp)
end else begin
set @ValueOldVarchar = convert(varchar, @ValueOld, 104)
end

--zapisu zmenu do historie entity
exec @Error=CR_EntityLog_NEW_Property
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType=@ID_EntityLogType,
@DisplayName=@DisplayName,
@Property=@Property,
@Value=@ValueVarchar,
@ID_Table=@ID_Table,
@ID_Object=@ID_Object,
@Data=@Value,
@ValueOld=@ValueOldVarchar
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_EntityLog_NEW_DateTime')
begin
drop procedure CR_EntityLog_NEW_DateTime
end

GO




/* Zápis do historie entity: Změna vlastnosti typu bit */
CREATE PROCEDURE[dbo].[CR_EntityLog_NEW_DateTime]
@ID_Login GUID,
@ID_Entity ID, --ID entity(pokud není zadáno, tak se automaticky
@ID_EntityLogType IDVC, --událost
@DisplayName DN, --název vlastnosti,
@Property DN, --název vlastnosti v tabulce(jméno sloupce)
@Value datetime, --nová hodnota vlastnosti
--nepovinné
@ID_Table IDVC = null, --Tabulka, kde došlo ke změně(pokud není zadano, tak se automaticky načte podle entity)
@ID_Object ID = null, --ID záznamu, kde došlo ke změně(pokud není zadáno, tak se automaticky načte podle entity)
@ValueOld datetime = null -- Původní hodnota(pokud není zadáno, tak se automaticky z tabulky načte současná hodnota)
AS
BEGIN

begin tran

declare @SQL varchar(max), @Temp StringList, @ValueVarchar DN, @ValueOldVarchar DN
declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_EntityLog nastala chyba'

if @ID_Entity is null
begin
set @Message = @Message + ': Není zadáno ID_Entity!'
goto FAILED
end

--načtu údaje o entitě a editovaném záznamu
if @ID_Table is null
begin
set @ID_Table = (select CR_EntityType.ID_Table
from
CR_Entity
inner join CR_EntityType on CR_EntityType.ID = CR_Entity.ID_EntityType
where CR_Entity.ID =@ID_Entity)
end

if @ID_Object is null
begin
set @SQL = 'select ID from ' +@ID_Table+' where ID_Entity=' + convert(varchar,@ID_Entity)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ID_Object = (select Value from @Temp)

if @ID_Object is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID_Entity=' + isnull(convert(varchar,@ID_Entity), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end

--nová hodnota
set @ValueVarchar = dbo.FN_DateTime(@Value)

--načtu původní hodnotu
if @ValueOld is null
begin
set @SQL = 'select dbo.FN_DateTime([' +@Property+']) from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ValueOldVarchar = (select Value from @Temp)
end else begin
set @ValueOldVarchar = dbo.FN_DateTime(@ValueOld)
end

--zapisu zmenu do historie entity
exec @Error=CR_EntityLog_NEW_Property
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType=@ID_EntityLogType,
@DisplayName=@DisplayName,
@Property=@Property,
@Value=@ValueVarchar,
@ID_Table=@ID_Table,
@ID_Object=@ID_Object,
@Data=@Value,
@ValueOld=@ValueOldVarchar
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_EntityLog_NEW_Gps')
begin
drop procedure CR_EntityLog_NEW_Gps
end

GO




/* Zápis do historie entity: Změna GPS souřadnic */
CREATE PROCEDURE[dbo].[CR_EntityLog_NEW_Gps]
@ID_Login GUID,
@ID_Entity ID, --ID entity
@ID_EntityLogType IDVC, --událost
@DisplayName DN, --název vlastnosti,
@Property DN, --název vlastnosti v tabulce(jméno sloupce)
@Value geography, --nová hodnota vlastnosti
--nepovinné
@ID_Table IDVC = null, --Tabulka, kde došlo ke změně(pokud není zadano, tak se automaticky načte podle entity)
@ID_Object ID = null, --ID záznamu, kde došlo ke změně(pokud není zadáno, tak se automaticky načte podle entity)
@ValueOld geography = null -- Původní hodnota(pokud není zadáno, tak se automaticky z tabulky načte současná hodnota)
AS
BEGIN

begin tran

declare @SQL varchar(max), @Temp StringList
declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_EntityLog nastala chyba'

if @ID_Entity is null
begin
set @Message = @Message + ': Není zadáno ID_Entity!'
goto FAILED
end

--načtu údaje o entitě a editovaném záznamu
if @ID_Table is null
begin
set @ID_Table = (select CR_EntityType.ID_Table
from
CR_Entity
inner join CR_EntityType on CR_EntityType.ID = CR_Entity.ID_EntityType
where CR_Entity.ID =@ID_Entity)
end

if @ID_Object is null
begin
set @SQL = 'select ID from ' +@ID_Table+' where ID_Entity=' + convert(varchar,@ID_Entity)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ID_Object = (select Value from @Temp)

if @ID_Object is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID_Entity=' + isnull(convert(varchar,@ID_Entity), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end

--načtu původní hodnotu
declare @LongOld Note, @LatOld Note
if @ValueOld is null
begin
--Délka
set @SQL = 'select case when [' +@Property+'] is not null then convert(varchar,[' +@Property+'].Long) else '''' end from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @LongOld = (select Value from @Temp)

--Šířka
set @SQL = 'select case when [' +@Property+'] is not null then convert(varchar,[' +@Property+'].Lat) else '''' end from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @LatOld = (select Value from @Temp)
end else begin
set @LongOld = case when @ValueOld is not null then CONVERT(varchar, @ValueOld.Lat) else '' end
set @LatOld = case when @ValueOld is not null then CONVERT(varchar, @ValueOld.Long) else '' end
end

--načtu novou hodnotu
declare @Long Note, @Lat Note
set @Long = case when @Value is not null then CONVERT(varchar, @Value.Lat) else '' end
set @Lat = case when @Value is not null then CONVERT(varchar, @Value.Long) else '' end

--GPS: Délka
declare @DisplayNameLong DN = @DisplayName + ': Délka'
exec @Error=CR_EntityLog_NEW_Property
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType=@ID_EntityLogType,
@DisplayName=@DisplayNameLong,
@Property=@Property, @Value=@Long,
@ID_Table=@ID_Table,
@ID_Object=@ID_Object,
@ValueOld=@LongOld
if @Error<>0 goto FAILED

--GPS: Šířka
declare @DisplayNameLat DN = @DisplayName + ': Šířka'
exec @Error=CR_EntityLog_NEW_Property
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType=@ID_EntityLogType,
@DisplayName=@DisplayNameLat,
@Property=@Property,
@Value=@Lat,
@ID_Table=@ID_Table,
@ID_Object=@ID_Object,
@ValueOld=@LatOld
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_EntityLog_NEW_List')
begin
drop procedure CR_EntityLog_NEW_List
end

GO




/* Zápis do historie entity: Změna vlastnosti typu bit */
CREATE PROCEDURE[dbo].[CR_EntityLog_NEW_List]
@ID_Login GUID,
@ID_Entity ID, --ID entity(pokud není zadáno, tak se automaticky
@ID_EntityLogType IDVC, --událost
@DisplayName DN, --název vlastnosti,
@Property DN, --název vlastnosti v tabulce(jméno sloupce)
@ValueId IDVC, --nová hodnota vlastnosti
--nepovinné
@ID_Table IDVC = null, --Tabulka, kde došlo ke změně(pokud není zadano, tak se automaticky načte podle entity)
@ID_Object ID = null, --ID záznamu, kde došlo ke změně(pokud není zadáno, tak se automaticky načte podle entity)
@ValueIdOld IDVC = null, --Původní hodnota(pokud není zadáno, tak se automaticky z tabulky načte současná hodnota)
@DisplayNameColumn DN = 'DisplayName' -- Sloupec v odkazovane tabulce, ze ktereho se nacte hodnota(pokud neni zadano, tak je to DisplayName)
AS
BEGIN

begin tran

declare @SQL varchar(max), @Temp StringList, @ValueVarchar DN, @ValueOldVarchar DN
declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_EntityLog nastala chyba'

if @ID_Entity is null
begin
set @Message = @Message + ': Není zadáno ID_Entity!'
goto FAILED
end

--načtu údaje o entitě a editovaném záznamu
if @ID_Table is null
begin
set @ID_Table = (select CR_EntityType.ID_Table
from
CR_Entity
inner join CR_EntityType on CR_EntityType.ID = CR_Entity.ID_EntityType
where CR_Entity.ID =@ID_Entity)
end

if @ID_Object is null
begin
set @SQL = 'select ID from ' +@ID_Table+' where ID_Entity=' + convert(varchar,@ID_Entity)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ID_Object = (select Value from @Temp)

if @ID_Object is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID_Entity=' + isnull(convert(varchar,@ID_Entity), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end

--načtu původní hodnotu
if @ValueIdOld is null
begin
set @SQL = 'select [' +@Property+'] from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ValueIdOld = (select Value from @Temp)
end

--nactu DisplayName hodnot
declare @Value Note, @ValueOld Note, @ID_TableList IDVC

set @ID_TableList = (select OBJECT_NAME(f.referenced_object_id)
from
sys.foreign_keys AS f
inner join sys.foreign_key_columns AS fc ON f.object_id = fc.constraint_object_id
inner join sys.tables on sys.tables.object_id = f.parent_object_id
where
sys.tables.name =@ID_Table
and COL_NAME(fc.parent_object_id, fc.parent_column_id) =@Property)

--puvodni DisplayName
if @ValueIdOld is not null
begin
set @SQL = 'select [' +@DisplayNameColumn+'] from ' +@ID_TableList+' where ID=' + dbo.FN_EncodeText(@ValueIdOld, 0)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ValueOld = (select Value from @Temp)
end else begin
set @ValueOld = ''
end

--novy DisplayName
if @ValueId is not null
begin
set @SQL = 'select [' +@DisplayNameColumn+'] from ' +@ID_TableList+' where ID=' + dbo.FN_EncodeText(@ValueId, 0)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @Value = (select Value from @Temp)
end else begin
set @Value = ''
end

--zapisu zmenu do historie entity
exec @Error=CR_EntityLog_NEW_Property
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType=@ID_EntityLogType,
@DisplayName=@DisplayName,
@Property=@Property,
@Value=@Value,
@ID_Table=@ID_Table,
@ID_Object=@ID_Object,
@Data=@ValueId, -- do sloupce Data vlozim nove ID
@ValueOld=@ValueOld
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_EntityLog_NEW_Property')
begin
drop procedure CR_EntityLog_NEW_Property
end

GO




/* Zápis do historie entity: Změna vlastnosti */
CREATE PROCEDURE[dbo].[CR_EntityLog_NEW_Property]
@ID_Login GUID,
@ID_Entity ID, --ID entity(pokud není zadáno, tak se automaticky
@ID_EntityLogType IDVC, --událost
@DisplayName DN, --název vlastnosti,
@Property DN, --název vlastnosti v tabulce(jméno sloupce)
@Value Note, --nová hodnota vlastnosti
--nepovinné
@ID_Table IDVC = null, --Tabulka, kde došlo ke změně(pokud není zadano, tak se automaticky načte podle entity)
@ID_Object ID = null, --ID záznamu, kde došlo ke změně(pokud není zadáno, tak se automaticky načte podle entity)
@Data DN = null, --Související data(zadaná hodnota apod.)
@ValueOld Note = null, --Původní hodnota(pokud není zadáno, tak se automaticky z tabulky načte současná hodnota)
@IsHidden bit = 0
AS
BEGIN

begin tran

declare @SQL varchar(max), @Temp StringList
declare @Error int, @Message varchar(max)
set @Message = 'Při založení objektu CR_EntityLog nastala chyba'

if @ID_Entity is null
begin
set @Message = @Message + ': Není zadáno ID_Entity!'
goto FAILED
end

--načtu údaje o entitě a editovaném záznamu
if @ID_Table is null
begin
set @ID_Table = (select CR_EntityType.ID_Table
from
CR_Entity
inner join CR_EntityType on CR_EntityType.ID = CR_Entity.ID_EntityType
where CR_Entity.ID =@ID_Entity)
end

if @ID_Object is null
begin
set @SQL = 'select ID from ' +@ID_Table+' where ID_Entity=' + convert(varchar,@ID_Entity)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ID_Object = (select Value from @Temp)

if @ID_Object is null
begin
set @Message = @Message + ': Nebyl nalezen záznam ID_Entity=' + isnull(convert(varchar,@ID_Entity), 'null') + ' v tabulce ' + @ID_Table
goto FAILED
end
end

--načtu původní hodnotu
if @ValueOld is null
begin
set @SQL = 'select [' +@Property+'] from ' +@ID_Table+' where ID=' + convert(varchar,@ID_Object)
delete from @Temp
insert into @Temp(Value)
exec(@SQL)
set @ValueOld = (select Value from @Temp)
end

--vyhodnotím, zda došlo ke změně(null a prazdny retezec se povazuji za stejny udaj)
if isnull(@ValueOld, '')<>isnull(@Value, '')
begin
declare @Description Note

if isnull(@ValueOld, '')='' and @Value is not null
begin
set @Description = 'Zadáno pole ' + @DisplayName + ' hodnota "' + dbo.FN_TruncateText(@Value, 50) + '"'
end
	else if @ValueOld is not null and isnull(@Value, '')=''
begin
set @Description = 'Vymazáno pole ' + @DisplayName + ' původní hodnota "' + dbo.FN_TruncateText(@ValueOld, 50) + '"'
end
	else
begin
set @Description = 'Změněno pole ' + @DisplayName + ' z "' + dbo.FN_TruncateText(@ValueOld, 50) + '" na "' + dbo.FN_TruncateText(@Value, 50) + '"'
end

--zapíšu změnu do historie
	set @Data = isnull(@Data, dbo.FN_TruncateText(@Value, 250))--pokud neni zadano jinak, tak se do sloupce Data ulozi nova hodnota
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType=@ID_EntityLogType,
@Description=@Description,
@ID_Object=@ID_Object,
@Data=@Data,
@IsHidden=@IsHidden
if @Error<>0 goto FAILED
end

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_EntityLogType_ALL_EntityType')
begin
drop procedure CR_EntityLogType_ALL_EntityType
end

GO




/* Načtení seznamu záznamů v tabulce CR_EntityLogType */
CREATE PROCEDURE[dbo].[CR_EntityLogType_ALL_EntityType]
@ID_Login GUID,
@Top int = 500,
@ID IDVC = null,
@DisplayName DN = null,
@ID_EntityType IDVC = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_EntityLogType nastala chyba'

--vrátim záznamy podle zadaných filtrů
select top(@Top)
CR_EntityLogType.ID,
	CR_EntityLogType.[IsActive],
	CR_EntityLogType.[DisplayName],
	CR_EntityLogType.[ID_EntityType],
	'EntityType' = CR_EntityType.[DisplayName],
	CR_EntityLogType.[Note]
from
CR_EntityLogType
left join CR_EntityType on CR_EntityLogType.ID_EntityType = CR_EntityType.ID
where
	(CR_EntityLogType.ID =@ID or @ID is null)
and CR_EntityLogType.IsActive = 1
and(CR_EntityLogType.DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
and(
	(CR_EntityLogType.ID_EntityType =@ID_EntityType)
		)
order by CR_EntityLogType.ID

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Language_ALL')
begin
drop procedure CR_Language_ALL
end

GO




/* Načtení seznamu záznamů v tabulce CR_Language */
CREATE PROCEDURE[dbo].[CR_Language_ALL]
@ID_Login GUID,
@Top int = 500,
@ID IDVC = null,
@DisplayName DN = null
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_Language nastala chyba'
select @Top = 500 where @Top is null

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_Language].ID,
	[CR_Language].[IsActive],
	[CR_Language].[DisplayName]
from
[CR_Language]
where
	([CR_Language].ID =@ID or @ID is null)
and[CR_Language].IsActive = 1
and([CR_Language].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
order by[CR_Language].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Log_ACTION')
begin
drop procedure CR_Log_ACTION
end

GO




/* Zjištění oprávnění uživatele proti záznamům v tabulce CR_Log */
CREATE PROCEDURE[dbo].[CR_Log_ACTION]
@ID_Login GUID,
@ID ID,
@ID_Action IDVC,
@IsRaiseError bit = 1
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při zjištění akcí objektu CR_Log nastala chyba'

exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action=@ID_Action
if @Error<>0
begin
goto FAILED
end

declare @Actions table(ID IDVC, DisplayName DN)

--načtu seznam možných akcí
if @ID is null
begin
--akce nad tabulkou
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Log', 0)[CR_Action]
left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
--CR_Log_ALL: Načíst seznam logů
	([CR_Action].ID = 'CR_Log_ALL'
		and[CR_Permission].ID in ('DEBUG'))

end else begin
--akce nad záznamem

--ladící volání při generování stránek(taskid#6094)
if @ID=0
begin
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Log', 1)[CR_Action]
end

--vyhodnocení akcí pro zadaný záznam
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Log', 1)[CR_Action]
cross join[CR_Log]
left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
[CR_Log].ID =@ID
and[CR_Permission].ID in ('DEBUG')
and(

	--CR_Log_DETAIL: Načíst detail logu
	([CR_Action].ID = 'CR_Log_DETAIL')
		
		or

		--CR_Log_EDIT_Process: Zpracovat log
	([CR_Action].ID = 'CR_Log_EDIT_Process')

)
end

if @IsRaiseError=1
begin
if not exists(select * from @Actions where ID =@ID_Action)
begin
set @Message = 'Nemáte oprávnění k akci ' + @ID_Action + ' nad záznamem ID=' + ISNULL(convert(varchar, @ID), 'NULL') + '!'
goto FAILED
end
end else begin
select ID, DisplayName from @Actions order by DisplayName
end

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Log_ALL')
begin
drop procedure CR_Log_ALL
end

GO




/* Načtení seznamu záznamů v tabulce CR_Log */
CREATE PROCEDURE[dbo].[CR_Log_ALL]
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@ID_LogSeverity IDVC = null,
@ID_LogType IDVC = null,
@DisplayName Note = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_Log nastala chyba'
select @Top = 500 where @Top is null

--oprávnění k akci
--exec @Error=CR_Log_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Log_ALL'
--if @Error<>0
--goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_Log].ID,
	[CR_Log].[ID_User],
	'User' = CR_User.DisplayName,
	[CR_Log].[ID_LogSeverity],
	'LogSeverity' = [LogSeverity].[DisplayName],
	[CR_Log].[ID_LogType],
	'LogType' = [LogType].[DisplayName],
	'DisplayName' = [dbo].[FN_TruncateText]([CR_Log].[DisplayName], 50),
	[CR_Log].[Date],
	[CR_Log].[Url],
	[CR_Log].[IP],
	[CR_Log].[Browser],
	[CR_Log].[Description],
	[CR_Log].[IsProcessed]
from
[CR_Log]
left join CR_User on CR_User.ID = [CR_Log].[ID_User]
inner join[CR_LogType] as [LogType] on[CR_Log].ID_LogType = [LogType].ID
inner join[CR_LogSeverity] as [LogSeverity] on[CR_Log].ID_LogSeverity = [LogSeverity].ID
where
[CR_Log].IsProcessed = 0
and([CR_Log].ID =@ID or @ID is null)
and([CR_Log].ID_LogSeverity =@ID_LogSeverity or @ID_LogSeverity is null)
and([CR_Log].ID_LogType =@ID_LogType or @ID_LogType is null)
and([CR_Log].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
order by[CR_Log].[Date] desc

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Log_DETAIL')
begin
drop procedure CR_Log_DETAIL
end

GO




/* Načtení detailních informací o záznamu v tabulce CR_Log */
CREATE PROCEDURE[dbo].[CR_Log_DETAIL]
@ID_Login GUID,
@ID ID
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektu CR_Log nastala chyba'

--oprávnění k akci
--exec @Error=CR_Log_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_Log_DETAIL'
--if @Error<>0
--goto FAILED

--načtu informace o záznamu
select
[CR_Log].ID,
	[CR_Log].[ID_User],
	[CR_Log].[ID_LogSeverity],
	'LogSeverity' = [LogSeverity].[DisplayName],
	[CR_Log].[ID_LogType],
	'LogType' = [LogType].[DisplayName],
	[CR_Log].[DisplayName],
	[CR_Log].[Date],
	[CR_Log].[Url],
	[CR_Log].[IP],
	[CR_Log].[Browser],
	[CR_Log].[Description],
	[CR_Log].[IsProcessed]
from
[CR_Log]
inner join[CR_LogType] as LogType on[CR_Log].ID_LogType = [LogType].ID
inner join[CR_LogSeverity] as LogSeverity on[CR_Log].ID_LogSeverity = [LogSeverity].ID
where[CR_Log].ID =@ID

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_Log_EDIT_Process')
begin
drop procedure CR_Log_EDIT_Process
end

GO




/* Editace záznamu v tabulce CR_Log */
CREATE PROCEDURE[dbo].[CR_Log_EDIT_Process]
@ID_Login GUID,
@ID ID
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Při editaci objektu CR_Log nastala chyba'

--oprávnění k akci
exec @Error=CR_Log_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_Log_EDIT_Process'
if @Error<>0
goto FAILED

--editace záznamu
update[CR_Log]
set[IsProcessed] = 1
where ID =@ID

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Log_NEW')
begin
drop procedure CR_Log_NEW
end

GO




/* Založení záznamu v tabulce CR_Log */
CREATE PROCEDURE[dbo].[CR_Log_NEW]
@ID_Login GUID,
@ID_LogSeverity IDVC,
@ID_LogType IDVC,
@DisplayName Note,
@Url DN = null,
@IP DN = null,
@Browser DN = null,
@Description Note = null,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note, @ID_User ID
set @Message = 'Při založení objektu CR_Log nastala chyba'

--Nactu uzivatele a pokud neni zadany Browser, tak jej prevezmu z loginu
select
@ID_User=CR_Login.ID_User,
	@IP=isnull(@IP, CR_Login.[IP]),
@Browser=isnull(@Browser, CR_Login.Browser)
from CR_Login
where CR_Login.ID =@ID_Login

--vložení záznamu do tabulky
insert into[CR_Log]([ID_User], [ID_LogSeverity], [ID_LogType], [DisplayName], [Url], [IP], [Browser], [Description])
values(@ID_User, @ID_LogSeverity, @ID_LogType, @DisplayName, @Url, @IP, @Browser, @Description)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Login_DETAIL_User')
begin
drop procedure CR_Login_DETAIL_User
end

GO




/* Login detail - privatni procedura, nepouzivat mimo SQL! */
CREATE PROCEDURE[dbo].[CR_Login_DETAIL_User]
@ID_Login GUID
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při editaci objektu Login nastala chyba'

select
'ID_Login' = CR_Login.ID,
	CR_User.DisplayName,
	CR_User.Username,
	CR_User.ID,
	CR_User.Email,
	'Permissions' = STUFF((select ', ' + permission.ID from[dbo].[CR_Permission_ALL_Login](@ID_Login) as permission FOR XML PATH('')), 1, 1, ''),
CR_Login.IsSuccess,
	CR_User.ID_Language,
	'Roles' = STUFF((select ', ' + [CR_Role].[DisplayName] from[CR_Role] left join[CR_UserRole] on[CR_UserRole].ID_Role = [CR_Role].[ID] where[CR_UserRole].ID_User = [CR_User].ID and[CR_Role].IsActive = 1 FOR XML PATH('')), 1, 1, '')
from CR_Login
left join CR_User on CR_User.ID = CR_Login.ID_User
where CR_Login.ID =@ID_Login

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END









GO

if exists(select * from sysobjects where name = 'CR_Login_EDIT_Refresh')
begin
drop procedure CR_Login_EDIT_Refresh
end

GO




/* Prodlouzeni platnosti loginu o 30 minut */
CREATE PROCEDURE[dbo].[CR_Login_EDIT_Refresh]
@ID_Login GUID
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při editaci objektu Login nastala chyba'

--overim platnost loginu
exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action='CR_Login_EDIT_Refresh'
if @Error<>0
begin
goto FAILED
end

--prodlouzim login a zmenim kontext firmy
update[CR_Login]
set DateLogout = DATEADD(minute, 60, getdate())
from[CR_Login]
where[CR_Login].ID =@ID_Login

if @@error<>0
goto FAILED

--SignIn data
exec @Error=[dbo].[CR_Login_DETAIL_User] @ID_Login=@ID_Login
if @Error<>0
goto FAILED

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Login_NEW')
begin
drop procedure CR_Login_NEW
end

GO




/* Založení záznamu v tabulce CR_Login */
CREATE PROCEDURE[dbo].[CR_Login_NEW]
@IP DN = null,
@Browser DN = null,
@ID GUID output
AS
BEGIN

begin tran

declare @Error int, @Message Note, @ID_User ID
set @Message = 'Při založení objektu CR_Login nastala chyba'

--založim login
select @ID=NEWID(), @ID_User=null

--vložení záznamu do tabulky
insert into[CR_Login]([ID], [ID_User], [IP], [Browser])
values(@ID, @ID_User, @IP, @Browser)

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Login_VERIFY')
begin
drop procedure CR_Login_VERIFY
end

GO




/* Ověří platnost zadaného loginu
   Pokud je login neplatný, tak procedura vyvolá chybu */
CREATE PROCEDURE[dbo].[CR_Login_VERIFY]
@ID GUID, --ID loginu(přihlašovací token),
@ID_Action IDVC-- akce, kterou chce uživatel vyvolat
AS
BEGIN

declare @Message Note, @ErrorMessages ValidateMessages

if @ID is not null
begin
--overim:
--1) Uzivatel neni zakazany
--2) Login dosud nevyprsel
declare @DateLogout datetime, @IsEnabled bit, @ID_User ID, @IsSuccess bit
select
@DateLogout=CR_Login.DateLogout,
		@IsEnabled=CR_User.IsEnabled,
		@ID_User=CR_User.ID,
		@IsSuccess=CR_Login.IsSuccess
from
CR_Login
left join CR_User on CR_Login.ID_User = CR_User.ID
where
CR_Login.ID =@ID

if @DateLogout is null
begin
insert into @ErrorMessages(Property, DisplayName, Args)
select 'Property' = 'ID_Login', 'DisplayName' = 'Neplatný login (ID_Login=' + isnull(convert(varchar(255),@ID), 'null') + ')', 'Args' = ''
goto FAILED
end

if @IsEnabled=0
begin
insert into @ErrorMessages(Property, DisplayName, Args)
select 'Property' = 'ID_Login', 'DisplayName' = 'Uživatelský účet je zablokovaný (ID_Login=' + isnull(convert(varchar(255),@ID), 'null') + ')', 'Args' = ''
goto FAILED
end

if @DateLogout<GETDATE()
begin
insert into @ErrorMessages(Property, DisplayName, Args)
select 'Property' = 'ID_Login', 'DisplayName' = 'Uživatelský účet je zablokovaný (ID_Login=' + isnull(convert(varchar(255),@ID), 'null') + ')', 'Args' = ''
goto FAILED
end

if @IsSuccess=0 and @ID_Action not in ('CR_Login_EDIT_Refresh', 'CR_User_DETAIL_Email', 'CR_User_Login', 'CR_LoginSecure_NEW', 'CR_User_DETAIL_Profile', 'CR_User_EDIT_Reset')
begin
insert into @ErrorMessages(Property, DisplayName, Args)
select 'Property' = 'ID_Login', 'DisplayName' = 'Neautorizovaný přístup (ID_Login=' + isnull(convert(varchar(255),@ID), 'null') + ')', 'Args' = ''
goto FAILED
end

end else begin
--overim, ze lze zadanou akci volat anonymne
if (select IsAnonymous from CR_Action where ID =@ID_Action)=0
begin
set @Message = 'Akci ' + isnull(@ID_Action, 'null') +' nelze volat anonymně!'
raiserror(@Message, 16, 1)
return 1
end
end

return 0

FAILED:
set @Message =[dbo].[FN_GetErrorXml](@ErrorMessages)
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Operation_ACTION')
begin
drop procedure CR_Operation_ACTION
end

GO

/* Zjištení oprávnení uživatele proti záznamum v tabulce CR_Operation */
CREATE PROCEDURE CR_Operation_ACTION
@ID_Login GUID,
@ID IDVC,
@ID_Action IDVC,
@IsRaiseError bit = 1
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Pri zjištení akcí objektu CR_Operation nastala chyba'

exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action=@ID_Action
if @Error<>0
begin
goto FAILED
end

declare @Actions table(ID IDVC, DisplayName DN)

--nactu seznam možných akcí
if @ID is null
begin
--akce nad tabulkou
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Operation', 0)[CR_Action]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
--CR_Operation_ALL: Nacíst seznam operací
	([CR_Action].ID = 'CR_Operation_ALL')

end else begin
--akce nad záznamem

--ladící volání pri generování stránek(taskid#6094)
if @ID=0
begin
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Operation', 1)[CR_Action]
end

--vyhodnocení akcí pro zadaný záznam
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Operation', 1)[CR_Action]
cross join[CR_Operation]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
[CR_Operation].ID =@ID
and[CR_Operation].IsActive = 1
end

if @IsRaiseError=1
begin
if not exists(select * from @Actions where ID =@ID_Action)
begin
set @Message = 'Nemáte oprávnení k akci ' + @ID_Action + ' nad záznamem ID=' + ISNULL(convert(varchar, @ID), 'NULL') + '!'
goto FAILED
end
end else begin
select ID, DisplayName from @Actions order by DisplayName
end

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END



GO

if exists(select * from sysobjects where name = 'CR_Operation_ALL')
begin
drop procedure CR_Operation_ALL
end

GO

/* Nactení seznamu záznamu v tabulce CR_Operation */
CREATE PROCEDURE CR_Operation_ALL
@ID_Login GUID,
@Top int = 500,
@ID IDVC = null,
@DisplayName nvarchar(255) = null
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Pri nactení objektu CR_Operation nastala chyba'
select @top=500 where @Top is null

--oprávnení k akci
exec @Error=CR_Operation_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Operation_ALL'
if @Error<>0
goto FAILED

--vrátim záznamy podle zadaných filtru
select top(@Top)
[CR_Operation].ID,
	[CR_Operation].[IsActive],
	[CR_Operation].[DisplayName],
	[CR_Operation].[Operator]
from
[CR_Operation]
where
	([CR_Operation].ID =@ID or @ID is null)
and[CR_Operation].IsActive = 1
and([CR_Operation].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
order by[CR_Operation].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END



GO

if exists(select * from sysobjects where name = 'CR_PageState_ACTION')
begin
drop procedure CR_PageState_ACTION
end

GO

/* Zjištení oprávnení uživatele proti záznamum v tabulce CR_PageState */
CREATE PROCEDURE CR_PageState_ACTION
@ID_Login GUID,
@ID ID,
@ID_Action IDVC,
@IsRaiseError bit = 1
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Pri zjištení akcí objektu CR_PageState nastala chyba'

exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action=@ID_Action
if @Error<>0
begin
goto FAILED
end

declare @Actions table(ID IDVC, DisplayName DN)

--nactu seznam možných akcí
if @ID is null
begin
--akce nad tabulkou
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_PageState', 0)[CR_Action]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
--CR_PageState_NEW_Copy: Kopie stavu
	([CR_Action].ID = 'CR_PageState_NEW_Copy')

end else begin
--akce nad záznamem

--ladící volání pri generování stránek(taskid#6094)
if @ID=0
begin
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_PageState', 1)[CR_Action]
end

--vyhodnocení akcí pro zadaný záznam
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_PageState', 1)[CR_Action]
cross join[CR_PageState]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
[CR_PageState].ID =@ID
and(

	--CR_PageState_DEL: Smazání stavu
	([CR_Action].ID = 'CR_PageState_DEL')
		
		or

		--CR_PageState_DETAIL: Nacíst detail pohledu
	([CR_Action].ID = 'CR_PageState_DETAIL')
		
		or

		--CR_PageState_EDIT_IsDefault: Upravit jako výchozí stav
	([CR_Action].ID = 'CR_PageState_EDIT_IsDefault')
		
		or

		--CR_PageStateItem_ALL_PageState: Nacíst seznam položek pohledu
	([CR_Action].ID = 'CR_PageStateItem_ALL_PageState')
)
end

if @IsRaiseError=1
begin
if not exists(select * from @Actions where ID =@ID_Action)
begin
set @Message = 'Nemáte oprávnení k akci ' + @ID_Action + ' nad záznamem ID=' + ISNULL(convert(varchar, @ID), 'NULL') + '!'
goto FAILED
end
end else begin
select ID, DisplayName from @Actions order by DisplayName
end

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END



GO

if exists(select * from sysobjects where name = 'CR_PageState_ALL')
begin
drop procedure CR_PageState_ALL
end

GO

/* Načtení seznamu záznamů v tabulce CR_PageState */
CREATE PROCEDURE CR_PageState_ALL
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@ID_User ID = null, --doplnit pokud je null podle loginu
@DisplayName DN = null,
@PageUrl DN = null
AS
BEGIN

declare @Error int, @Message Note, @ID_Company ID
set @Message = 'Při načtení objektů CR_PageState nastala chyba'
select @Top = 500 where @Top is null

----oprávnění k akci
--exec @Error=CR_Object_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_PageState_ALL'
--if @Error<>0
--goto FAILED

select @ID_User=[dbo].[CR_Login_User](@ID_Login) where @ID_User is null

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_PageState].ID,
	[CR_PageState].[PageUrl],
	[CR_PageState].[ID_User],
	'User' = [User].[DisplayName],
	[CR_PageState].[DisplayName],
	[CR_PageState].[DateCreate],
	[CR_PageState].[IsDefault]
from
[CR_PageState]
inner join[CR_User] as [User] on[CR_PageState].ID_User = [User].ID
where
	([CR_PageState].ID =@ID or @ID is null)
and([CR_PageState].ID_User =@ID_User or @ID_User is null)
and([CR_PageState].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
and([CR_PageState].PageUrl like @PageUrl or @PageUrl is null)
order by[CR_PageState].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END



GO

if exists(select * from sysobjects where name = 'CR_PageState_DEL')
begin
drop procedure CR_PageState_DEL
end

GO

/* Smazání záznamu v tabulce CR_PageState */
CREATE PROCEDURE CR_PageState_DEL
@ID_Login GUID,
@ID ID
AS
BEGIN

/* Generated */

begin tran

declare @Error int, @Message Note
set @Message = 'Pri smazání objektu CR_PageState nastala chyba'

--oprávnení k akci
exec @Error=CR_PageState_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_PageState_DEL'
if @Error<>0
goto FAILED

delete from[CR_PageStateItem] where ID_PageState =@ID
if @@error<>0
goto FAILED

--smažu záznam
delete from[CR_PageState] where ID =@ID
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END




GO

if exists(select * from sysobjects where name = 'CR_PageState_DETAIL')
begin
drop procedure CR_PageState_DETAIL
end

GO




/* Načtení detailních informací o záznamu v tabulce CR_PageState */
CREATE PROCEDURE[dbo].[CR_PageState_DETAIL]
@ID_Login GUID,
@ID ID = null,
@PageUrl DN = null
AS
BEGIN


declare @Error int, @Message Note, @ID_User ID
set @Message = 'Při načtení objektu CR_PageState nastala chyba'

select @ID_User = dbo.CR_Login_User(@ID_Login)
select @ID=ID from[CR_PageState] where @ID is null and PageUrl like @PageUrl and ID_User =@ID_User order by[IsDefault] asc
print @id
--oprávnění k akci
--exec @Error=CR_PageState_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_PageState_DETAIL'
--if @Error<>0
--goto FAILED

--načtu informace o záznamu
select
[CR_PageState].ID,
	[CR_PageState].[PageUrl],
	[CR_PageState].[ID_User],
	'User' = [User].[DisplayName],
	[CR_PageState].[DisplayName],
	[CR_PageState].[DateCreate],
	[CR_PageState].[IsDefault]
from
[CR_PageState]
inner join[CR_User] as [User] on[CR_PageState].ID_User = [User].ID
where[CR_PageState].ID =@ID

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_PageState_EDIT_IsDefault')
begin
drop procedure CR_PageState_EDIT_IsDefault
end

GO

/* Editace záznamu v tabulce CR_PageState */
CREATE PROCEDURE CR_PageState_EDIT_IsDefault
@ID_Login GUID,
@ID ID
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Pri editaci objektu CR_PageState nastala chyba'

--oprávnení k akci
exec @Error=CR_PageState_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_PageState_EDIT_IsDefault'
if @Error<>0
goto FAILED

----validace dat
--declare @Messages ValidateMessages
--insert into @Messages
--exec CR_PageState_VALIDATE
--	@ID_Login=@ID_Login,
--	@ID_Action='CR_PageState_EDIT',
	--	@ID=@ID,
--	@PageUrl=@PageUrl,
--	@ID_User=@ID_User,
--	@DisplayName=@DisplayName,
--	@DateCreate=@DateCreate,
--	@IsDefault=@IsDefault
--if @@error<>0
--goto FAILED

--if exists(select * from @Messages)
--begin
--set @Message = dbo.FN_GetValidationXml(@Messages)
--goto FAILED
--end

--vymazu vychozimu vsechny polozky
delete [CR_PageStateItem]
from[CR_PageStateItem]
inner join[CR_PageState] as [CR_PageStateDefault] on[CR_PageStateDefault].ID = [CR_PageStateItem].ID_PageState
inner join[CR_PageState] on[CR_PageState].ID_User = [CR_PageStateDefault].ID_User and[CR_PageState].PageUrl = [CR_PageStateDefault].PageUrl
where[CR_PageState].ID =@ID
and[CR_PageStateDefault].IsDefault = 1

if @@error<>0
goto FAILED

--naopak ulozim vsechny polozky z tohoto do vychoziho
insert into[CR_PageStateItem]([ID_PageState], [ControlID], [Key], [Value])
select[CR_PageStateDefault].[ID], [ControlID], [Key], [Value]
from[CR_PageStateItem]
inner join[CR_PageState] on[CR_PageState].ID = [CR_PageStateItem].ID_PageState
inner join[CR_PageState] as [CR_PageStateDefault] on[CR_PageState].ID_User = [CR_PageStateDefault].ID_User and[CR_PageState].PageUrl = [CR_PageStateDefault].PageUrl
where[CR_PageState].ID =@ID
and[CR_PageStateDefault].IsDefault = 1

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END



GO

if exists(select * from sysobjects where name = 'CR_PageState_NEW_Copy')
begin
drop procedure CR_PageState_NEW_Copy
end

GO


/* Založení záznamu v tabulce CR_PageState */
CREATE PROCEDURE[dbo].[CR_PageState_NEW_Copy]
@ID_Login GUID,
@ID_PageState ID,
@DisplayName nvarchar(255),
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Pri založení objektu CR_PageState nastala chyba'

--oprávnení k akci
--exec @Error=CR_PageState_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_PageState_NEW_Copy'
--if @Error<>0
--goto FAILED

----validace dat
--declare @Messages ValidateMessages
--insert into @Messages
--exec CR_PageState_VALIDATE
--	@ID_Login=@ID_Login,
--	@ID_Action='CR_PageState_NEW',
	--	@ID=@ID,
--	@PageUrl=@PageUrl,
--	@ID_User=@ID_User,
--	@DisplayName=@DisplayName
--if @@error<>0
--goto FAILED

--if exists(select * from @Messages)
--begin
--set @Message = dbo.FN_GetValidationXml(@Messages)
--goto FAILED
--end


--test, jestli pohled existuje, pokud ano, tak nezakladat novy
select @ID =[CR_PageState].ID from[CR_PageState]
inner join(select * from[CR_PageState] where ID = @ID_PageState) As SubQuery
on SubQuery.ID_User = [CR_PageState].ID_User and SubQuery.PageUrl = [CR_PageState].PageUrl
where[CR_PageState].DisplayName = @DisplayName

if @@error<>0
goto FAILED

if (@ID Is Null) begin
--vložení záznamu do tabulky
	insert into[CR_PageState]([PageUrl], [ID_User], [DisplayName])
select[CR_PageState].[PageUrl], [CR_PageState].[ID_User], @DisplayName
from[CR_PageState]
where[CR_PageState].ID =@ID_PageState

if @@error<>0
goto FAILED

set @ID=@@IDENTITY
end

--odstraneni duplicitniho zaznamu
delete from[CR_PageStateItem] where[ID_PageState] = @ID

--kopie položek
insert into[CR_PageStateItem]([ID_PageState], [ControlID], [Key], [Value])
select @ID as[ID_PageState], [ControlID], [Key], [Value]
from[CR_PageStateItem]
where[CR_PageStateItem].[ID_PageState] =@ID_PageState

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END





GO

if exists(select * from sysobjects where name = 'CR_PageState_SET')
begin
drop procedure CR_PageState_SET
end

GO

/* Založení záznamu v tabulce CR_PageState */
CREATE PROCEDURE CR_PageState_SET
@ID_Login GUID,
@PageUrl DN,
@DisplayName DN = null,
@ControlId DN = null, 
@Value Note = null,
@Key DN = null,
@ID_PageState ID = null,
@ID ID = null out, --ID_PageState
@ID_PageStateItem ID = null out

AS
BEGIN

begin tran

declare @Error int, @Message Note, @ID_User ID, @ID_Company ID
set @Message = 'Při založení objektu CR_PageState nastala chyba'
select @ID_User = dbo.CR_Login_User(@ID_Login)
select @DisplayName='default' where @DisplayName is null
select @Key = 'default' where @Key is null

select @ID=@ID_PageState where @ID is null and @ID_PageState is not null

--oprávnění k akci
--exec @Error=CR_PageState_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_PageState_NEW'
--if @Error<>0
--goto FAILED

--validace dat
--declare @Messages ValidateMessages
--insert into @Messages
--exec CR_PageState_VALIDATE
--	@ID_Login=@ID_Login,
--	@ID_Action='CR_PageState_NEW',
	--	@ID=@ID,
--	@PageUrl=@PageUrl,
--	@ID_User=@ID_User,
--	@DisplayName=@DisplayName
--if @@error<>0
--goto FAILED

--if exists(select * from @Messages)
--begin
--set @Message = dbo.FN_GetValidationXml(@Messages)
--goto FAILED
--end

select @ID=ID from[CR_PageState] where @ID is null and PageUrl like @PageUrl and ID_User =@ID_User and DisplayName like @DisplayName
if @ID is null
begin
--vložení záznamu do tabulky
	insert into[CR_PageState]([PageUrl], [ID_User], [DisplayName], [IsDefault])
values(@PageUrl, @ID_User, @DisplayName, case when @Key='default' then 1 else 0 end)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY
end

select @ID_PageStateItem=ID from[CR_PageStateItem] where ID_PageState =@ID and ControlID like @ControlId and[Key] like @Key
if @ID_PageStateItem is null
begin
--vložení záznamu do tabulky
	insert into[CR_PageStateItem]([ID_PageState], [ControlID], [Key], [Value])
values(@ID, @ControlId, @Key, @Value)

if @@error<>0
goto FAILED

set @ID_PageStateItem=@@IDENTITY
end
else
begin
update[CR_PageStateItem] set[Value] =@Value where ID =@ID_PageStateItem
end

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1


END






GO

if exists(select * from sysobjects where name = 'CR_PageState_VALIDATE')
begin
drop procedure CR_PageState_VALIDATE
end

GO




/* Validace zadaných údajů záznamu v tabulce CR_PageState */
CREATE PROCEDURE[dbo].[CR_PageState_VALIDATE]
@ID_Login GUID,
@ID_Action IDVC,
@ID ID = null,
@PageUrl DN = null,
@ID_User ID = null,
@DisplayName DN = null,
@DateCreate datetime = null,
@IsDefault bit = null
AS
BEGIN

/* Generated */

declare @Messages ValidateMessages

insert into @Messages(Property, DisplayName, Args)

/* PageUrl */
select 'Property' = 'PageUrl', 'DisplayName' = 'Pole "Stránka" musí být zadáno', 'Args' = ''
where isnull(@PageUrl, '')=''
union

/* ID_User */
select 'Property' = 'ID_User', 'DisplayName' = 'Pole "Uživatel" musí být zadáno', 'Args' = ''
where @ID_User is null
union

/* DisplayName */
select 'Property' = 'DisplayName', 'DisplayName' = 'Pole "Název pohledu" musí být zadáno', 'Args' = ''
where isnull(@DisplayName, '')=''
--union

/* DateCreate */
--select 'Property' = 'DateCreate', 'DisplayName' = 'Pole "Datum založení" musí být zadáno', 'Args' = ''
--where @DateCreate is null
--union

/* IsDefault */
--select 'Property' = 'IsDefault', 'DisplayName' = 'Pole "Zda je výchozí" musí být zadáno', 'Args' = ''
--where @IsDefault is null

select * from @Messages

END









GO

if exists(select * from sysobjects where name = 'CR_PageStateItem_ALL_PageState')
begin
drop procedure CR_PageStateItem_ALL_PageState
end

GO




/* Načtení seznamu záznamů v tabulce CR_PageStateItem */
CREATE PROCEDURE[dbo].[CR_PageStateItem_ALL_PageState]
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@ID_PageState ID
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_PageStateItem nastala chyba'

--oprávnění k akci
--exec @Error=CR_PageStateItem_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_PageStateItem_ALL'
--if @Error<>0
--goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_PageStateItem].ID,
	[CR_PageStateItem].[ID_PageState],
	'PageState' = [PageState].[DisplayName],
	[CR_PageStateItem].[ControlID],
	[CR_PageStateItem].[Key],
	[CR_PageStateItem].[Value]
from
[CR_PageStateItem]
inner join[CR_PageState] as [PageState] on[CR_PageStateItem].ID_PageState = [PageState].ID
where
	([CR_PageStateItem].ID =@ID or @ID is null)
and([CR_PageStateItem].ID_PageState =@ID_PageState or @ID_PageState is null)

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Permission_ACTION')
begin
drop procedure CR_Permission_ACTION
end

GO




/* Zjištění oprávnění uživatele proti záznamům v tabulce CR_Permission */
CREATE PROCEDURE CR_Permission_ACTION
@ID_Login GUID,
@ID ID = null,
@ID_Action IDVC,
@IsRaiseError bit = 1
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Při zjištění akcí objektu CR_Permission nastala chyba'

exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action=@ID_Action
if @Error<>0
begin
goto FAILED
end

declare @Actions table(ID IDVC, DisplayName DN)

--načtu seznam možných akcí
if @ID is null
begin
--akce nad tabulkou
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Permission', 0)[CR_Action]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
--CR_Permission_ALL: Načíst přehled oprávnění
	([CR_Action].ID = 'CR_Permission_ALL')

end else begin
--akce nad záznamem

--ladící volání při generování stránek(taskid#6094)
if @ID=0
begin
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Permission', 1)[CR_Action]
end

--vyhodnocení akcí pro zadaný záznam
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Permission', 1)[CR_Action]
cross join[CR_Permission]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
[CR_Permission].ID =@ID
and[CR_Permission].IsActive = 1
end

if @IsRaiseError=1
begin
if not exists(select * from @Actions where ID =@ID_Action)
begin
set @Message = 'Nemáte oprávnění k akci ' + @ID_Action + ' nad záznamem ID=' + ISNULL(convert(varchar, @ID), 'NULL') + '!'
goto FAILED
end
end else begin
select ID, DisplayName from @Actions order by DisplayName
end

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_Permission_ALL')
begin
drop procedure CR_Permission_ALL
end

GO




/* Načtení seznamu záznamů v tabulce CR_Permission */
CREATE PROCEDURE CR_Permission_ALL
@ID_Login GUID,
@Top int = 500,
@ID IDVC = null,
@DisplayName DN = null,
@ID_PermissionGroup IDVC = null
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_Permission nastala chyba'
select @Top = 500 where @Top is null

--oprávnění k akci
exec @Error=CR_Permission_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Permission_ALL'
if @Error<>0
goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_Permission].ID,
	[CR_Permission].[IsActive],
	[CR_Permission].[DisplayName],
	[CR_Permission].[Description],
	[CR_Permission].[ID_PermissionGroup],
	'PermissionGroup' = [PermissionGroup].[DisplayName]
from
[CR_Permission]
left join[CR_PermissionGroup] as [PermissionGroup] on[CR_Permission].ID_PermissionGroup = [PermissionGroup].ID
where
	([CR_Permission].ID =@ID or @ID is null)
and[CR_Permission].IsActive = 1
and([CR_Permission].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
and([CR_Permission].ID_PermissionGroup =@ID_PermissionGroup or @ID_PermissionGroup is null)
order by[CR_Permission].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END









GO

if exists(select * from sysobjects where name = 'CR_Role_ACTION')
begin
drop procedure CR_Role_ACTION
end

GO


/* Zjištení oprávnení uživatele proti záznamum v tabulce CR_Role */
CREATE PROCEDURE CR_Role_ACTION
@ID_Login GUID,
@ID ID,
@ID_Action IDVC,
@IsRaiseError bit = 1
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Pri zjištení akcí objektu CR_Role nastala chyba'

exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action=@ID_Action
if @Error<>0
begin
goto FAILED
end

declare @Actions table(ID IDVC, DisplayName DN)

--nactu seznam možných akcí
if @ID is null
begin
--akce nad tabulkou
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Role', 0)[CR_Action]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
--CR_Role_ALL: Nacíst seznam rolí
	([CR_Action].ID = 'CR_Role_ALL')

or

--CR_Role_NEW: Založit roli
	([CR_Action].ID = 'CR_Role_NEW')

end else begin
--akce nad záznamem

--ladící volání pri generování stránek(taskid#6094)
if @ID=0
begin
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Role', 1)[CR_Action]
end

--vyhodnocení akcí pro zadaný záznam
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Role', 1)[CR_Action]
cross join[CR_Role]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
[CR_Role].ID =@ID
and[CR_Role].IsActive = 1
and(

	--CR_EntityLog_ALL_Role_CR: Nacíst historii role
	([CR_Action].ID = 'CR_EntityLog_ALL_Role_CR')
		
		or

		--CR_Role_DEL: Smazat roli
	([CR_Action].ID = 'CR_Role_DEL')
		
		or

		--CR_Role_DETAIL: Nacíst detail role
	([CR_Action].ID = 'CR_Role_DETAIL')
		
		or

		--CR_Role_EDIT: Upravit roli
	([CR_Action].ID = 'CR_Role_EDIT')
		
		or

		--CR_RolePermission_ALL_Role: Nacíst prehled oprávnení role
	([CR_Action].ID = 'CR_RolePermission_ALL_Role')
		
		or

		--CR_RolePermission_DEL_Role: Smazat oprávnení role
	([CR_Action].ID = 'CR_RolePermission_DEL_Role')
		
		or

		--CR_RolePermission_NEW_Role: Založit oprávnení role
	([CR_Action].ID = 'CR_RolePermission_NEW_Role')
)
end

if @IsRaiseError=1
begin
if not exists(select * from @Actions where ID =@ID_Action)
begin
set @Message = 'Nemáte oprávnení k akci ' + @ID_Action + ' nad záznamem ID=' + ISNULL(convert(varchar, @ID), 'NULL') + '!'
goto FAILED
end
end else begin
select ID, DisplayName from @Actions order by DisplayName
end

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END





GO

if exists(select * from sysobjects where name = 'CR_Role_ALL')
begin
drop procedure CR_Role_ALL
end

GO




/* Načtení seznamu záznamů v tabulce CR_Role */
CREATE PROCEDURE CR_Role_ALL
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@DisplayName DN = null
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_Role nastala chyba'
select @Top = 500 where @Top is null

--oprávnění k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Role_ALL'
if @Error<>0
goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_Role].ID,
	[CR_Role].[IsActive],
	[CR_Role].[DisplayName],
	[CR_Role].[Key],
	[CR_Role].[IsDefault]
from
[CR_Role]
where
	([CR_Role].ID =@ID or @ID is null)
and[CR_Role].IsActive = 1
and([CR_Role].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
order by[CR_Role].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END









GO

if exists(select * from sysobjects where name = 'CR_Role_DEL')
begin
drop procedure CR_Role_DEL
end

GO


/* Smazání záznamu v tabulce CR_Role */
CREATE PROCEDURE CR_Role_DEL
@ID_Login GUID,
@ID ID
AS
BEGIN

/* Generated */

begin tran

declare @Error int, @Message Note
set @Message = 'Pri smazání objektu CR_Role nastala chyba'

--oprávnení k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_Role_DEL'
if @Error<>0
goto FAILED

--zneplatnení záznamu
update[CR_Role] set IsActive = 0 where ID =@ID
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END





GO

if exists(select * from sysobjects where name = 'CR_Role_DETAIL')
begin
drop procedure CR_Role_DETAIL
end

GO




/* Načtení detailních informací o záznamu v tabulce CR_Role */
CREATE PROCEDURE CR_Role_DETAIL
@ID_Login GUID,
@ID ID
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Při načtení objektu CR_Role nastala chyba'

--oprávnění k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_Role_DETAIL'
if @Error<>0
goto FAILED

--načtu informace o záznamu
select
[CR_Role].ID,
	[CR_Role].[IsActive],
	[CR_Role].[DisplayName],
	[CR_Role].[Key],
	[CR_Role].[IsDefault]
from
[CR_Role]
where[CR_Role].IsActive = 1 and[CR_Role].ID =@ID

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END









GO

if exists(select * from sysobjects where name = 'CR_Role_EDIT')
begin
drop procedure CR_Role_EDIT
end

GO


/* Editace záznamu v tabulce CR_Role */
CREATE PROCEDURE CR_Role_EDIT
@ID_Login GUID,
@ID ID,
@DisplayName DN,
@Key DN,
@IsDefault bit
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Pri editaci objektu CR_Role nastala chyba'

--oprávnení k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_Role_EDIT'
if @Error<>0
goto FAILED

--validace dat
declare @Messages ValidateMessages
insert into @Messages
exec CR_Role_VALIDATE
@ID_Login=@ID_Login,
@ID_Action='CR_Role_EDIT',
	@ID=@ID,
@DisplayName=@DisplayName,
@Key=@Key,
@IsDefault=@IsDefault
if @@error<>0
goto FAILED

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--editace záznamu
update[CR_Role]
set[DisplayName] =@DisplayName,
[Key] =@Key,
[IsDefault] =@IsDefault
where ID =@ID

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END





GO

if exists(select * from sysobjects where name = 'CR_Role_NEW')
begin
drop procedure CR_Role_NEW
end

GO


/* Založení záznamu v tabulce CR_Role */
CREATE PROCEDURE CR_Role_NEW
@ID_Login GUID,
@DisplayName DN,
@Key DN,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Pri založení objektu CR_Role nastala chyba'

--oprávnení k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Role_NEW'
if @Error<>0
goto FAILED

--validace dat
declare @Messages ValidateMessages
insert into @Messages
exec CR_Role_VALIDATE
@ID_Login=@ID_Login,
@ID_Action='CR_Role_NEW',
	@ID=@ID,
@DisplayName=@DisplayName,
@Key=@Key
if @@error<>0
goto FAILED

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--zaregistruju záznam jako entitu
declare @ID_Entity ID
exec @Error=CR_Entity_NEW @ID_Login=@ID_Login, @ID=@ID_Entity out, @ID_EntityType='cr_role'
if @Error<>0
goto FAILED

--zápis do historie entity
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType='cr_role_new'
if @Error<>0 goto FAILED

--vložení záznamu do tabulky
insert into[CR_Role]([DisplayName], [Key], [ID_Entity])
values(@DisplayName, @Key, @ID_Entity)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END





GO

if exists(select * from sysobjects where name = 'CR_Role_VALIDATE')
begin
drop procedure CR_Role_VALIDATE
end

GO


/* Validace zadaných údaju záznamu v tabulce CR_Role */
CREATE PROCEDURE CR_Role_VALIDATE
@ID_Login GUID,
@ID_Action IDVC,
@ID ID = null,
@DisplayName DN = null,
@Key DN = null,
@IsDefault bit = null
AS
BEGIN

/* Generated */

declare @Messages ValidateMessages

insert into @Messages(Property, DisplayName, Args)

/* DisplayName */
select 'Property' = 'DisplayName', 'DisplayName' = 'Pole "Role" musí být zadáno', 'Args' = ''
where isnull(@DisplayName, '')=''
union

/* Key */
select 'Property' = 'Key', 'DisplayName' = 'Pole "Unikátní klíc" musí být zadáno', 'Args' = ''
where isnull(@Key, '')=''
--union

/* IsDefault */
--select 'Property' = 'IsDefault', 'DisplayName' = 'Pole "Výchozí" musí být zadáno', 'Args' = ''
--where @IsDefault is null

select * from @Messages

END





GO

if exists(select * from sysobjects where name = 'CR_RolePermission_ALL_Role')
begin
drop procedure CR_RolePermission_ALL_Role
end

GO




/* Načtení seznamu záznamů v tabulce CR_RolePermission */
CREATE PROCEDURE[dbo].[CR_RolePermission_ALL_Role]
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@ID_Role ID,
@ID_Permission IDVC = null,
@DisplayName DN = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_RolePermission nastala chyba'

--oprávnění k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=@ID_Role, @ID_Action='CR_RolePermission_ALL_Role'
if @Error<>0
goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_RolePermission].ID,
	[CR_RolePermission].[ID_Role],
	'Role' = [Role].[DisplayName],
	[CR_RolePermission].[ID_Permission],
	'Permission' = [Permission].[DisplayName],
	[Permission].[ID_PermissionGroup],
	'PermissionGroup' = [CR_PermissionGroup].[DisplayName]
from
[CR_RolePermission]
inner join[CR_Role] as [Role] on[CR_RolePermission].ID_Role = [Role].ID
inner join[CR_Permission] as [Permission] on[CR_RolePermission].ID_Permission = [Permission].ID
inner join[CR_PermissionGroup] on[CR_PermissionGroup].ID = [Permission].[ID_PermissionGroup]
where
	([CR_RolePermission].ID =@ID or @ID is null)
and[Role].IsActive = 1 and[Permission].IsActive = 1
and([CR_RolePermission].ID_Role =@ID_Role or @ID_Role is null)
and([CR_RolePermission].ID_Permission =@ID_Permission or @ID_Permission is null)
and([Permission].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END









GO

if exists(select * from sysobjects where name = 'CR_RolePermission_DEL_Role')
begin
drop procedure CR_RolePermission_DEL_Role
end

GO




/* Smazání záznamu v tabulce CR_RolePermission */
CREATE PROCEDURE[dbo].[CR_RolePermission_DEL_Role]
@ID_Login GUID,
@ID ID
AS
BEGIN

begin tran

declare @Error int, @Message Note, @ID_Role ID
set @Message = 'Při smazání objektu CR_RolePermission nastala chyba'
select @ID_Role=ID_Role from[CR_RolePermission] where ID =@ID

--oprávnění k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=@ID_Role, @ID_Action='CR_RolePermission_DEL_Role'
if @Error<>0
goto FAILED

--zalogovani do nadrazene polozky
declare @ID_Entity int, @EntityDescription DN
select @ID_Entity=[CR_Role].ID_Entity,
	 @EntityDescription='Smazání oprávnění ''' + [CR_RolePermission].ID_Permission + ''''
from[CR_RolePermission]
inner join[CR_Role] on[CR_Role].ID = [CR_RolePermission].ID_Role
where[CR_RolePermission].ID =@ID

--zápis do historie entity 
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity, --cr_role
@ID_EntityLogType='cr_rolepermission_del_role',
				@Description=@EntityDescription,
@ID_Object=@ID--cr_rolepermission
if @Error<>0 goto FAILED

--smažu záznam
delete from[CR_RolePermission] where ID =@ID
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_RolePermission_NEW_Role')
begin
drop procedure CR_RolePermission_NEW_Role
end

GO




/* Založení záznamu v tabulce CR_RolePermission */
CREATE PROCEDURE[dbo].[CR_RolePermission_NEW_Role]
@ID_Login GUID,
@ID_Role ID,
@ID_Permission IDVC,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Při založení objektu CR_RolePermission nastala chyba'

--oprávnění k akci
exec @Error=CR_Role_ACTION @ID_Login=@ID_Login, @ID=@ID_Role, @ID_Action='CR_RolePermission_NEW_Role'
if @Error<>0
goto FAILED

--validace dat
declare @Messages ValidateMessages
insert into @Messages
exec CR_RolePermission_VALIDATE
@ID_Login=@ID_Login,
@ID_Action='CR_RolePermission_NEW_Role',
	@ID=@ID,
@ID_Role=@ID_Role,
@ID_Permission=@ID_Permission
if @@error<>0
goto FAILED

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--vložení záznamu do tabulky
insert into[CR_RolePermission]([ID_Role], [ID_Permission])
values(@ID_Role, @ID_Permission)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

--zalogovani do nadrazene polozky
declare @ID_Entity int, @EntityDescription DN = 'Přidáno oprávnění ''' + @ID_Permission +''''
select @ID_Entity=ID_Entity from CR_Role where ID =@ID_Role
--zápis do historie entity 
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity, --cr_role
@ID_EntityLogType='cr_rolepermission_new_role',
				@Description=@EntityDescription,
@ID_Object=@ID--cr_rolepermission
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_RolePermission_VALIDATE')
begin
drop procedure CR_RolePermission_VALIDATE
end

GO


/* Validace zadaných údaju záznamu v tabulce CR_RolePermission */
CREATE PROCEDURE CR_RolePermission_VALIDATE
@ID_Login GUID,
@ID_Action IDVC,
@ID ID = null,
@ID_Role int = null,
@ID_Permission nvarchar(50) = null
AS
BEGIN

/* Generated */

declare @Messages ValidateMessages

insert into @Messages(Property, DisplayName, Args)

/* ID_Role */
select 'Property' = 'ID_Role', 'DisplayName' = 'Pole "Role" musí být zadáno', 'Args' = ''
where @ID_Role is null
union

/* ID_Permission */
select 'Property' = 'ID_Permission', 'DisplayName' = 'Pole "Oprávnení" musí být zadáno', 'Args' = ''
where @ID_Permission is null

select * from @Messages

END





GO

if exists(select * from sysobjects where name = 'CR_Setting_ACTION')
begin
drop procedure CR_Setting_ACTION
end

GO




/* Zjištění oprávnění uživatele proti záznamům v tabulce CR_Setting */
CREATE PROCEDURE[dbo].[CR_Setting_ACTION]
@ID_Login GUID,
@ID IDVC = null,
@ID_Action IDVC,
@IsRaiseError bit = 1
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při zjištění akcí objektu CR_Setting nastala chyba'

exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action=@ID_Action
if @Error<>0
begin
goto FAILED
end

declare @Actions table(ID IDVC, DisplayName DN)

--načtu seznam možných akcí
if @ID is null
begin
--akce nad tabulkou
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Setting', 0)[CR_Action]
left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where

--CR_Setting_ALL_Admin: Načíst seznam nastavení(administrátor)
	([CR_Action].ID = 'CR_Setting_ALL_Admin')

or

--CR_Setting_EDIT: Upravit nastavení
	([CR_Action].ID = 'CR_Setting_EDIT')

end else begin
--akce nad záznamem

--ladící volání při generování stránek(taskid#6094)
if @ID=0
begin
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Setting', 1)[CR_Action]
end

--vyhodnocení akcí pro zadaný záznam
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_Setting', 1)[CR_Action]
cross join[CR_Setting]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
[CR_Setting].ID =@ID
end

if @IsRaiseError=1
begin
if not exists(select * from @Actions where ID =@ID_Action)
begin
set @Message = 'Nemáte oprávnění k akci ' + @ID_Action + ' nad záznamem ID=' + ISNULL(convert(varchar, @ID), 'NULL') + '!'
goto FAILED
end
end else begin
select ID, DisplayName from @Actions order by DisplayName
end

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_Setting_ALL')
begin
drop procedure CR_Setting_ALL
end

GO




/* Načtení seznamu záznamů v tabulce CR_Setting */
CREATE PROCEDURE[dbo].[CR_Setting_ALL]
@ID_Login GUID,
@Top int = 500,
@ID IDVC = null,
@DisplayName DN = null
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_Setting nastala chyba'

--oprávnění k akci
--exec @Error=CR_Setting_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Setting_ALL'
--if @Error<>0
--goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_Setting].ID,
	[CR_Setting].[DisplayName],
	[CR_Setting].[Description],
	[CR_Setting].[Value]
from
[CR_Setting]
where
	([CR_Setting].ID =@ID or @ID is null)
and([CR_Setting].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
order by[CR_Setting].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Setting_ALL_Admin')
begin
drop procedure CR_Setting_ALL_Admin
end

GO




/* Načtení seznamu záznamů v tabulce CR_Setting */
CREATE PROCEDURE[dbo].[CR_Setting_ALL_Admin]
@ID_Login GUID,
@Top int = 500,
@ID IDVC = null,
@DisplayName DN = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_Setting nastala chyba'

--oprávnění k akci
exec @Error=CR_Setting_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Setting_ALL_Admin'
if @Error<>0
goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_Setting].ID,
	[CR_Setting].[DisplayName],
	[CR_Setting].[Description],
	[CR_Setting].[Value]
from
[CR_Setting]
where
	([CR_Setting].ID =@ID or @ID is null)
and([CR_Setting].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
order by[CR_Setting].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_Setting_EDIT')
begin
drop procedure CR_Setting_EDIT
end

GO




/* Editace záznamu v tabulce CR_Setting */
CREATE PROCEDURE[dbo].[CR_Setting_EDIT]
@ID_Login GUID,
@ID IDVC,
@Value Note = null
AS
BEGIN
begin tran

declare @Error int, @Message Note
set @Message = 'Při editaci objektu CR_Setting nastala chyba'

--oprávnění k akci
exec @Error=CR_Setting_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_Setting_EDIT'
if @Error<>0
goto FAILED

--validace dat
--declare @Messages ValidateMessages
--insert into @Messages
--exec CR_Setting_VALIDATE
--	@ID_Login=@ID_Login,
--	@ID_Action='CR_Setting_EDIT',
	--	@ID=@ID,
--	@DisplayName=@DisplayName,
--	@Description=@Description,
--	@Value=@Value
--if @@error<>0
--goto FAILED

--if exists(select * from @Messages)
--begin
--set @Message = dbo.FN_GetValidationXml(@Messages)
--goto FAILED
--end

--editace záznamu
update[CR_Setting]
set[Value] =@Value
where ID =@ID

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_User_ACTION')
begin
drop procedure CR_User_ACTION
end

GO




/* Zjištění oprávnění uživatele proti záznamům v tabulce CR_User */
CREATE PROCEDURE CR_User_ACTION
@ID_Login GUID,
@ID ID,
@ID_Action IDVC,
@IsRaiseError bit = 1
AS
BEGIN

/* Generated */

declare @Error int, @Message Note
set @Message = 'Při zjištění akcí objektu CR_User nastala chyba'

exec @Error=CR_Login_VERIFY @ID=@ID_Login, @ID_Action=@ID_Action
if @Error<>0
begin
goto FAILED
end

declare @Actions table(ID IDVC, DisplayName DN)

--načtu seznam možných akcí
if @ID is null
begin
--akce nad tabulkou
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_User', 0)[CR_Action]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
--CR_User_ALL: Načíst seznam uživatelů
	([CR_Action].ID = 'CR_User_ALL')

or

--CR_User_NEW: Založit uživatele
	([CR_Action].ID = 'CR_User_NEW')

end else begin
--akce nad záznamem

--ladící volání při generování stránek(taskid#6094)
if @ID=0
begin
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_User', 1)[CR_Action]
end

--vyhodnocení akcí pro zadaný záznam
insert into @Actions
select distinct[CR_Action].ID, [CR_Action].DisplayName
from
[dbo].[CR_Action_ALL_Tab](@ID_Login, @ID_Action, 'CR_User', 1)[CR_Action]
cross join[CR_User]
--left join[dbo].[CR_Permission_ALL_Login](@ID_Login)[CR_Permission] on 1 = 1
where
[CR_User].ID =@ID
and[CR_User].IsActive = 1
and(

	--CR_EntityLog_ALL_User_CR: Načíst historii uživatele
	([CR_Action].ID = 'CR_EntityLog_ALL_User_CR')
		
		or

		--CR_User_DEL: Smazat uživatele
	([CR_Action].ID = 'CR_User_DEL')
		
		or

		--CR_User_DETAIL: Načíst detail uživatele
	([CR_Action].ID = 'CR_User_DETAIL')
		
		or

		--CR_User_DETAIL_UserName: Načíst detail uživatele dle loginu
	([CR_Action].ID = 'CR_User_DETAIL_UserName')
		
		or

		--CR_User_EDIT: Upravit uživatele
	([CR_Action].ID = 'CR_User_EDIT')
		
		or

		--CR_User_Login: Přihlásit uživatele
	([CR_Action].ID = 'CR_User_Login')
		
		or

		--CR_UserPermission_ALL_User: Načíst přehled oprávnění uživatele
	([CR_Action].ID = 'CR_UserPermission_ALL_User')
		
		or

		--CR_UserPermission_DEL_User: Smazat oprávnění uživatele
	([CR_Action].ID = 'CR_UserPermission_DEL_User')
		
		or

		--CR_UserPermission_NEW_User: Založit oprávnění uživatele
	([CR_Action].ID = 'CR_UserPermission_NEW_User')
		
		or

		--CR_UserRole_ALL_User: Načíst přehled rolí uživatele
	([CR_Action].ID = 'CR_UserRole_ALL_User')
		
		or

		--CR_UserRole_DEL_User: Smazat roli uživatele
	([CR_Action].ID = 'CR_UserRole_DEL_User')
		
		or

		--CR_UserRole_NEW_User: Založit roli uživatele
	([CR_Action].ID = 'CR_UserRole_NEW_User')
)
end

if @IsRaiseError=1
begin
if not exists(select * from @Actions where ID =@ID_Action)
begin
set @Message = 'Nemáte oprávnění k akci ' + @ID_Action + ' nad záznamem ID=' + ISNULL(convert(varchar, @ID), 'NULL') + '!'
goto FAILED
end
end else begin
select ID, DisplayName from @Actions order by DisplayName
end

return 0

FAILED:
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_User_ALL')
begin
drop procedure CR_User_ALL
end

GO


/* Načtení seznamu záznamů v tabulce CR_User */
CREATE PROCEDURE CR_User_ALL
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
	--filtry
@DisplayName nvarchar(511) = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_User nastala chyba'
select @Top = 500 where @Top is null

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_User_ALL'
if @Error<>0
goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_User].ID,
	--[CR_User].[IsActive],
	[CR_User].[DisplayName],
	[CR_User].[Email],
	[CR_User].[IsEnabled],
	[CR_User].[Username],
	--[CR_User].[Password],
	--[CR_User].[Salt],
	[CR_User].[ID_Language],
	'Language' = [Language].[DisplayName],
	--[CR_User].[DegreeBefore],
	--[CR_User].[DegreeAfter],
	--[CR_User].[FirstName],
	--[CR_User].[LastName],
	[CR_User].[Mobile],
	[CR_User].[BirthDay],
	--[CR_User].[PasswordRequestTimeout],
	--[CR_User].[PasswordRequest],
	--[CR_User].[DateLastPasswordChange],
	--[CR_User].[IncorrectPasswordCount],
	[CR_User].[Description],
	'Roles' = STUFF((select ', ' + [CR_Role].[DisplayName] from[CR_Role] left join[CR_UserRole] on[CR_UserRole].ID_Role = [CR_Role].[ID] where[CR_UserRole].ID_User = [CR_User].ID and[CR_Role].IsActive = 1 FOR XML PATH('')), 1, 1, '')
from
[CR_User]
inner join[CR_Language] as [Language] on[CR_User].ID_Language = [Language].ID
where
	([CR_User].ID =@ID or @ID is null)
and[CR_User].IsActive = 1
and([CR_User].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)
order by[CR_User].DisplayName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END













GO

if exists(select * from sysobjects where name = 'CR_User_DEL')
begin
drop procedure CR_User_DEL
end

GO


/* Smazání záznamu v tabulce CR_User */
CREATE PROCEDURE CR_User_DEL
@ID_Login GUID,
@ID ID
AS
BEGIN

/* Generated */

begin tran

declare @Error int, @Message Note
set @Message = 'Pri smazání objektu CR_User nastala chyba'

--oprávnení k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_User_DEL'
if @Error<>0
goto FAILED

--zneplatnení záznamu
update[CR_User] set IsActive = 0 where ID =@ID
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END





GO

if exists(select * from sysobjects where name = 'CR_User_DETAIL')
begin
drop procedure CR_User_DETAIL
end

GO




/* Načtení detailních informací o záznamu v tabulce CR_User */
CREATE PROCEDURE CR_User_DETAIL
@ID_Login GUID,
@ID ID
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektu CR_User nastala chyba'

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_User_DETAIL'
if @Error<>0
goto FAILED

--načtu informace o záznamu
select
[CR_User].ID,
	[CR_User].[DisplayName],
	[CR_User].[Email],
	[CR_User].[IsEnabled],
	[CR_User].[Username],
	[CR_User].[Password],
	[CR_User].[Salt],
	[CR_User].[ID_Language],
	'Language' = [Language].[DisplayName],
	[CR_User].[DegreeBefore],
	[CR_User].[DegreeAfter],
	[CR_User].[FirstName],
	[CR_User].[LastName],
	[CR_User].[Mobile],
	[CR_User].[BirthDay],
	[CR_User].[Description]
from
[CR_User]
inner join[CR_Language] as Language on[CR_User].ID_Language = [Language].ID
where[CR_User].IsActive = 1 and[CR_User].ID =@ID

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_User_DETAIL_UserName')
begin
drop procedure CR_User_DETAIL_UserName
end

GO




/* Načtení detailních informací o záznamu v tabulce CR_User */
CREATE PROCEDURE[dbo].[CR_User_DETAIL_UserName]
@ID_Login GUID = null,
@UserName DN
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektu CR_User nastala chyba'

declare @Messages ValidateMessages
insert into @Messages(Property, DisplayName, Args)
select 'Property' = 'Password', 'DisplayName' = 'Neplatné heslo', 'Args' = ''
where not exists
	(
		select
		[CR_User].ID,
		[CR_User].Salt
from
		[CR_User]
where[CR_User].IsActive = 1 
	and[CR_User].IsEnabled = 1
	and[CR_User].Username =@UserName
)

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--načtu informace o záznamu
select
[CR_User].ID,
	[CR_User].Salt
from
[CR_User]
where[CR_User].IsActive = 1
and[CR_User].IsEnabled = 1
and[CR_User].Username =@UserName

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END







GO

if exists(select * from sysobjects where name = 'CR_User_EDIT')
begin
drop procedure CR_User_EDIT
end

GO


/* Editace záznamu v tabulce CR_User */
CREATE PROCEDURE CR_User_EDIT
@ID_Login GUID,
@ID ID,
@Email nvarchar(255),
@ID_Language nvarchar(50),
@DegreeBefore DN = null,
@DegreeAfter DN = null,
@FirstName nvarchar(255),
@LastName nvarchar(255),
@Mobile DN = null,
@BirthDay date = null,
@Description Note = null
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Pri editaci objektu CR_User nastala chyba'

--oprávnení k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_User_EDIT'
if @Error<>0
goto FAILED

--validace dat
declare @Messages ValidateMessages
insert into @Messages
exec CR_User_VALIDATE
@ID_Login=@ID_Login,
@ID_Action='CR_User_EDIT',
	@ID=@ID,
@Email=@Email,
--@IsEnabled=@IsEnabled,
--@Username=@Username,
--@Password=@Password,
--@Salt=@Salt,
--@ID_Entity=@ID_Entity,
@ID_Language=@ID_Language,
@DegreeBefore=@DegreeBefore,
@DegreeAfter=@DegreeAfter,
@FirstName=@FirstName,
@LastName=@LastName,
@Mobile=@Mobile,
@BirthDay=@BirthDay,
--@PasswordRequestTimeout=@PasswordRequestTimeout,
--@PasswordRequest=@PasswordRequest,
--@DateLastPasswordChange=@DateLastPasswordChange,
--@IncorrectPasswordCount=@IncorrectPasswordCount,
@Description=@Description
if @@error<>0
goto FAILED

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--editace záznamu
update[CR_User]
set[Email] =@Email,
--[IsEnabled]=@IsEnabled,
--[Username]=@Username,
--[Password]=@Password,
--[Salt]=@Salt,
--[ID_Entity]=@ID_Entity,
--[ID_Language]=@ID_Language,
[DegreeBefore] =@DegreeBefore,
[DegreeAfter] =@DegreeAfter,
[FirstName] =@FirstName,
[LastName] =@LastName,
[Mobile] =@Mobile,
[BirthDay] =@BirthDay,
--[PasswordRequestTimeout]=@PasswordRequestTimeout,
--[PasswordRequest]=@PasswordRequest,
--[DateLastPasswordChange]=@DateLastPasswordChange,
--[IncorrectPasswordCount]=@IncorrectPasswordCount,
[Description] =@Description
where ID =@ID

if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END






GO

if exists(select * from sysobjects where name = 'CR_User_Login')
begin
drop procedure CR_User_Login
end

GO




/* Založení záznamu v tabulce CR_User */
CREATE PROCEDURE[dbo].[CR_User_Login]
@ID_Login GUID,
@ID int,
@Password DN
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Při založení objektu CR_User nastala chyba'

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID, @ID_Action='CR_User_Login'
if @Error<>0
goto FAILED

----validace dat
declare @Messages ValidateMessages
--insert into @Messages
--exec CR_User_VALIDATE
--	@ID_Login=@ID_Login,
--	@ID_Action='CR_User_NEW',
	--	@ID=@ID,
--	@DisplayName=@DisplayName,
--	@Email=@Email,
--	@Username=@Username,
--	@Password=@Password,
--	@Salt=@Salt
--if @@error<>0
--goto FAILED

insert into @Messages(Property, ResourceName, DisplayName, Args)
select 'Property' = 'Password', 'ResourceName' = 'User_Login_InvalidPassword', 'DisplayName' = 'Neplatné heslo', 'Args' = ''
from CR_User
where ID =@ID AND CR_User.[Password] <> @Password and @Password is not null

if exists(select * from @Messages)
begin
print 'validation'
/* spatne zadane heslo */
if exists(select * from @Messages where ResourceName like 'User_Login_InvalidPassword')
begin
update CR_User
set IncorrectPasswordCount += 1,
	IsEnabled =case when(IncorrectPasswordCount + 1) < [dbo].[CR_Setting_Value]('IncorrectPasswordLimit') then 1 else 0 end
where ID =@ID
if @@error<>0
goto FAILED

if exists(select * from CR_User where ID =@ID and IsEnabled = 0)
begin
--Odeslání e - mailu: Zablokování účtu
exec @Error=CR_Email_NEW_IncorrectPasswordBlock
@ID_Login=@ID_Login,
@ID_Object=@ID,
@ID_EmailType='cr_incorrectpasswordblock'
if @Error<>0
goto FAILED
end
end

set @Message = dbo.FN_GetValidationXml(@Messages)
goto COMMITFAILED
end

--reset pokusu pri uspesnem pokusu
update CR_User set IncorrectPasswordCount = 0 where ID =@ID
if @@error<>0
goto FAILED

declare @IsSuccess bit = 1

--fix pro sluzbu
if (select UserName from CR_User where ID =@ID)='system'
begin
set @IsSuccess=1
end

--priradim uživatele přihlášení
update CR_Login
set ID_User =@ID,
IsSuccess =@IsSuccess
where CR_Login.ID =@ID_Login

if @@error<>0
goto FAILED

--odhlaseni vsech loginu pro daneho uzivatele
--update CR_Login
--set DateLogout = GETDATE()
--from CR_Login
--inner join CR_User on CR_User.ID = CR_Login.ID_User
--where CR_Login.ID_User =@ID
--and CR_Login.[DateLogout] > getdate()
--and CR_Login.[ID] <>@ID_Login
--and CR_User.Username <> 'system'
--if @@error<>0
--goto FAILED

--SignIn data
exec @Error=[dbo].[CR_Login_DETAIL_User] @ID_Login=@ID_Login
if @Error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

COMMITFAILED:
commit tran
raiserror(@Message, 16, 1)
return 1

END









GO

if exists(select * from sysobjects where name = 'CR_User_NEW')
begin
drop procedure CR_User_NEW
end

GO



/* Založení záznamu v tabulce CR_User */
CREATE PROCEDURE[dbo].[CR_User_NEW]
@ID_Login GUID,
@Email DN,
@Username DN = null,
@Password DN,
@Salt DN,
@DegreeBefore DN = null,
@DegreeAfter DN = null,
@FirstName DN,
@LastName DN,
@Mobile DN = null,
@BirthDay date = null,
@IsNetworkAccount bit = 0,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note, @ID_LoggedCompany ID
set @Message = 'Při založení objektu CR_User nastala chyba'

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=null, @ID_Action='CR_User_NEW'
if @Error<>0
goto FAILED

if (@IsNetworkAccount=1)
begin
select @Password=null, @Salt=null
end

--validace dat
declare @Messages ValidateMessages
insert into @Messages
exec CR_User_VALIDATE
@ID_Login=@ID_Login,
@ID_Action='CR_User_NEW',
	@ID=@ID,
@Email=@Email,
@Username=@Username,
@Password=@Password,
@Salt=@Salt,
@DegreeBefore=@DegreeBefore,
@DegreeAfter=@DegreeAfter,
@FirstName=@FirstName,
@LastName=@LastName,
@Mobile=@Mobile,
@BirthDay=@BirthDay,
@IsNetworkAccount=@IsNetworkAccount
if @@error<>0
goto FAILED

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--zaregistruju záznam jako entitu
declare @ID_Entity ID
exec @Error=CR_Entity_NEW @ID_Login=@ID_Login, @ID=@ID_Entity out, @ID_EntityType='cr_user'
if @Error<>0
goto FAILED

--zápis do historie entity
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity,
@ID_EntityLogType='cr_user_new'
if @Error<>0 goto FAILED

--vložení záznamu do tabulky
insert into[CR_User]([Email], [Username], [Password], [Salt], [ID_Entity], [DegreeBefore], [DegreeAfter], [FirstName], [LastName], [Mobile], [BirthDay])
values(@Email, @Username, @Password, @Salt, @ID_Entity, @DegreeBefore, @DegreeAfter, @FirstName, @LastName, @Mobile, @BirthDay)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END






GO

if exists(select * from sysobjects where name = 'CR_User_VALIDATE')
begin
drop procedure CR_User_VALIDATE
end

GO



/* Validace zadaných údajů záznamu v tabulce CR_User */
CREATE PROCEDURE CR_User_VALIDATE
@ID_Login GUID,
@ID_Action IDVC,
@ID ID = null,
@Email DN = null,
@IsEnabled bit = null,
@Username DN = null,
@Password DN = null,
@Salt DN = null,
@ID_Language IDVC = null,
@DegreeBefore DN = null,
@DegreeAfter DN = null,
@FirstName DN = null,
@LastName DN = null,
@Mobile DN = null,
@BirthDay date = null,
@PasswordRequestTimeout datetime = null,
@PasswordRequest uniqueidentifier = null,
@DateLastPasswordChange datetime = null,
@IncorrectPasswordCount int = null,
@IsNetworkAccount bit = null,
@Description Note = null
AS
BEGIN

declare @Messages ValidateMessages

insert into @Messages(Property, DisplayName, Args)

/* Email */
select 'Property' = 'Email', 'DisplayName' = 'Pole "E-mail" musí být zadáno', 'Args' = ''
where isnull(@Email, '')=''
--union

/* IsEnabled */
--select 'Property' = 'IsEnabled', 'DisplayName' = 'Pole "Povolený přístup" musí být zadáno', 'Args' = ''
--where @IsEnabled is null
union

/* Username */
select 'Property' = 'Username', 'DisplayName' = 'Pole "Přihlašovací jméno" musí být zadáno', 'Args' = ''
where @ID is null and isnull(@Username, '')=''
union

/* Password */
select 'Property' = 'Password', 'DisplayName' = 'Pole "Heslo" musí být zadáno', 'Args' = ''
where @ID is null and isnull(@Password, '')='' and IsNull(@IsNetworkAccount, 0)=0
union

/* Salt */
select 'Property' = 'Salt', 'DisplayName' = 'Pole "Sůl hashe" musí být zadáno', 'Args' = ''
where @ID is null and isnull(@Salt, '')='' and IsNull(@IsNetworkAccount, 0)=0
--union

/* ID_Language */
--select 'Property' = 'ID_Language', 'DisplayName' = 'Pole "Jazyk" musí být zadáno', 'Args' = ''
--where @ID_Language is null
--union

/* DegreeBefore */
--select 'Property' = 'DegreeBefore', 'DisplayName' = 'Pole "Titul před" musí být zadáno', 'Args' = ''
--where isnull(@DegreeBefore, '')=''
--union

/* DegreeAfter */
--select 'Property' = 'DegreeAfter', 'DisplayName' = 'Pole "Titul za" musí být zadáno', 'Args' = ''
--where isnull(@DegreeAfter, '')=''
union

/* FirstName */
select 'Property' = 'FirstName', 'DisplayName' = 'Pole "Jméno" musí být zadáno', 'Args' = ''
where isnull(@FirstName, '')=''
union

/* LastName */
select 'Property' = 'LastName', 'DisplayName' = 'Pole "Přijmení" musí být zadáno', 'Args' = ''
where isnull(@LastName, '')=''
--union

/* Mobile */
--select 'Property' = 'Mobile', 'DisplayName' = 'Pole "Mobil" musí být zadáno', 'Args' = ''
--where isnull(@Mobile, '')=''
--union

/* BirthDay */
--select 'Property' = 'BirthDay', 'DisplayName' = 'Pole "Datum narození" musí být zadáno', 'Args' = ''
--where @BirthDay is null
--union

/* PasswordRequestTimeout */
--select 'Property' = 'PasswordRequestTimeout', 'DisplayName' = 'Pole "Platnost kódu pro obnovu hesla" musí být zadáno', 'Args' = ''
--where @PasswordRequestTimeout is null
--union

/* PasswordRequest */
--select 'Property' = 'PasswordRequest', 'DisplayName' = 'Pole "Kód pro obnovu hesla" musí být zadáno', 'Args' = ''
--where @PasswordRequest is null
--union

/* DateLastPasswordChange */
--select 'Property' = 'DateLastPasswordChange', 'DisplayName' = 'Pole "Datum poslední změny hesla" musí být zadáno', 'Args' = ''
--where @DateLastPasswordChange is null
--union

/* IncorrectPasswordCount */
--select 'Property' = 'IncorrectPasswordCount', 'DisplayName' = 'Pole "Počet nesprávných přihlášení" musí být zadáno', 'Args' = ''
--where @IncorrectPasswordCount is null
--union

/* Description */
--select 'Property' = 'Description', 'DisplayName' = 'Pole "Poznámka" musí být zadáno', 'Args' = ''
--where isnull(@Description, '')=''

select * from @Messages

END









GO

if exists(select * from sysobjects where name = 'CR_UserPermission_ALL_User')
begin
drop procedure CR_UserPermission_ALL_User
end

GO




/* Načtení seznamu záznamů v tabulce CR_UserPermission */
CREATE PROCEDURE CR_UserPermission_ALL_User
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@ID_User ID,
	--filtry
@ID_Permission IDVC = null
AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_UserPermission nastala chyba'
select @Top = 500 where @Top is null

--oprávnění k akci
--exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID_User, @ID_Action='CR_UserPermission_ALL_User'
--if @Error<>0
--goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_UserPermission].ID,
	[CR_UserPermission].[ID_User],
	'User' = [User].[DisplayName],
	[CR_UserPermission].[ID_Permission],
	'Permission' = [Permission].[DisplayName]
from
[CR_UserPermission]
inner join[CR_User] as [User] on[CR_UserPermission].ID_User = [User].ID
inner join[CR_Permission] as [Permission] on[CR_UserPermission].ID_Permission = [Permission].ID
where
	([CR_UserPermission].ID =@ID or @ID is null)
and([CR_UserPermission].ID_User =@ID_User or @ID_User is null)
and([CR_UserPermission].ID_Permission =@ID_Permission or @ID_Permission is null)

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_UserPermission_DEL_User')
begin
drop procedure CR_UserPermission_DEL_User
end

GO




/* Smazání záznamu v tabulce CR_UserPermission */
CREATE PROCEDURE CR_UserPermission_DEL_User
@ID_Login GUID,
@ID ID
AS
BEGIN

begin tran

declare @Error int, @Message Note, @ID_User ID
set @Message = 'Při smazání objektu CR_UserPermission nastala chyba'

select @ID_User=[CR_UserPermission].ID_User from[CR_UserPermission] where ID =@ID

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID_User, @ID_Action='CR_UserPermission_DEL_User'
if @Error<>0
goto FAILED

--zalogovani do nadrazene polozky
declare @ID_Entity int, @EntityDescription DN
select @ID_Entity=[CR_User].ID_Entity,
	 @EntityDescription='Smazání oprávnění ''' + [CR_UserPermission].ID_Permission + ''
from[CR_UserPermission]
inner join[CR_User] on[CR_User].ID = [CR_UserPermission].ID_User
where[CR_UserPermission].ID =@ID

--zápis do historie entity 
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity, --cr_role
@ID_EntityLogType='cr_userpermission_del_user',
				@Description=@EntityDescription,
@ID_Object=@ID--cr_rolepermission
if @Error<>0 goto FAILED

--smažu záznam
delete from[CR_UserPermission] where ID =@ID
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_UserPermission_NEW_User')
begin
drop procedure CR_UserPermission_NEW_User
end

GO




/* Založení záznamu v tabulce CR_UserPermission */
CREATE PROCEDURE CR_UserPermission_NEW_User
@ID_Login GUID,
@ID_User ID,
@ID_Permission IDVC,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Při založení objektu CR_UserPermission nastala chyba'

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID_User, @ID_Action='CR_UserPermission_NEW_User'
if @Error<>0
goto FAILED

--validace dat
declare @Messages ValidateMessages
insert into @Messages
exec CR_UserPermission_VALIDATE
@ID_Login=@ID_Login,
@ID_Action='CR_UserPermission_NEW_User',
	@ID=@ID,
@ID_User=@ID_User,
@ID_Permission=@ID_Permission
if @@error<>0
goto FAILED

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--vložení záznamu do tabulky
insert into[CR_UserPermission]([ID_User], [ID_Permission])
values(@ID_User, @ID_Permission)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

--zalogovani do nadrazene polozky
declare @ID_Entity int, @EntityDescription DN = 'Přidáno oprávnění ''' + @ID_Permission
select @ID_Entity=ID_Entity from CR_User where ID =@ID_User
--zápis do historie entity 
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity, --cr_role
@ID_EntityLogType='cr_userpermission_new_user',
				@Description=@EntityDescription,
@ID_Object=@ID--cr_rolepermission
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END










GO

if exists(select * from sysobjects where name = 'CR_UserPermission_VALIDATE')
begin
drop procedure CR_UserPermission_VALIDATE
end

GO




/* Validace zadaných údajů záznamu v tabulce CR_UserPermission */
CREATE PROCEDURE[dbo].[CR_UserPermission_VALIDATE]
@ID_Login GUID,
@ID_Action IDVC,
@ID ID = null,
@ID_User ID = null,
@ID_Permission IDVC = null
AS
BEGIN

declare @Messages ValidateMessages

if (@ID_Action='CR_UserPermission_EDIT_User')
begin
insert into @Messages(Property, DisplayName, ResourceName, Args)

/* ID_User */
select 'Property' = '', 'DisplayName' = 'Pole "Uživatel" musí být zadáno', 'ResourceName' = '', 'Args' = ''
where @ID_User is null
union

/* ID_Permission */
select 'Property' = '', 'DisplayName' = 'Pole "Oprávnění" musí být zadáno', 'ResourceName' = '', 'Args' = ''
where @ID_Permission is null
union

/* ID_Permission */
select 'Property' = '', 'DisplayName' = 'Zadané "Oprávnění" neexistuje', 'ResourceName' = '', 'Args' =@ID_Permission
where not exists(select[CR_Permission].ID from[CR_Permission] where[CR_Permission].ID = @ID_Permission)

end
else
begin
insert into @Messages(Property, DisplayName, ResourceName, Args)

/* ID_User */
select 'Property' = 'ID_User', 'DisplayName' = 'Pole "Uživatel" musí být zadáno', 'ResourceName' = '', 'Args' = ''
where @ID_User is null
union

/* ID_Permission */
select 'Property' = 'ID_Permission', 'DisplayName' = 'Pole "Oprávnění" musí být zadáno', 'ResourceName' = '', 'Args' = ''
where @ID_Permission is null

union

/* ID_Permission */
select 'Property' = 'ID_Permission', 'DisplayName' = 'Uživatel již toto oprávnění má přiřazeno', 'ResourceName' = '', 'Args' = ''
from CR_UserPermission
where CR_UserPermission.ID_Permission =@ID_Permission and CR_UserPermission.ID_User =@ID_User

end

select * from @Messages

END








GO

if exists(select * from sysobjects where name = 'CR_UserRole_ALL_User')
begin
drop procedure CR_UserRole_ALL_User
end

GO




/* Načtení seznamu záznamů v tabulce CR_UserRole */
CREATE PROCEDURE[dbo].[CR_UserRole_ALL_User]
@ID_Login GUID,
@Top int = 500,
@ID ID = null,
@ID_User ID,
	--filtry
@ID_Role ID = null,
@DisplayName nvarchar(511) = null

AS
BEGIN

declare @Error int, @Message Note
set @Message = 'Při načtení objektů CR_UserRole nastala chyba'
select @Top = 500 where @Top is null

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID_User, @ID_Action='CR_UserRole_ALL_User'
if @Error<>0
goto FAILED

--vrátim záznamy podle zadaných filtrů
select top(@Top)
[CR_UserRole].ID,
	[CR_UserRole].[ID_User],
	'User' = [User].[DisplayName],
	[CR_UserRole].[ID_Role],
	'Role' = [Role].[DisplayName]
from
[CR_UserRole]
inner join[CR_User] as [User] on[CR_UserRole].ID_User = [User].ID
inner join[CR_Role] as [Role] on[CR_UserRole].ID_Role = [Role].ID
where
	([CR_UserRole].ID =@ID or @ID is null)
and([CR_UserRole].ID_User =@ID_User or @ID_User is null)
and([CR_UserRole].ID_Role =@ID_Role or @ID_Role is null)
and([Role].DisplayName like '%' +@DisplayName+'%' or @DisplayName is null)

return 0
FAILED:
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_UserRole_DEL_User')
begin
drop procedure CR_UserRole_DEL_User
end

GO




/* Smazání záznamu v tabulce CR_UserRole */
CREATE PROCEDURE[dbo].[CR_UserRole_DEL_User]
@ID_Login GUID,
@ID ID
AS
BEGIN

begin tran

declare @Error int, @Message Note, @ID_User ID
set @Message = 'Při smazání objektu CR_UserRole nastala chyba'

select @ID_User=[CR_UserRole].ID_User from[CR_UserRole] where ID =@ID

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID_User, @ID_Action='CR_UserRole_DEL_User'
if @Error<>0
goto FAILED

--zalogovani do nadrazene polozky
declare @ID_Entity int, @EntityDescription DN
select @ID_Entity=[CR_User].ID_Entity,
	 @EntityDescription='Smazání role ''' + [CR_Role].DisplayName + ''
from[CR_UserRole]
inner join[CR_User] on[CR_User].ID = [CR_UserRole].ID_User
inner join[CR_Role] on[CR_Role].ID = [CR_UserRole].ID_Role
where[CR_UserRole].ID =@ID

--zápis do historie entity 
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity, --cr_role
@ID_EntityLogType='cr_userrole_del_user',
				@Description=@EntityDescription,
@ID_Object=@ID--cr_userrole
if @Error<>0 goto FAILED

--smažu záznam
delete from[CR_UserRole] where ID =@ID
if @@error<>0
goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END








GO

if exists(select * from sysobjects where name = 'CR_UserRole_NEW_User')
begin
drop procedure CR_UserRole_NEW_User
end

GO




/* Založení záznamu v tabulce CR_UserRole */
CREATE PROCEDURE[dbo].[CR_UserRole_NEW_User]
@ID_Login GUID,
@ID_User ID,
@ID_Role ID,
@ID ID = null out
AS
BEGIN

begin tran

declare @Error int, @Message Note
set @Message = 'Při založení objektu CR_UserRole nastala chyba'

--oprávnění k akci
exec @Error=CR_User_ACTION @ID_Login=@ID_Login, @ID=@ID_User, @ID_Action='CR_UserRole_NEW_User'
if @Error<>0
goto FAILED

--validace dat
declare @Messages ValidateMessages
insert into @Messages
exec CR_UserRole_VALIDATE
@ID_Login=@ID_Login,
@ID_Action='CR_UserRole_NEW_User',
	@ID=@ID,
@ID_User=@ID_User,
@ID_Role=@ID_Role
if @@error<>0
goto FAILED

if exists(select * from @Messages)
begin
set @Message = dbo.FN_GetValidationXml(@Messages)
goto FAILED
end

--vložení záznamu do tabulky
insert into[CR_UserRole]([ID_User], [ID_Role])
values(@ID_User, @ID_Role)

if @@error<>0
goto FAILED

set @ID=@@IDENTITY

--zalogovani do nadrazene polozky
declare @ID_Entity int, @EntityDescription DN = 'Přidána role ''' + (select DisplayName from CR_Role where ID =@ID_Role) +''
select @ID_Entity=ID_Entity from CR_User where ID =@ID_User
--zápis do historie entity 
exec @Error=CR_EntityLog_NEW
@ID_Login=@ID_Login,
@ID_Entity=@ID_Entity, --cr_role
@ID_EntityLogType='cr_userrole_new_user',
				@Description=@EntityDescription,
@ID_Object=@ID--cr_userrole
if @Error<>0 goto FAILED

commit tran
return 0

FAILED:
rollback tran
raiserror(@Message, 16, 1)
return 1

END









GO

if exists(select * from sysobjects where name = 'CR_UserRole_VALIDATE')
begin
drop procedure CR_UserRole_VALIDATE
end

GO




/* Validace zadaných údajů záznamu v tabulce CR_UserRole */
CREATE PROCEDURE[dbo].[CR_UserRole_VALIDATE]
@ID_Login GUID,
@ID_Action IDVC,
@ID ID = null,
@ID_User ID = null,
@ID_Role ID = null
AS
BEGIN

declare @Messages ValidateMessages

insert into @Messages(Property, DisplayName, ResourceName, Args)

/* ID_User */
select 'Property' = 'ID_User', 'DisplayName' = 'Pole "Uživatel" musí být zadáno', 'ResourceName' = '', 'Args' = ''
where @ID_User is null
union

/* ID_Role */
select 'Property' = 'ID_Role', 'DisplayName' = 'Pole "Role" musí být zadáno', 'ResourceName' = '', 'Args' = ''
where @ID_Role is null
union

/* ID_Permission */
select 'Property' = 'ID_Role', 'DisplayName' = 'Uživatel již tuto roli má přiřazenu', 'ResourceName' = '', 'Args' = CR_Role.DisplayName
from CR_UserRole
inner join CR_Role on CR_UserRole.ID_Role = CR_Role.ID
where CR_UserRole.ID_Role =@ID_Role and CR_UserRole.ID_User =@ID_User
union

select 'Property' = '', 'DisplayName' = 'Tato role neexistuje', 'ResourceName' = 'UserRole_Validate_Error', 'Args' = ''
from CR_Role
where not exists(select[CR_Role].ID from CR_Role where[CR_Role].ID =@ID_Role)

select * from @Messages

END








GO

print 'CurrentTime: Procedures - ' + convert(varchar, getdate(), 120)

GO

--Create indices

print 'CurrentTime: Indices - ' + convert(varchar, getdate(), 120)

GO

--Check columns

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Action'
and sys.columns.name not in ('ID', 'DisplayName', 'ID_Table', 'ID_TableRelation', 'ID_ActionType', 'RequiredRecord', 'IsAnonymous')

if @Message<>''
begin
set @Message = 'Tabulka CR_Action obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_ActionType'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName')

if @Message<>''
begin
set @Message = 'Tabulka CR_ActionType obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Document'
and sys.columns.name not in ('ID', 'ID_DocumentVersion', 'ID_DocumentState')

if @Message<>''
begin
set @Message = 'Tabulka CR_Document obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_DocumentState'
and sys.columns.name not in ('ID', 'DisplayName', 'IsActive', 'Description')

if @Message<>''
begin
set @Message = 'Tabulka CR_DocumentState obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_DocumentVersion'
and sys.columns.name not in ('ID', 'DisplayName', 'Date', 'ID_Document', 'ID_User', 'Size', 'FileName', 'ContentType', 'Extension', 'Hash', 'Version', 'ImageWidth', 'ImageHeight', 'Storage', 'FileNameExtension')

if @Message<>''
begin
set @Message = 'Tabulka CR_DocumentVersion obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Email'
and sys.columns.name not in ('ID', 'ID_EmailType', 'ID_Object', 'ID_EmailState', 'FromEmail', 'FromName', 'ReplyToEmail', 'ReplyToName', 'Subject', 'Body', 'BlindCopy', 'Date', 'DateSent', 'ErrorMessage')

if @Message<>''
begin
set @Message = 'Tabulka CR_Email obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EmailAddress'
and sys.columns.name not in ('ID', 'ID_Email', 'Email')

if @Message<>''
begin
set @Message = 'Tabulka CR_EmailAddress obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EmailDocument'
and sys.columns.name not in ('ID', 'ID_Email', 'ID_Document')

if @Message<>''
begin
set @Message = 'Tabulka CR_EmailDocument obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EmailState'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName')

if @Message<>''
begin
set @Message = 'Tabulka CR_EmailState obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EmailTemplate'
and sys.columns.name not in ('ID', 'DisplayName', 'ID_EmailType', 'Body', 'Subject')

if @Message<>''
begin
set @Message = 'Tabulka CR_EmailTemplate obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EmailType'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'ID_Table', 'ID_EmailTemplate', 'Procedure')

if @Message<>''
begin
set @Message = 'Tabulka CR_EmailType obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EmailTypeVariable'
and sys.columns.name not in ('ID', 'DisplayName', 'ID_EmailType', 'Variable')

if @Message<>''
begin
set @Message = 'Tabulka CR_EmailTypeVariable obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Entity'
and sys.columns.name not in ('ID', 'ID_EntityType', 'DateInsert', 'ID_UserInsert', 'DateUpdate', 'ID_UserUpdate', 'DateDelete', 'ID_UserDelete')

if @Message<>''
begin
set @Message = 'Tabulka CR_Entity obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EntityLog'
and sys.columns.name not in ('ID', 'ID_Entity', 'ID_User', 'DateTime', 'ID_EntityLogType', 'Description', 'ID_Object', 'Data', 'IsHidden')

if @Message<>''
begin
set @Message = 'Tabulka CR_EntityLog obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EntityLogType'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'ID_EntityType', 'Note')

if @Message<>''
begin
set @Message = 'Tabulka CR_EntityLogType obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_EntityType'
and sys.columns.name not in ('ID', 'ID_Table', 'DisplayName', 'ID_ActionLogAll')

if @Message<>''
begin
set @Message = 'Tabulka CR_EntityType obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Language'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName')

if @Message<>''
begin
set @Message = 'Tabulka CR_Language obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Log'
and sys.columns.name not in ('ID', 'ID_User', 'ID_LogSeverity', 'ID_LogType', 'DisplayName', 'Date', 'Url', 'IP', 'Browser', 'Description', 'IsProcessed')

if @Message<>''
begin
set @Message = 'Tabulka CR_Log obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Login'
and sys.columns.name not in ('ID', 'ID_User', 'IP', 'Browser', 'Date', 'DateLogout', 'IsSuccess')

if @Message<>''
begin
set @Message = 'Tabulka CR_Login obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_LogSeverity'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName')

if @Message<>''
begin
set @Message = 'Tabulka CR_LogSeverity obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_LogType'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName')

if @Message<>''
begin
set @Message = 'Tabulka CR_LogType obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Module'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'ShortName', 'Description')

if @Message<>''
begin
set @Message = 'Tabulka CR_Module obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Operation'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'Operator')

if @Message<>''
begin
set @Message = 'Tabulka CR_Operation obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_PageState'
and sys.columns.name not in ('ID', 'PageUrl', 'ID_User', 'DisplayName', 'DateCreate', 'IsDefault')

if @Message<>''
begin
set @Message = 'Tabulka CR_PageState obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_PageStateItem'
and sys.columns.name not in ('ID', 'ID_PageState', 'ControlID', 'Key', 'Value')

if @Message<>''
begin
set @Message = 'Tabulka CR_PageStateItem obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Permission'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'Description', 'ID_PermissionGroup')

if @Message<>''
begin
set @Message = 'Tabulka CR_Permission obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_PermissionGroup'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'Description')

if @Message<>''
begin
set @Message = 'Tabulka CR_PermissionGroup obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Role'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'Key', 'IsDefault', 'ID_Entity')

if @Message<>''
begin
set @Message = 'Tabulka CR_Role obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_RolePermission'
and sys.columns.name not in ('ID', 'ID_Role', 'ID_Permission')

if @Message<>''
begin
set @Message = 'Tabulka CR_RolePermission obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Setting'
and sys.columns.name not in ('ID', 'DisplayName', 'Description', 'Value')

if @Message<>''
begin
set @Message = 'Tabulka CR_Setting obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_Table'
and sys.columns.name not in ('ID', 'IsActive', 'DisplayName', 'ID_TableParent', 'IsActionParent', 'ID_Module')

if @Message<>''
begin
set @Message = 'Tabulka CR_Table obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_User'
and sys.columns.name not in ('ID', 'IsActive', 'Email', 'IsEnabled', 'Username', 'Password', 'Salt', 'ID_Entity', 'ID_Language', 'DegreeBefore', 'DegreeAfter', 'FirstName', 'LastName', 'Mobile', 'BirthDay', 'PasswordRequestTimeout', 'PasswordRequest', 'DateLastPasswordChange', 'IncorrectPasswordCount', 'Description', 'DisplayName')

if @Message<>''
begin
set @Message = 'Tabulka CR_User obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_UserPermission'
and sys.columns.name not in ('ID', 'ID_User', 'ID_Permission')

if @Message<>''
begin
set @Message = 'Tabulka CR_UserPermission obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

declare @Message nvarchar(500) = ''
select @Message = @Message + sys.columns.name + ', '
from
sys.columns
inner join sys.tables on sys.tables.object_id = sys.columns.object_id
where
sys.tables.name = 'CR_UserRole'
and sys.columns.name not in ('ID', 'ID_User', 'ID_Role')

if @Message<>''
begin
set @Message = 'Tabulka CR_UserRole obsahuje navíc sloupce: ' + substring(@Message, 1, len(@Message) -1)
raiserror(@Message, 16, 1)
end

GO

print 'CurrentTime: CheckColumns - ' + convert(varchar, getdate(), 120)

GO

`
    }

}
