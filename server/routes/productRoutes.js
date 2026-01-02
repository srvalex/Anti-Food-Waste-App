const Produs = require('../modules/Produs');
const serviciiProdus = require('../services/produs.service');
const serviciiUser = require('../services/user.service');
const router = require('express').Router();

router.route('/produse')
    .get(async (req, res) => {
        let { id, nume, categorie, dataExpirare, idUtilizator, optiuneExpirare } = req.query;
        if (id) {
            let prod = await serviciiProdus.findProductByPK(id);
            if (!prod)
                return res.status(400).json({ "Eroare": "Produs inexistent" });
            return res.status(200).json(prod);
        }
        let produse = await serviciiProdus.findAllProducts({ nume, categorie, dataExpirare, idUtilizator, optiuneExpirare });
        return res.status(200).json(produse);
    })
    .post(async (req, res) => {
        let { nume, categorie, dataExpirare, idUtilizator } = req.body;
        if (!(nume && categorie && dataExpirare && idUtilizator))
            res.status(400).json({ "Eroare": "Malformed Body" })

        let user = await serviciiUser.findUserByID(idUtilizator);
        if (user) {
            let prod = await serviciiProdus.insertNewProduct({ nume, categorie, dataExpirare, idUtilizator });
            return res.status(200).json(prod);
        }
        else
            return res.status(400).json({ "Eroare": "Utilizatorul nu exista!" });
    });

router.route("/produse/:id")
    .put(async (req, res) => {
        let nrTupluri = await serviciiProdus.updateProduct(req.params.id, req.body);
        console.log("NUMAR RANDURI ACTUALIZATE UPDATE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "Produs inexistent" })
        return res.status(200).json({ "Mesaj": "Actualizare cu succes!" });
    })

    .delete(async (req, res) => {
        let nrTupluri = await serviciiProdus.deleteProduct(req.params.id);
        console.log("NUMAR RANDURI ACTUALIZATE DELETE: " + nrTupluri);
        if (nrTupluri === 0)
            return res.status(404).json({ "Eroare": "Produsul nu a fost gasit" });
        return res.status(200).json({ "Mesaj": "Produsul a fost sters cu succes" });
    })

module.exports = router 