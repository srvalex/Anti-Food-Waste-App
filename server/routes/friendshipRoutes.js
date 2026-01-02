const { Prietenie } = require('../modules');
const serviciiPrietenie = require('../services/prietenie.service');
const serviciiUser = require('../services/user.service');
const router = require('express').Router();

router.route('/prietenii')
    .get(async (req, res) => {
        let { id, idSender, idReciever, statusCerere, tag, sort, order } = req.query;
        if (id) {
            let prietenie = await serviciiPrietenie.findFriendshipByPK(id);
            if (!prietenie)
                return res.status(400).json({ "Eroare": "Prietenie inexistenta" });
            return res.status(200).json(prietenie);
        }
        let prietenii = await serviciiPrietenie.findAllFriendships({ idSender, idReciever, statusCerere, tag, sort, order });
        return res.status(200).json(prietenii);
    })
    .post(async (req, res) => {
        let { idSender, idReciever, statusCerere, tag } = req.body;
        if (!(idSender && idReciever && statusCerere))
            return res.status(400).json({ "Eroare": "Malformed Body" });

        let sender = await serviciiUser.findUserByID(idSender);
        let reciever = await serviciiUser.findUserByID(idReciever);

        if (!sender)
            return res.status(400).json({ "Eroare": "Sender-ul nu exista!" });
        if (!reciever)
            return res.status(400).json({ "Eroare": "Reciever-ul nu exista!" });

        let prietenie = await serviciiPrietenie.insertNewFriendship({ idSender, idReciever, statusCerere, tag });
        return res.status(200).json(prietenie);
    });

router.route("/prietenii/:id")
    .put(async (req, res) => {
        let nrTupluri = await serviciiPrietenie.updateFriendship(req.params.id, req.body);
        console.log("NUMAR RANDURI ACTUALIZATE UPDATE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "Prietenie inexistenta" })
        return res.status(200).json({ "Mesaj": "Actualizare cu succes!" });
    })

    .delete(async (req, res) => {
        let nrTupluri = await serviciiPrietenie.deleteFriendship(req.params.id);
        console.log("NUMAR RANDURI ACTUALIZATE DELETE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "Prietenia nu a fost gasita" });
        return res.status(200).json({ "Mesaj": "Prietenia a fost stearsa cu succes" });
    })

router.route("/prietenii/all")
    .get(async (req, res) => {
        let prietenii = await serviciiPrietenie.getAllFriendshipsWithUsers();
        return res.status(200).json(prietenii);
    })

module.exports = router;
