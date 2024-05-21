const express = require('express');
const app = express();

app.get('/soma', function (req, res) {
  const soma = 100 + 5;

  res.send({soma: soma})
});

app.listen(3000);