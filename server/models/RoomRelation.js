const Sequelize = require("sequelize")
const db = require("../database/db")

module.exports = (function () {
    const RoomRelation = db.sequelize.define(
        'room_relation', {
            room: {
                type: Sequelize.INTEGER,
                required: true
            },
            user: {
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
    return RoomRelation;
})();