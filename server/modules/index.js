const User = require("./User");
const Produs = require("./Produs");
const Prietenie = require("./Prietenie");


User.hasMany(Produs,
    {
        foreignKey: "idUtilizator"
    }
);
Produs.belongsTo(User, {
    foreignKey: "idUtilizator"
})


User.hasMany(Prietenie,
    {
        foreignKey: "idSender",
        as: "trimiteCererePrietenie",
        onDelete: "CASCADE"
    }
);


Prietenie.belongsTo(User, {
    foreignKey: "idSender",
    as: "trimitere"
});


User.hasMany(Prietenie, {
    foreignKey: "idReciever",
    as: "primesteCererePrietenie",
    onDelete: "CASCADE"
})

Prietenie.belongsTo(User, {
    foreignKey: "idReciever",
    as: "primire"
});

module.exports = {
    User,
    Produs,
    Prietenie
};
