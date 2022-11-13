const router = require('express').Router();
const verify = require('./verifyJWT');

router.get('/', verify, (request, response) => {
    response.json({"status" : "success", "user" : request.user});
});

module.exports = router;