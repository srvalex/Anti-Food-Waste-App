const serviciiUser = require("../services/user.service");


const router = require('express').Router();

router.route("/users")
    .get(async (req, res) => {
        const { id, username, email, sort, order } = req.query;

        if (id) {
            let user = await serviciiUser.findUserByID(id);
            if (!user)
                return res.status(400).json({ "eroare": "Nu exista acest user" })
            return res.status(200).json(user);
        }

        let foundUsers = await serviciiUser.findAllUsers({ username, email, sort, order });
        return res.status(200).json(foundUsers);
    })
    .post(async (req, res) => {
        if (req.body && req.body.username && req.body.email) {
            let user = serviciiUser.AddNewUser(req.body)
            return res.status(200).json(user)
        }
        else {
            return res.status(400).json({ "mesaj": "Bad request" })
        }
    })


module.exports = router;