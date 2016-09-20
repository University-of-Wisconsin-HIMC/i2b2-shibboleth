SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
------------------------------------------------
-- Author:              Wanta, Keith
-- Create date:         10/26/2015
-- Description:         Create NETID (Shibboleth ID) in authorized user table
--                      [PM_USER_DATA]
------------------------------------------------
-- User w/o aggregate counts next to concepts:
------------------------------------------------
--exec [I2B2_PM].[dbo].[i2b2_netid_user] 
--	@netid = 'kwanta',
--	@fullname = 'Keith Wanta'
------------------------------------------
ALTER PROCEDURE [dbo].[i2b2_netid_user]
	@netid nvarchar(4000),
	@fullname nvarchar(4000)
	
AS
BEGIN
	SET NOCOUNT ON;

	declare @currentdate datetime;
	select @currentdate = getdate();

	IF NOT EXISTS (SELECT * FROM [PM_USER_DATA] WHERE [USER_ID] = @netid)
	BEGIN

		INSERT INTO [HIMC_I2B2_PM_WISC-PROD].[dbo].[PM_USER_DATA]
		([USER_ID],[FULL_NAME],[STATUS_CD], [ENTRY_DATE],[CHANGE_DATE],[CHANGEBY_CHAR])
		VALUES
		(@netid,@fullname,'A',getdate(),getdate(),CURRENT_USER);

		/****** Script for SelectTopNRows command from SSMS  ******/
		INSERT INTO [HIMC_I2B2_PM_WISC-PROD].[dbo].[PM_PROJECT_USER_ROLES]
		(
		[PROJECT_ID],[USER_ID],[USER_ROLE_CD],[STATUS_CD]
		)
		VALUES
		(
		'Demo',@netid,'DATA_AGG','A'
		);

		INSERT INTO [HIMC_I2B2_PM_WISC-PROD].[dbo].[PM_PROJECT_USER_ROLES]
		(
		[PROJECT_ID],[USER_ID],[USER_ROLE_CD],[STATUS_CD]
		)
		VALUES
		(
		'Demo',@netid,'DATA_OBFSC','A'
		);

		INSERT INTO [HIMC_I2B2_PM_WISC-PROD].[dbo].[PM_PROJECT_USER_ROLES]
		(
		[PROJECT_ID],[USER_ID],[USER_ROLE_CD],[STATUS_CD]
		)
		VALUES
		(
		'Demo',@netid,'USER','A'
		);

	END -- END INSERTS
	
END