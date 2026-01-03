const express = require('express');
const app = express();
const sequelize = require('./db');
const { User, Produs, Prietenie, Claim } = require('./modules');
const { Op } = require("sequelize");
const rutaUser = require("./routes/userRoutes");
const rutaProdus = require("./routes/productRoutes");
const rutaPrietenie = require("./routes/friendshipRoutes");
const rutaClaim = require("./routes/claimRoutes");
const cors = require("cors");

app.use(express.json());
app.use("/", rutaUser);
app.use("/", rutaProdus);
app.use("/", rutaPrietenie);
app.use("/", rutaClaim);
app.use(cors());


sequelize.sync({ alter: true }).then(() => {
    app.listen(8000, () => {
        console.log("Listening on port 8000");
        console.log("Database synchronized");
    });
}).catch(err => {
    console.error("Error syncing database:", err);
});

