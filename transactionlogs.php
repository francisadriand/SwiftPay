<?php
session_start();
include 'config.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Logs Test</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <a href="index.php">SwiftPay</a>
        <a href="transactionlogs.php">Transaction Logs</a>
    </header>
    <div class="main-container">
        <h1>Transaction Logs</h1>
        <table>
            <th>
                <tr>
                    <th class="table-headers">Transaction ID</th>
                    <th class="table-headers">Sender ID</th>
                    <th class="table-headers">Reciever ID</th>
                    <th class="table-headers">Amount</th>
                    <th class="table-headers">Timestamp</th>
                </tr>
                <?php
                $sql = "SELECT * FROM transactionLogs ORDER BY LogID ASC";
                $result = $conn->query($sql);
                if ($result->num_rows > 0)
                {
                    while($row = $result->fetch_assoc())
                    {
                        echo "<tr><td>" . $row["LogID"] . "</td><td>" . $row["SenderID"] . "</td><td>" . $row["ReceiverID"] . "</td><td>$" . number_format($row["Amount"], 2) . "</td><td>" . $row["Timestamp"] . "</td></tr>";
                    }
                }
                else
                {
                    echo "<tr><td colspan='5'>No transactions found</td></tr>";
                }
                ?>
            </th>
        </table>
    </div>
</body>
</html>