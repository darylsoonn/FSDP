-- Connect to the master database to create the login
USE master;
GO

-- Create a login for the user
CREATE LOGIN fsdp_User WITH PASSWORD = 'FSDP';
GO

-- Grant the sysadmin role to the login (TOBECHANGEDWHENIFIGUREOUTWHATSPECIFICROLESTOGIVELMFAO)
ALTER SERVER ROLE sysadmin ADD MEMBER fsdp_User;
GO