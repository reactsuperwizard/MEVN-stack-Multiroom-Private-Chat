const Sequelize = require("sequelize")
const db = require("../database/db")
const bcrypt = require('bcryptjs')
const fs = require('fs');
/**URLs */
const chatStorageUrl = '../chat_storage/';
const roomAvatarUrl = chatStorageUrl + 'room_avatar/';

module.exports = (function () {
    const Room = db.sequelize.define(
        'room', {
            name: {
                type: Sequelize.STRING,
                required: true,
                trim: true,
                unique: true,
                len: [3, 20]
            },
            user: {
                type: Sequelize.INTEGER,
                default: null
            },
            avatar: {
                type: Sequelize.INTEGER,
                required: true
            },
            password: {
                type: Sequelize.STRING,
                default: ''
            },
            access: {
                type: Sequelize.BOOLEAN,
                default: true
            },
            users: {
                type: Sequelize.INTEGER
            },
            lastAcTime: {
                type: Sequelize.TIME
            },
        }, {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }, {}
    );
    Room.associate = function (models) {
        Room.hasMany(models.User);
    }
    Room.prototype.isValidPassword = function (password) {
        return bcrypt.compare(password, this.password);
    }
    return Room;
})();