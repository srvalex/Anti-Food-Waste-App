<<<<<<< HEAD
const User = require("./User");
const Produs = require("./Produs");
const Prietenie = require("./Prietenie");
const Claim = require("./Claim");


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

User.hasMany(Claim, {
    foreignKey: "idClaimer",
    as: "claims",
    onDelete: "CASCADE"
});

Claim.belongsTo(User, {
    foreignKey: "idClaimer",
    as: "claimer"
});

Produs.hasMany(Claim, {
    foreignKey: "idProdus",
    as: "claims",
    onDelete: "CASCADE"
});

Claim.belongsTo(Produs, {
    foreignKey: "idProdus",
    as: "produs"
});

module.exports = {
    User,
    Produs,
    Prietenie,
    Claim
};
=======
const User = require("./User");
const Produs = require("./Produs");
const Prietenie = require("./Prietenie");
const Claim = require("./Claim");


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

User.hasMany(Claim, {
    foreignKey: "idClaimer",
    as: "claims",
    onDelete: "CASCADE"
});

Claim.belongsTo(User, {
    foreignKey: "idClaimer",
    as: "claimer"
});

Produs.hasMany(Claim, {
    foreignKey: "idProdus",
    as: "claims",
    onDelete: "CASCADE"
});

Claim.belongsTo(Produs, {
    foreignKey: "idProdus",
    as: "produs"
});

module.exports = {
    User,
    Produs,
    Prietenie,
    Claim
};
>>>>>>> 6b61af4d43ff0d8c5b7f900fab60c3eec489504e
