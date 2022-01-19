
const indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB || webkitIndexedDB;

let db;

const request = indexedDB.open("budget_db", 1);

request.onsuccess = ({target}) => {
    db = target.result;
    console.log(db);
    if (navigator.onLine) {
        bigDB ();
    }
};

request.onupgradeneeded = ({target}) => {
    let db = target.result;
    db.createObjectStore("Pending", {
        autoIncrement: true
    });
};

request.onerror = (event) => {
    console.log("Whoopsie" + event.target.errorCode);
}

function makeRecord (record) {
    const transaction = db.transaction([ "Pending" ], "readwrite");
    const store = transaction.objectStore("Pending");
    store.add(record);
};

function bigDB () {
    const transaction = db.transaction([ "Pending" ], "readwrite");
    const store = transaction.objectStore("Pending");

    const getAll = store.getAll();
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", 
                    "Content-Type": "application/json"
                }
            }).then(response => {
                return response.json();
            }).then(() => {
                const transaction = db.transaction([ "Pending" ], "readwrite");
                const store = transaction.objectStore("Pending");

                store.clear();
            })
        }
    }
};

window.addEventListener("online", bigDB);