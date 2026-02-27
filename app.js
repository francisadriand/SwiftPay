import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  runTransaction,
  addDoc,
  serverTimestamp,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyATGDinwBxUwZO8gkhmtzvoxTDAmFn1-hI",
  authDomain: "my-sample-cc95a.firebaseapp.com",
  projectId: "my-sample-cc95a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================
// Load Accounts Table
// ============================

async function loadAccounts() {
  const table = document.getElementById("accountsTable");

  // Clear table except header
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Username</th>
      <th>Balance</th>
    </tr>
  `;

  try
  {
    const snapshot = await getDocs(collection(db, "Accounts"));

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const id = docSnap.id; // THIS is the correct ID

      table.innerHTML += `
        <tr>
          <td>${id}</td>
          <td>${data.Username || "No Name"}</td>
          <td>$${(data.Balance ?? 0).toFixed(2)}</td>
        </tr>
      `;
    });
    console.log("Snapshot size:", snapshot.size);
  }
  catch (error)
  {
    console.error("Error loading accounts:", error);
    alert("Failed to load accounts. Please check console for details.");
  }
}

console.log("Loading accounts...");
loadAccounts();

// ============================
// PHASE 1 - Basic Transfer
// ============================

window.basicTransfer = async function () {
  try
  {
    const sender = document.getElementById("sender1").value;
    const receiver = document.getElementById("receiver1").value;
    const amount = parseFloat(document.getElementById("amount1").value);

    await runTransaction(db, async (transaction) => {
      const senderRef = doc(db, "Accounts", sender);
      const receiverRef = doc(db, "Accounts", receiver);
      const counterRef = doc(db, "Counters", "transactionCounter");

      const senderSnap = await transaction.get(senderRef);
      const receiverSnap = await transaction.get(receiverRef);
      const counterSnap = await transaction.get(counterRef);

      const newLogID = counterSnap.data().current + 1;

      transaction.update(senderRef, {
        Balance: senderSnap.data().Balance - amount
      });

      transaction.update(receiverRef, {
        Balance: receiverSnap.data().Balance + amount
      });

      transaction.update(counterRef, {
        current: newLogID
      });

      const newLogRef = doc(db, "TransactionLogs", newLogID.toString());

      transaction.set(newLogRef, {
        LogID: newLogID,
        SenderID: sender,
        ReceiverID: receiver,
        Amount: amount,
        Timestamp: serverTimestamp()
      });
    });

    alert("Transfer successful!");
    location.reload();
  }
  catch (error)
  {
    console.error("Transfer failed:", error);
    alert("Transfer failed: " + error);
  }
};

// ============================
// PHASE 2 - With Balance Check
// ============================

window.advancedTransfer = async function () {
  const sender = document.getElementById("sender2").value;
  const receiver = document.getElementById("receiver2").value;
  const amount = parseFloat(document.getElementById("amount2").value);

  await runTransaction(db, async (transaction) => {
    try 
    {
      const senderRef = doc(db, "Accounts", sender);
      const receiverRef = doc(db, "Accounts", receiver);
      const counterRef = doc(db, "Counters", "transactionCounter");

      const senderSnap = await transaction.get(senderRef);
      const receiverSnap = await transaction.get(receiverRef);
      const counterSnap = await transaction.get(counterRef);

      if (senderSnap.data().Balance < amount) {
        throw "Insufficient funds";
      }

      transaction.update(senderRef, 
      {
        Balance: senderSnap.data().Balance - amount
      });

      transaction.update(receiverRef, 
      {
        Balance: receiverSnap.data().Balance + amount
      });

      const newLogID = counterSnap.data().current + 1;

      transaction.update(counterRef, 
      {
        current: newLogID
      }
      );

      const newLogRef = doc(db, "TransactionLogs", newLogID.toString());
      transaction.set(newLogRef, 
      {
        LogID: newLogID,
        SenderID: sender,
        ReceiverID: receiver,
        Amount: amount,
        Timestamp: serverTimestamp()
      }
      );
    }
    catch (error)
    {
      console.error("Transfer failed: ", error);
      throw error; // Rethrow to ensure transaction rolls back
    }
  });

  alert("Transfer successful!");
  location.reload();
};

// ============================
// PHASE 3 - With Bonus
// ============================

window.bonusTransfer = async function () {
  await runTransaction(db, async (transaction) => {
    const sender = document.getElementById("sender3").value;
    const receiver = document.getElementById("receiver3").value;
    const amount = parseFloat(document.getElementById("amount3").value);

    try
    {
      const senderRef = doc(db, "Accounts", sender);
      const receiverRef = doc(db, "Accounts", receiver);
      const counterRef = doc(db, "Counters", "transactionCounter");

      const senderSnap = await transaction.get(senderRef);
      const receiverSnap = await transaction.get(receiverRef);
      const counterSnap = await transaction.get(counterRef);

      if (senderSnap.data().Balance < amount) {
        throw "Insufficient funds";
      }

      transaction.update(senderRef, {
        Balance: senderSnap.data().Balance - amount
      });

      transaction.update(receiverRef, {
        Balance: receiverSnap.data().Balance + amount
      });

      const newLogID = counterSnap.data().current + 1;

      transaction.update(counterRef, {
        current: newLogID
      });

      const newLogRef = doc(db, "TransactionLogs", newLogID.toString());
      transaction.set(newLogRef, {
        LogID: newLogID,
        SenderID: sender,
        ReceiverID: receiver,
        Amount: amount,
        Timestamp: serverTimestamp()
      });

      // Bonus check, selects the rows from TransactionLogs where SenderID is the same as the sender and Timestamp is today, if there are 5 or more transactions, give a bonus of $1
      const today = new Date();
      today.setHours(0,0,0,0);

      const q = query
      (
        collection(db, "TransactionLogs"),
        where("SenderID", "==", sender),
        where("Timestamp", ">=", today)
      )

      const logs = await getDocs(q);

      if (logs.size >= 5) 
      {
        transaction.update(senderRef, 
        {
          Balance: senderSnap.data().Balance + 1
        });
        alert("Bonus awarded!");
      }
    }
    catch (error)
    {
      console.error("Transfer failed: ", error);
      throw error; // Rethrow to ensure transaction rolls back
    }
  });

  alert("Transfer successful!");
  location.reload();

};