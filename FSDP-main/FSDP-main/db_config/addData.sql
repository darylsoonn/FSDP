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
('CHA000001', 'Security'),
('CHA000002', 'Scams'),
('CHA000003', 'Cards');

-- Insert data into Question table
INSERT INTO Question (QuestionId, CategoryId, QuestionTitle, QuestionAnswer)
VALUES
('QUE000001', 'CHA000001', 'How can I reset my password?', 'Go into the login page of the OCBC website...'),
('QUE000002', 'CHA000002', 'How do I know if the caller is from OCBC?', 'Our operators will only direct you to search for the official website...'),
('QUE000003', 'CHA000003', 'How do I get my first debit card?', 'Visit our nearest bank branch...');

-- Insert data into ScamCall table
INSERT INTO ScamCall (ScamCallId,PhoneNumber, reportDateTime)
VALUES
('SCA000001', '7265-3030', '2024-11-10 08:22:15'),
('SCA000002', '8200-2004', '2024-11-10 09:35:10'),
('SCA000003', '8200-2004', '2024-11-11 12:10:45'),  -- Same number, different time
('SCA000004', '8443-1100', '2024-11-12 15:50:30'),
('SCA000005', '8443-1100', '2024-11-13 16:05:20'),  -- Same number, different time
('SCA000006', '8775-2004', '2024-11-14 18:30:25'),
('SCA000007', '8775-2004', '2024-11-14 19:45:05'),  -- Same number, different time
('SCA000008', '8775-2004', '2024-11-15 08:15:55'),
('SCA000009', '8934-5566', '2024-11-16 10:20:40'),
('SCA000010', '9004-6890', '2024-11-17 13:30:15'),
('SCA000011', '9004-6890', '2024-11-17 14:45:50'),  -- Same number, different time
('SCA000012', '9305-2121', '2024-11-18 08:55:10'),
('SCA000013', '9305-2121', '2024-11-18 10:05:00'),  -- Same number, different time
('SCA000014', '9305-2121', '2024-11-19 11:35:40'),  -- Same number, different time
('SCA000015', '9305-2121', '2024-11-20 14:10:20'),
('SCA000016', '8200-2004', '2024-11-21 17:20:00');
