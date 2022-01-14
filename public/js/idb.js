
const indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB || webkitIndexedDB;

let db;
const request = indexedDB.open("budget_db", 1);
request.onsuccess = ({target}) => {
    db = target.result;
    console.log(db);
    if (navigator.onLine) {
        checkDatabase();
    }
};


function newRecord(record) {
  const transaction = db.transaction(["new_budget"], "readwrite");
  const store = transaction.objectStore("new_budget");

  store.add(record);
}

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  
  if (navigator.onLine) {
    checkDB();
  }
};
request.onerror = function (event) {
    console.log("Uh oh " + event.target.errorCode);
};
  
function checkDB() {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const store = transaction.objectStore("new_budget");
    const getAll = store.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(() => {
            const transaction = db.transaction(["new_budget"], "readwrite");
            const store = transaction.objectStore("new_budget");
            store.clear();
          });
      }
    };
}

function deleteLoading() {
    const transaction = db.transaction(["new_budget"], "readwrite");
    const store = transaction.objectStore("new_budget");
    store.clear();
}
  
window.addEventListener("online", checkDB); 