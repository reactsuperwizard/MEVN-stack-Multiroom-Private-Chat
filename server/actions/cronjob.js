const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
    DELETE_ROOM_BY_PARAM
} = require('./socketio');
const Room = require('../models/Room');

module.exports = {
    DELETE_STICKY_ROOM: async () => {
        const curr = new Date();
        const rooms = await Room.findAll({
            where: {
                lastAcTime: {
                    [Op.ne]: null
                }
            }
        }, {
            raw: true
        })
        rooms.forEach(room => {
            const befr = new Date(room.lastAcTime);
            if (curr.getTime() - befr.getTime() > 60 * 60 * 1000) {
                DELETE_ROOM_BY_PARAM(room);
            }
        })
    }
};