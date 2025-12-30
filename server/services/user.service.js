const User = require("../modules/User");
const { Op } = require("sequelize");


async function findUserByID(userID) {
    return User.findByPk(userID)
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

module.exports = { findUserByID, findAllUsers, AddNewUser }


