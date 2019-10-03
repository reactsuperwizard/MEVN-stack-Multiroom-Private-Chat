const Sequelize = require("sequelize")
const db = require("../database/db")
const bcrypt = require('bcryptjs')

module.exports = (function () {
    const Room = db.sequelize.define(
        'room',
        {
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
            password: {
                type: Sequelize.STRING,
                default: ''
            },
            access: {
                type: Sequelize.BOOLEAN,
                default: true
            },
            accessIds: {
                type: Sequelize.STRING,
                default: []
            },
            users: {
                type: Sequelize.INTEGER
            }
        },
        {
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at'
            }
        },
        {

        }
    );
    Room.associate = function (models) {
        Room.hasMany(models.User);
    }
    Room.prototype.isValidPassword = function (password) {
        return bcrypt.compare(password, this.password);
    }
    return Room;
})();
// const RoomSchema = new Schema(
//     {
//         user: {
//             type: Schema.Types.ObjectId,
//             ref: 'User',
//             default: null
//         },
//         password: {
//             type: Sequelize.STRING,
//             default: ''
//         },
//         access: {
//             type: Boolean,
//             default: true
//         },
//         accessIds: {
//             type: Array,
//             default: []
//         },
//         users: [
//             {
//                 _id: false,
//                 lookup: {
//                     type: Schema.Types.ObjectId,
//                     required: true,
//                     ref: 'User'
//                 },
//                 socketId: {
//                     type: Sequelize.STRING,
//                     required: true
//                 }
//             }
//         ]
//     },
//     {
//         timestamps: {
//             createdAt: 'created_at',
//             updatedAt: 'updated_at'
//         }
//     }
// );

// RoomSchema.methods.isValidPassword = function (password) {
//     return bcrypt.compare(password, this.password);
// };

// RoomSchema.pre('save', function (next) {
//     if (this.password !== '' && this.isModified('password')) {
//         bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(this.password, salt, (err, res) => {
//                 this.password = res;
//                 next();
//             });
//         });
//     } else {
//         next();
//     }
// });

// const Room = mongoose.model('Room', RoomSchema);

// module.exports = { Room };
