const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
require("dotenv").config();

app.use(express.json());
app.use('/api/user', authRoute);
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send();
    }
    next();
});

app.listen(process.env.PORT);

module.exports = app;