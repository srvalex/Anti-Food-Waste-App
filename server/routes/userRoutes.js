const User = require('../modules/User');
const { operatiiBD } = require('sequelize');
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


router.route("/users/:id")
    .put(async (req, res) => {
        let nrTupluri = await serviciiUser.updateUser(req.params.id, req.body);
        console.log("NUMAR RANDURI ACTUALIZATE UPDATE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "User inexistent" })
        return res.status(200).json({ "Mesaj": "Actualizare cu succes!" });
    })

    .delete(async (req, res) => {
        let nrTupluri = await serviciiUser.deleteUser(req.params.id);
        console.log("NUMAR RANDURI ACTUALIZATE DELETE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "User-ul nu a fost gasit" });
        return res.status(200).json({ "Mesaj": "User-ul a fost sters cu succes" });
    })


module.exports = router;