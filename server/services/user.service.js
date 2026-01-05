const { User, Produs, Prietenie } = require("../modules");
const { Op } = require("sequelize");


async function findUserByID(userID) {
    return await User.findByPk(userID)
}


async function findAllUsers(filtre) {
    const { id, username, email, sort, order } = filtre;
    const optiuniQuery = {}
    const where = {}
    if (username)
        where.username = { username }

    if (email)
        where.email = { email }

    if (Object.keys(where).length > 0)
        optiuniQuery.where = where;

    if (sort)
        optiuniQuery.order = [[sort, order === "desc" ? "DESC" : "ASC"]]

    return await User.findAll(optiuniQuery);
}

async function AddNewUser(body) {
    let user = await User.create(body)
    return user;
}


async function updateUser(id, body) {
    let campuriUser = [
        "username",
        "email"
    ];
    let campuriUpdate = {};
    for (let camp of campuriUser) {
        if (body[camp] !== undefined)
            campuriUpdate[camp] = body[camp];
    }
    const [tupluri] = await User.update(
        campuriUpdate,
        {
            where: { id }
        }
    );
    return tupluri;
}


async function deleteUser(id) {
    return await User.destroy({
        where: { id }
    });
}

async function getMultipleUserPlusProdus() {
    return await User.findAll({
        attributes: ["id", "username"],
        include: [
            {
                model: Produs,
                attributes: ["nume", "categorie", "dataExpirare"],
                required: true
            }
        ]
    })
}

async function getSingleUserPlusProdus(id) {
    return await User.findAll({
        attributes: ["id", "username"],
        where: { id },
        include: [{
            model: Produs,
            required: false
        }]
    })
}





module.exports = { findUserByID, findAllUsers, AddNewUser, updateUser, deleteUser, getMultipleUserPlusProdus, getSingleUserPlusProdus }


