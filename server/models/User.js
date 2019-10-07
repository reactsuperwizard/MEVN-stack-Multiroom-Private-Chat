const Sequelize = require("sequelize")
const db = require("../database/db")
const bcrypt = require('bcryptjs')

// module.exports = db.sequelize.define(
module.exports = (function () {
    const User = db.sequelize.define(
        'user_info', {
            // id: {
            //     type: Sequelize.INTEGER,
            //     primaryKey: true,
            //     autoIncrement: true
            // },
            username: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            handle: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false
            },
            socketid: {
                type: Sequelize.STRING
            },
            create_time: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            delete_time: {
                type: Sequelize.DATE
            },
            image: {
                type: Sequelize.STRING
            },
            age: {
                type: Sequelize.INTEGER
            },
            sex: {
                type: Sequelize.STRING
            },
            location: {
                type: Sequelize.STRING
            },
            bio: {
                type: Sequelize.STRING
            },
            status_active: {
                type: Sequelize.TINYINT
            },
            status_participate: {
                type: Sequelize.TINYINT
            },
            room_id: {
                type: Sequelize.INTEGER,
                default: -1
            }
        }, {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        }, {}
    );
    User.prototype.isValidPassword = function (password) {
        return bcrypt.compare(password, this.password);
    }
    return User;
})();