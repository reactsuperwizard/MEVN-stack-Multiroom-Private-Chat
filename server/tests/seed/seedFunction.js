require('dotenv').config();
const Sequelize = require('sequelize');
const User = require('../../models/User');
const Room = require('../../models/Room');
const Message = require('../../models/Message');
const PrivateMessage = require('../../models/PrivateMessage');
const Op = Sequelize.Op;

const {
    userSeedData,
    userSeedData1,
    roomSeedData,
    messageSeedData,
    pMessageSeedData,
} = require('./seedData');

const populateData = async () => {
    const promiseArray = [];

    console.log('\n[PROCESS:SEED] Seeding User Data');

    promiseArray[0] = User.destroy({
        where: {},
        truncate: true,
    });
    promiseArray[1] = Message.destroy({
        where: {},
        truncate: true,
    });
    promiseArray[2] = PrivateMessage.destroy({
        where: {},
        truncate: true,
    });
    promiseArray[3] = Room.destroy({
        where: {
            id: {
                [Op.notBetween]: [1, 2],
            },
        },
    });
    Promise.all(promiseArray)
        .then(() => {
            User.bulkCreate(userSeedData);
            User.bulkCreate(userSeedData1);
            Room.bulkCreate(roomSeedData);
            Message.bulkCreate(messageSeedData);
            PrivateMessage.bulkCreate(pMessageSeedData);
        })
        .catch(err => {
            console.log('Truncate Failed ', err);
        });
};
module.exports = { populateData };
