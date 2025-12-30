const express = require('express');
const app = express();
const sequelize = require('./db');
const { User, Produs, Prietenie } = require('./modules');
const { Op } = require("sequelize");
const rutaUser = require("./routes/userRoutes");


app.use(express.json());

app.use("/", rutaUser);


app.post("/produse", async (req, res) => {
    let userId = req.body.idUtilizator;
    if (userId) {
        let user = await User.findByPk(userId)
        if (!user)
            return res.status(400).json({ "mesaj": "Userul nu exista. Userul trebuie sa existe ca sa ii adaugati alimente" })
    }

    if (req.body.nume && req.body.categorie && req.body.dataExpirare) {
        let user = await Produs.create(req.body);
        return res.status(200).json(user)
    }
    else {
        return res.status(400).json({ "mesaj": "Bad request" })
    }
})

app.get("/produse", async (req, res) => {
    let produse = await Produs.findAll();
    if (produse.length !== 0) {
        produse.forEach(produs => console.log(produs.toJSON()));
        return res.status(200).json(produse);
    }
    else
        return res.status(400).json({ 'mesaj': "nu exista nimic in baza de date" });
})



sequelize.sync({ alter: true }).then(() => {
    app.listen(8000, () => {
        console.log("Listening on port 8000");
        console.log("Database synchronized");
    });
}).catch(err => {
    console.error("Error syncing database:", err);
});

