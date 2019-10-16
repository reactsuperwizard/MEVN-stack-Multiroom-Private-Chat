const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = (function () {
    const PrivateMessage = db.sequelize.define(
        'privatemessage', {
            content: {
                type: Sequelize.STRING,
                required: true
            },
            user: {
                type: Sequelize.INTEGER,
                required: true
            },
            touser: {
                type: Sequelize.INTEGER,
                required: true
            },
            admin: {
                type: Sequelize.BOOLEAN,
            }
        }, {
            timestamps: {
                createdAt: 'created_at'
            }
        }, {

        }
    );
    return PrivateMessage;
})();