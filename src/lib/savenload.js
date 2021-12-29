import { createWorld, defineSerializer, defineDeserializer } from "bitecs";

// packet would come from a database somewhere...
let packet;

export const save = (world) => {
  const serialize = defineSerializer(world);
  packet = serialize(world);
};

export const load = () => {
  let newWorld = createWorld();
  const deserialize = defineDeserializer(newWorld);
  deserialize(newWorld, packet);
  return newWorld;
};

// const newEntity = addEntity(newWorld);

// console.log({ packet, dsNewWorld, newWorld, newEntity });
// put packet in local storage

// // INDEXED DB
// const customerData = [
//   { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
//   { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
// ];

// const dbName = "the_name";

// var request = indexedDB.open(dbName, 2);

// request.onerror = function (event) {
//   // Handle errors.
// };
// request.onupgradeneeded = function (event) {
//   var db = event.target.result;

//   // Create an objectStore to hold information about our customers. We're
//   // going to use "ssn" as our key path because it's guaranteed to be
//   // unique - or at least that's what I was told during the kickoff meeting.
//   var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

//   // Create an index to search customers by name. We may have duplicates
//   // so we can't use a unique index.
//   objectStore.createIndex("name", "name", { unique: false });

//   // Create an index to search customers by email. We want to ensure that
//   // no two customers have the same email, so use a unique index.
//   objectStore.createIndex("email", "email", { unique: true });

//   // Use transaction oncomplete to make sure the objectStore creation is
//   // finished before adding data into it.
//   objectStore.transaction.oncomplete = function (event) {
//     // Store values in the newly created objectStore.
//     var customerObjectStore = db
//       .transaction("customers", "readwrite")
//       .objectStore("customers");
//     customerData.forEach(function (customer) {
//       customerObjectStore.add(customer);
//     });
//   };
// };
