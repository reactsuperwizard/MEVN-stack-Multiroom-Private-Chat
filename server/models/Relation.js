const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = (function () {
    const Relation = db.sequelize.define(
        'relation', {
            user: {
                type: Sequelize.INTEGER,
                required: true
            },
            touser: {
                type: Sequelize.INTEGER,
                required: true
            },
            status: {
                type: Sequelize.INTEGER
            }
        }, {
            timestamps: false
        }
    );
    return Relation;
})();