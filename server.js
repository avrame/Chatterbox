if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

console.log('process.env.MONGODB_PASSWORD', process.env.MONGODB_PASSWORD)

const mongo_uri = `mongodb+srv://avrame:${process.env.MONGODB_PASSWORD}@chatterbox-abw5o.mongodb.net/test?retryWrites=true&w=majority`;

app.get('/api/messages', function (req, res) {
  const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
  client.connect(connectError => {
    if (connectError) {
      res.sendStatus(500);
    } else {
      const db = client.db("chatterbox");
      const collection = db.collection("messages");
      collection.find({}).toArray(function(findError, messages) {
        if (findError) {
          console.error(findError);
          res.sendStatus(500);
        } else {
          res.json({ messages });
        }
      });
    }
    client.close();
  });
});

app.post('/api/message', function (req, res) {
  if (req.body && req.body.message) {
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client.connect(connectError => {
      const db = client.db("chatterbox");
      const collection = db.collection("messages");
      collection.insertOne({ text: req.body.message }, (insertError, result) => {
        if (insertError) {
          console.log(insertError);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
        client.close();
      });
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));