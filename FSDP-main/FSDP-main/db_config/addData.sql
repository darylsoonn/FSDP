USE FSDP;

-- Insert data into Account table

-- Insert data into Announcement table
INSERT INTO Announcement (AnnouncementId, Title, DescriptionDetails, CreationDate)
VALUES 
('ANN000001', 'Maintenance scheduled on Friday, 12th Oct.', 'The website will be down for maintenance, please call or visit our nearest branch for support', '2024-11-10'),
('ANN000002', 'New update available for OCBC mobile app.', 'Please update the OCBC app to the latest version', '2024-11-10'),
('ANN000003', 'Holiday banking hours announced.', 'Banking services will now be open from 2pm to 4am on weekdays and 9am to 12pm on weekends', '2024-11-10');

-- Insert data into ChatbotData table
INSERT INTO ChatbotData (DataId, CategoryDesc)
VALUES 
('CHA000001', 'Security');

-- Insert data into Question table
INSERT INTO Question (QuestionId, CategoryId, QuestionTitle, QuestionAnswer)
VALUES
('QUE000001', 'CHA000001', 'How can I reset my password', 'Go into the login page of the OCBC website...');

-- Insert data into ScamCall table
INSERT INTO ScamCall (PhoneNumber, ReportCount)
VALUES
('8775-2004', 1),
('9004-6890', 2),
('7923-4432', 1),
('8200-2004', 1);
