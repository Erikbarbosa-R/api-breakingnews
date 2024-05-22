const express = require('express');
const userRoute = require("./src/routes/user.route")
const app = express();

const port = 4000;
app.use(express.json());
app.use("/user", userRoute);

app.listen(port, () => console.log(`Servidor rodando na porta ${port} `));



