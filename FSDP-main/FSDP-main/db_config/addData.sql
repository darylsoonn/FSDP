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

INSERT INTO ScamReports (scam_type, description, latitude, longitude)
VALUES
('Phishing Call', 'Fraudulent call requesting personal details', 1.3521, 103.8198), -- Singapore
('Fraudulent SMS', 'SMS pretending to be from a bank', 40.7128, -74.0060), -- New York
('Phishing Call', 'Caller pretending to be government agency', 34.0522, -118.2437); -- Los Angeles
('Phishing Call', 'Fake caller requesting OTP for unauthorized transactions', 1.3000, 103.8000), -- Singapore
('Fraudulent SMS', 'SMS with fake links pretending to be delivery service', 37.7749, -122.4194), -- San Francisco
('Impersonation Scam', 'Scammer impersonating government officials', 51.5074, -0.1278), -- London
('Phishing Email', 'Email pretending to be from a bank', 48.8566, 2.3522), -- Paris
('Online Scam', 'Fake online shop selling counterfeit items', 35.6895, 139.6917), -- Tokyo
('Investment Scam', 'Fraudulent promise of high returns on fake investments', 40.730610, -73.935242), -- New York City
('Tech Support Scam', 'Caller claiming to fix computer issues for a fee', 28.613939, 77.209023), -- New Delhi
('Phishing Call', 'Caller asking for banking credentials', 1.3600, 103.8100),
('Fraudulent SMS', 'Fake message pretending to be a delivery service', 1.3001, 103.8210),
('Investment Scam', 'Promising unrealistic returns on investment', 40.7150, -74.0020),
('Phishing Email', 'Email requesting sensitive information', 40.7200, -74.0050),
('Tech Support Scam', 'Caller pretending to be IT support', 34.0500, -118.2500),
('Online Scam', 'Website claiming to sell event tickets', 34.0550, -118.2400),
('Impersonation Scam', 'Scammer impersonating local officials', 37.7800, -122.4200),
('Phishing Call', 'Fake call pretending to be from a tech company', 37.7750, -122.4170),
('Fraudulent SMS', 'Suspicious message about fake lottery', 51.5080, -0.1280),
('Phishing Email', 'Email asking to reset account password', 51.5100, -0.1250),
('Online Scam', 'Fake e-commerce website', 48.8550, 2.3500),
('Investment Scam', 'Ponzi scheme promising high returns', 48.8600, 2.3525),
('Phishing Call', 'Scammer claiming to be from the government', 35.6900, 139.7000),
('Fraudulent SMS', 'Message pretending to be a utility company', 35.6850, 139.7050),
('Tech Support Scam', 'Scammer claiming to fix a virus issue', 28.6150, 77.2100),
('Investment Scam', 'Fake investment opportunity in real estate', 28.6120, 77.2080),
('Online Scam', 'Website selling counterfeit electronics', 52.5200, 13.4050), -- Berlin
('Phishing Email', 'Email pretending to be from social media platform', 41.9028, 12.4964), -- Rome
('Impersonation Scam', 'Scammer impersonating law enforcement', 55.7558, 37.6173), -- Moscow
('Fraudulent SMS', 'SMS claiming unauthorized transaction', 39.9042, 116.4074); -- Beijing