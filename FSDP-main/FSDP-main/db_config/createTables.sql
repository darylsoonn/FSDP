USE FSDP;

CREATE TABLE Account (
    AccountId VARCHAR(9) NOT NULL,
    AccountName VARCHAR(50) NOT NULL,
    AccountPassword VARCHAR(50) NOT NULL,
    CreationDate DATE NOT NULL,

    CONSTRAINT PK_Account PRIMARY KEY (AccountId)
);

CREATE TABLE Announcement (
    AnnouncementId VARCHAR(9) NOT NULL,
    Title VARCHAR(50) NOT NULL,
    DescriptionDetails VARCHAR(100) NOT NULL,
    CreationDate DATE NOT NULL,

    CONSTRAINT PK_Announcement PRIMARY KEY (AnnouncementId)
);

CREATE TABLE ChatbotData (
    DataId VARCHAR(9) NOT NULL,
    CategoryDesc VARCHAR(50) NOT NULL,

    CONSTRAINT PK_ChatbotData PRIMARY KEY (DataId)
);

CREATE TABLE Question (
    QuestionId VARCHAR(9) NOT NULL,
    CategoryId VARCHAR(9) NOT NULL,
    QuestionTitle VARCHAR(100) NOT NULL,
    QuestionAnswer VARCHAR(300) NOT NULL,

    CONSTRAINT PK_Question PRIMARY KEY (QuestionId), 
    CONSTRAINT FK_Question_Category FOREIGN KEY (CategoryId) REFERENCES ChatbotData(DataId)
);

CREATE TABLE ScamCall (
    ScamCallId VARCHAR(9) NOT NULL,
    PhoneNumber VARCHAR(50) NOT NULL,
    reportDateTime DATETIME  NOT NULL
);

CREATE TABLE ScamReports (
    id INT IDENTITY(1,1) PRIMARY KEY, -- Use IDENTITY for auto-increment
    scam_type VARCHAR(255) NOT NULL,
    description TEXT,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    timestamp DATETIME DEFAULT GETDATE() -- Use GETDATE() for the current timestamp
);