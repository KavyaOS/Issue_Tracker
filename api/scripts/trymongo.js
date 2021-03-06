/* eslint linebreak-style: ["error","windows"] */
/* eslint no-restricted-globals: "off" */

const { MongoClient } = require('mongodb');
require('dotenv').config();
// const url = 'mongodb://localhost/issuetracker';
const url = process.env.DB_URL || 'mongodb+srv://Kavya:15is@D95@cluster0.0fcld.mongodb.net/issuetracker?retryWrites=true&w=majority';

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB URL', url);
    const db = client.db();
    const collection = db.collection('employees');
    const employee = { id: 2, name: 'B. Async', age: 16 };
    const result = await collection.insertOne(employee);
    console.log('Result of insert:\n', result.insertedId);
    const docs = await collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

function testWithCallbacks(callback) {
  console.log('\n---------testWithCallbacks-----------');
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect((connErr) => {
    if (connErr) {
      callback(connErr);
      return;
    }
    console.log('Connected to MongoDB URL', url);

    const db = client.db();
    const collection = db.collection('employees');

    const employee = { id: 1, name: 'A.Callback', age: 23 };
    collection.insertOne(employee, (insertErr, result) => {
      if (insertErr) {
        client.close();
        callback(insertErr);
        return;
      }
      console.log('Result of the insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId })
        .toArray((err, docs) => {
          if (err) {
            client.close();
            callback(err);
            return;
          }
          console.log('Result of find:\n', docs);
          client.close();
          callback(err);
        });
    });
  });
}

testWithCallbacks((err) => {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
