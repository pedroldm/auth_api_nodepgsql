const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
require("dotenv").config();

app.use(express.json());
app.use('/api/user', authRoute);

app.listen(process.env.PORT, () => console.log('Servidor Online!'));