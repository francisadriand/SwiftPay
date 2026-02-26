CREATE TABLE IF NOT EXISTS accounts 
(
    AccountID INT AUTO_INCREMENT,
    Username VARCHAR(255) NOT NULL,
    Balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    PRIMARY KEY (AccountID)
);

INSERT INTO accounts (Username, Balance) VALUES ('Alice_Crypto', 1500.00), ('Bob_Budget', 50.00), ('Charlie_Saver', 12000.5), ('Diana_Default', 0), ('Evan_Payday', 450.75);

CREATE TABLE IF NOT EXISTS transactionLogs 
(
    LogID INT AUTO_INCREMENT, 
    SenderID INT NOT NULL,
    ReceiverID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (LogID),
    FOREIGN KEY (SenderID) REFERENCES accounts(AccountID),
    FOREIGN KEY (ReceiverID) REFERENCES accounts(AccountID)
);

INSERT INTO transactionLogs(SenderID, ReceiverID, Amount, Timestamp) VALUES (1, 2, 20.00, '2024-05-01 10:30:00'), (3, 1, 500.00, '2024-05-01 11:15:00'), (5, 2, 10.5, '2024-05-02 09:00:00'), (1, 5, 100.00, '2024-05-02 14:20:00'), (3, 4, 250.00, '2024-05-03 16:45:00');

DELIMITER //
CREATE PROCEDURE ProcessTransfer(IN senderID INT, IN receiverID INT, IN transferAmount DECIMAL(10, 2))
BEGIN
    UPDATE Accounts SET Balance = Balance - transferAmount WHERE AccountID = senderID;
    UPDATE Accounts SET Balance = Balance + transferAmount WHERE AccountID = receiverID;
    INSERT INTO transactionLogs (SenderID, ReceiverID, Amount) VALUES (senderID, receiverID, transferAmount);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ProcessTransferCheck(IN senderID INT, IN receiverID INT, IN transferAmount DECIMAL(10, 2), OUT result VARCHAR(255))
BEGIN
    DECLARE senderBalance DECIMAL(10, 2);
    SELECT Balance INTO senderBalance FROM Accounts WHERE AccountID = senderID:

    IF senderBalance < transferAmount THEN
        SET result = 'Insufficient funds';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient funds';
    END IF;

    UPDATE Accounts SET Balance = Balance - transferAmount WHERE AccountID = senderID:
    UPDATE Accounts SET Balance = Balance + transferAmount WHERE AccountID = receiverID;
    INSERT INTO transactionLogs (SenderID, ReceiverID, Amount) VALUES (senderID, receiverID, transferAmount);
    SET result = 'Transfer successful';
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ProcessTransferWithBonus(IN senderID INT, IN receiverID INT, IN transferAmount DECIMAL(10, 2), OUT result VARCHAR(255))
BEGIN
    DECLARE senderBalance DECIMAL(10, 2);
    SELECT Balance INTO senderBalance FROM Accounts WHERE AccountID = senderID;

    IF senderBalance < transferAmount THEN
        SET result = 'Insufficient funds';
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient funds';
    END IF;

    UPDATE Accounts SET Balance = Balance - transferAmount WHERE AccountID = senderID:
    UPDATE Accounts SET Balance = Balance + transferAmount WHERE AccountID = receiverID;

    INSERT INTO transactionLogs (SenderID, ReceiverID, Amount) VALUES (senderID, receiverID, transferAmount);

    DECLARE count INT;
    SELECT COUNT(*) INTO count FROM transactionLogs WHERE DATE(Timestamp) = CURDATE();

    IF count > 5 THEN
        UPDATE Accounts SET Balance = Balance + 1 WHERE AccountID = senderID;
        SET result = 'Transfer successful with bonus';
    ELSE
        SET result = 'Transfer successful';
    END IF;
END //
DELIMITER ;