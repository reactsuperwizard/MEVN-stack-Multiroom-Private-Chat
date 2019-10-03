const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = (function () {
    const Message = db.sequelize.define(
        'message',
        {
            content: {
                type: Sequelize.STRING,
                required: true
            },
            room: {
                type: Sequelize.INTEGER,
                required: true
            },
            user: {
                type: Sequelize.INTEGER,
                required: true
            },
            admin: {
                type: Sequelize.BOOLEAN,
            }
        },
        {
            timestamps: {
                createdAt: 'created_at'
            }
        },
        {

        }
    );
    return Message;
})();