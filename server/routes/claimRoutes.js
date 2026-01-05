const { Claim } = require('../modules');
const serviciiClaim = require('../services/claim.service');
const serviciiUser = require('../services/user.service');
const serviciiProdus = require('../services/produs.service');
const router = require('express').Router();

router.route('/claims')
    .get(async (req, res) => {
        let { id, idProdus, idClaimer, statusClaim, sort, order } = req.query;

        if (id) {
            let claim = await serviciiClaim.findClaimByPK(id);
            if (!claim)
                return res.status(404).json({ "Eroare": "Claim inexistent" });
            return res.status(200).json(claim);
        }

        let claims = await serviciiClaim.findAllClaims({ idProdus, idClaimer, statusClaim, sort, order });
        return res.status(200).json(claims);
    })
    .post(async (req, res) => {
        let { idProdus, idClaimer, mesaj } = req.body;

        if (!(idProdus))
            return res.status(400).json({ "Eroare": "Malformed Body - idProdus este obligatoriu" });

        let produs = await serviciiProdus.findProductByPK(idProdus);
        if (!produs)
            return res.status(404).json({ "Eroare": "Produsul nu exista!" });

        if (!produs.isAvailable)
            return res.status(400).json({ "Eroare": "Produsul nu este disponibil pentru claim" });

        if (idClaimer !== undefined) {
            let claimer = await serviciiUser.findUserByID(idClaimer);
            if (!claimer)
                return res.status(404).json({ "Eroare": "Utilizatorul claimer nu exista!" });

            if (produs.idUtilizator === parseInt(idClaimer))
                return res.status(400).json({ "Eroare": "Nu poti face claim pe propriul produs!" });
        }
        let claim = await serviciiClaim.insertNewClaim({
            idProdus,
            idClaimer,
            mesaj: mesaj || null,
            statusClaim: "In asteptare"
        });
        return res.status(201).json(claim);
    });

router.route("/claims/:id")
    .put(async (req, res) => {
        let nrTupluri = await serviciiClaim.updateClaim(req.params.id, req.body);
        console.log("NUMAR RANDURI ACTUALIZATE UPDATE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "Claim inexistent" });
        return res.status(200).json({ "Mesaj": "Actualizare cu succes!" });
    })
    .delete(async (req, res) => {
        let nrTupluri = await serviciiClaim.deleteClaim(req.params.id);
        console.log("NUMAR RANDURI ACTUALIZATE DELETE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "Claim-ul nu a fost gasit" });
        return res.status(200).json({ "Mesaj": "Claim-ul a fost sters cu succes" });
    });

router.route("/claims/owner/:ownerId")
    .get(async (req, res) => {
        let claims = await serviciiClaim.getClaimsByProductOwner(req.params.ownerId);
        return res.status(200).json(claims);
    });

module.exports = router;
