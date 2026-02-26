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
  const snapshot = await getDocs(collection(db, "accounts"));

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    table.innerHTML += `
      <tr>
        <td>${docSnap.id}</td>
        <td>${data.username}</td>
        <td>$${data.balance.toFixed(2)}</td>
      </tr>
    `;
  });
}

loadAccounts();

// ============================
// PHASE 1 - Basic Transfer
// ============================

window.basicTransfer = async function () {
  const sender = document.getElementById("sender1").value;
  const receiver = document.getElementById("receiver1").value;
  const amount = parseFloat(document.getElementById("amount1").value);

  await runTransaction(db, async (transaction) => {
    const senderRef = doc(db, "accounts", sender);
    const receiverRef = doc(db, "accounts", receiver);

    const senderSnap = await transaction.get(senderRef);
    const receiverSnap = await transaction.get(receiverRef);

    transaction.update(senderRef, {
      balance: senderSnap.data().balance - amount
    });

    transaction.update(receiverRef, {
      balance: receiverSnap.data().balance + amount
    });

    await addDoc(collection(db, "transactionLogs"), {
      senderID: sender,
      receiverID: receiver,
      amount: amount,
      timestamp: serverTimestamp()
    });
  });

  alert("Transfer successful!");
  location.reload();
};

// ============================
// PHASE 2 - With Balance Check
// ============================

window.advancedTransfer = async function () {
  const sender = document.getElementById("sender2").value;
  const receiver = document.getElementById("receiver2").value;
  const amount = parseFloat(document.getElementById("amount2").value);

  await runTransaction(db, async (transaction) => {
    const senderRef = doc(db, "accounts", sender);
    const receiverRef = doc(db, "accounts", receiver);

    const senderSnap = await transaction.get(senderRef);

    if (senderSnap.data().balance < amount) {
      throw "Insufficient funds";
    }

    transaction.update(senderRef, {
      balance: senderSnap.data().balance - amount
    });

    transaction.update(receiverRef, {
      balance: (await transaction.get(receiverRef)).data().balance + amount
    });

    await addDoc(collection(db, "transactionLogs"), {
      senderID: sender,
      receiverID: receiver,
      amount: amount,
      timestamp: serverTimestamp()
    });
  });

  alert("Transfer successful!");
  location.reload();
};

// ============================
// PHASE 3 - With Bonus
// ============================

window.bonusTransfer = async function () {
  const sender = document.getElementById("sender3").value;
  const receiver = document.getElementById("receiver3").value;
  const amount = parseFloat(document.getElementById("amount3").value);

  await runTransaction(db, async (transaction) => {
    const senderRef = doc(db, "accounts", sender);
    const receiverRef = doc(db, "accounts", receiver);

    const senderSnap = await transaction.get(senderRef);

    if (senderSnap.data().balance < amount) {
      throw "Insufficient funds";
    }

    transaction.update(senderRef, {
      balance: senderSnap.data().balance - amount
    });

    transaction.update(receiverRef, {
      balance: (await transaction.get(receiverRef)).data().balance + amount
    });

    await addDoc(collection(db, "transactionLogs"), {
      senderID: sender,
      receiverID: receiver,
      amount: amount,
      timestamp: serverTimestamp()
    });

    // Bonus check
    const today = new Date();
    today.setHours(0,0,0,0);

    const q = query(
      collection(db, "transactionLogs"),
      where("senderID", "==", sender)
    );

    const logs = await getDocs(q);

    if (logs.size >= 5) {
      transaction.update(senderRef, {
        balance: senderSnap.data().balance - amount + 1
      });
      alert("Bonus awarded!");
    }
  });

  alert("Transfer successful!");
  location.reload();
};