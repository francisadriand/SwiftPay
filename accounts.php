<?php
session_start();
include 'config.php';

if (isset($_POST['transfer']))
{
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];
    $amount = $_POST['amount'];

    try 
    {
        $sql1 = "UPDATE accounts SET Balance = Balance - $amount WHERE AccountID = $sender";
        $sql2 = "UPDATE accounts SET Balance = Balance + $amount WHERE AccountID = $receiver";
        $sql3 = "INSERT INTO transactionLogs (SenderID, ReceiverID, Amount) VALUES ($sender, $receiver, $amount)";
        if ($conn->query($sql1) === TRUE && $conn->query($sql2) === TRUE && $conn->query($sql3) === TRUE)
        {
            echo "<script>alert('Transfer successful!');</script>";
        }
        else
        {
            echo "<script>alert('Transfer failed: " . $conn->error . "');</script>";
        }
    }
    catch (Exception $e)
    {
        echo "<script>alert('An error occurred: " . $e->getMessage() . "');</script>";
    }
}

if (isset($_POST['transferTwo']))
{
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];
    $amount = $_POST['amount'];

    try
    {
        $sql = "SELECT Balance FROM accounts WHERE AccountID = $sender";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            if ($row["Balance"] < $amount)
            {
                echo "<script>alert('Insufficient funds for transfer.');</script>";
                return;
            }
        }
        else
        {
            echo "<script>alert('Sender account not found.');</script>";
            return;
        }

        $sql1 = "UPDATE accounts SET Balance = Balance - $amount WHERE AccountID = $sender";
        $sql2 = "UPDATE accounts SET Balance = Balance + $amount WHERE AccountID = $receiver";
        $sql3 = "INSERT INTO transactionLogs (SenderID, ReceiverID, Amount) VALUES ($sender, $receiver, $amount)";
        if ($conn->query($sql1) === TRUE && $conn->query($sql2) === TRUE && $conn->query($sql3) === TRUE)
        {
            echo "<script>alert('Transfer successful!');</script>";
        }
        else
        {
            echo "<script>alert('Transfer failed: " . $conn->error . "');</script>";
        }
    }
    catch (Exception $e)
    {
        echo "<script>alert('An error occurred: " . $e->getMessage() . "');</script>";
    }
}

if (isset($_POST['transferThree']))
{
    $sender = $_POST['sender'];
    $receiver = $_POST['receiver'];
    $amount = $_POST['amount'];
    try
    {
        $sql = "SELECT Balance FROM accounts WHERE AccountID = $sender";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0)
        {
            $row = $result->fetch_assoc();
            if ($row["Balance"] < $amount)
            {
                echo "<script>alert('Insufficient funds for transfer.');</script>";
                return;
            }
        }
        else
        {
            echo "<script>alert('Sender account not found.');</script>";
            return;
        }

        $sql1 = "UPDATE accounts SET Balance = Balance - $amount WHERE AccountID = $sender";
        $sql2 = "UPDATE accounts SET Balance = Balance + $amount WHERE AccountID = $receiver";
        $sql3 = "INSERT INTO transactionLogs (SenderID, ReceiverID, Amount) VALUES ($sender, $receiver, $amount)";
        if ($conn->query($sql1) === TRUE && $conn->query($sql2) === TRUE && $conn->query($sql3) === TRUE)
        {
            echo "<script>alert('Transfer successful!');</script>";
        }
        else
        {
            echo "<script>alert('Transfer failed: " . $conn->error . "');</script>";
        }

        $sqlcheck = "SELECT Timestamp FROM transactionLogs WHERE DATE(Timestamp) = CURDATE() AND SenderID = $sender";
        $resultcheck = $conn->query($sqlcheck);
        if ($resultcheck->num_rows >= 5)
        {
            $bonus = 1.00;
            $sqlbonus = "UPDATE accounts SET Balance = Balance + $bonus WHERE AccountID = $sender";
            if ($conn->query($sqlbonus) === TRUE)
            {
                echo "<script>alert('Bonus awarded for 5 or more transfers today!');</script>";
            }
            else
            {
                echo "<script>alert('Bonus failed: " . $conn->error . "');</script>";
            }
        }
    }
    catch (Exception $e)
    {
        echo "<script>alert('An error occurred: " . $e->getMessage() . "');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SwiftPay Test</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <a href="index.php">SwiftPay</a>
        <a href="transactionlogs.php">Transaction Logs</a>
    </header>
    <div class="main-container">
        <h1>SwiftPay Accounts</h1>
        <table>
            <tr>
                <th class="table-headers">Account Number</th>
                <th class="table-headers">Account Name</th>
                <th class="table-headers">Balance</th>
            </tr>
            <?php
            $sql = "SELECT * FROM accounts";
            $result = $conn->query($sql);
            if ($result->num_rows > 0)
            {
                while($row = $result->fetch_assoc())
                {
                    echo "<tr><td>" . $row["AccountID"] . "</td><td>" . $row["Username"] . "</td><td>$" . number_format($row["Balance"], 2) . "</td></tr>";
                }
            }
            else
            {
                echo "<tr><td colspan='3'>No accounts found</td></tr>";
            }
            ?>
        </table>

        <div class="phases">
            <div class="phaseTables">
                <form action="index.php" method="POST">
                    <h2>Basic Transfer (Phase 1)</h2>
                    <label for="sender">Sender: </label>
                    <input type="text" placeholder="Enter account number" id="sender" name="sender" required><br><br>
                    <label for="receiver">Receiver: </label>
                    <input type="text" placeholder="Enter account number" id="receiver" name="receiver" required><br><br>
                    <label for="amount">Amount: </label>
                    <input type="number" placeholder="Enter amount" id="amount" name="amount" step="0.01" required><br><br>
                    <button type="submit" name="transfer">Transfer</button>
                </form>
            </div>

            <div class="phaseTables">
                <form action="index.php" method="POST">
                    <h2>Advanced Transfer (Phase 2)</h2>
                    <label for="sender">Sender: </label>
                    <input type="text" placeholder="Enter account number" id="sender" name="sender" required><br><br>
                    <label for="receiver">Receiver: </label>
                    <input type="text" placeholder="Enter account number" id="receiver" name="receiver" required><br><br>
                    <label for="amount">Amount: </label>
                    <input type="number" placeholder="Enter amount" id="amount" name="amount" step="0.01" required><br><br>
                    <button type="submit" name="transferTwo">Transfer</button>
                </form>
            </div>

            <div class="phaseTables">
                <form action="index.php" method="POST">
                    <h2>Transfer With Bonus (Phase 3)</h2>
                    <label for="sender">Sender: </label>
                    <input type="text" placeholder="Enter account number" id="sender" name="sender" required><br><br>
                    <label for="receiver">Receiver: </label>
                    <input type="text" placeholder="Enter account number" id="receiver" name="receiver" required><br><br>
                    <label for="amount">Amount: </label>
                    <input type="number" placeholder="Enter amount" id="amount" name="amount" step="0.01" required><br><br>
                    <button type="submit" name="transferThree">Transfer</button>
                </form>
            </div>
        </div>
    </div>

    <footer>
        <p>&copy; 2024 SwiftPay. All rights reserved.</p>
    </footer>
</body>
</html>