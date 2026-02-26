import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Same Firebase config as app.js
const firebaseConfig = {
  apiKey: "AIzaSyATGDinwBxUwZO8gkhmtzvoxTDAmFn1-hI",
  authDomain: "my-sample-cc95a.firebaseapp.com",
  projectId: "my-sample-cc95a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadLogs() {
  const table = document.getElementById("logsTable");

  const q = query(
    collection(db, "TransactionLogs"),
    orderBy("Timestamp", "asc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    table.innerHTML += `
      <tr>
        <td colspan="5">No transactions found</td>
      </tr>
    `;
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const sender = data.senderID ?? data.SenderID ?? "N/A";
    const receiver = data.receiverID ?? data.ReceiverID ?? "N/A";

    const date = data.timestamp?.toDate();
    const formattedDate = date ? date.toLocaleString() : "N/A";

    table.innerHTML += `
        <tr>
        <td>${docSnap.id}</td>
        <td>${sender}</td>
        <td>${receiver}</td>
        <td>$${(data.amount ?? 0).toFixed(2)}</td>
        <td>${formattedDate}</td>
        </tr>
    `;
    });
}

loadLogs();
