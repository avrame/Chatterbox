const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, 'build')));

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.get('/api/ping', function (req, res) {
 return res.json({
   foo: 'baz'
 });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));