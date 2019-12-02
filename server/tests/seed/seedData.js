const userSeedUnit = 10 * 400; //total 10 * 400 * 2
let MesgSeedLoop = 10 * 1000;
let pMsgSeedLoop = 10 * 1000;
let roomSeedLoop = 0.1 * 1000;

const userSeedData = [];
const userSeedData1 = [];
const messageSeedData = [];
const pMessageSeedData = [];
const roomSeedData = [];

let userSeedLoop = 0;

while (userSeedLoop++ < userSeedUnit) {
    userSeedData[userSeedLoop - 1] = {
        id: userSeedLoop,
        handle: 'bulk' + userSeedLoop,
        username: 'bulk' + userSeedLoop,
        email: 'bulk' + userSeedLoop + '@email.com',
        password: 'bulk' + userSeedLoop,
        image:
            '//www.gravatar.com/avatar/4c5fc469cbf9ada2' +
            userSeedLoop +
            '6ea219a61ca6ff4a?s=220&r=pg&d=identicon',
        status_active: 0,
    };
}

userSeedLoop = 0;

while (userSeedLoop++ < userSeedUnit) {
    userSeedData1[userSeedLoop - 1] = {
        id: userSeedLoop + userSeedUnit,
        handle: 'bulk' + userSeedLoop + userSeedUnit,
        username: 'bulk' + userSeedLoop + userSeedUnit,
        email: 'bulk' + userSeedLoop + userSeedUnit + '@email.com',
        password: 'bulk' + userSeedLoop,
        image:
            '//www.gravatar.com/avatar/4c5fc469cbf9ada2' +
            userSeedLoop +
            '6ea219a61ca6ff4a?s=220&r=pg&d=identicon',
        status_active: 0,
    };
}

while (roomSeedLoop--) {
    roomSeedData[roomSeedLoop] = {
        id: roomSeedLoop + 3,
        name: 'room' + roomSeedLoop,
        avatar: 'defaultRoom.png',
        access: 1,
    };
}

while (MesgSeedLoop--) {
    messageSeedData[MesgSeedLoop] = {
        id: MesgSeedLoop + 1,
        content: 'MessageContent' + MesgSeedLoop,
        room: MesgSeedLoop % 100,
        user: MesgSeedLoop % 1000,
        admin: MesgSeedLoop % 100 === 0,
    };
}

while (pMsgSeedLoop--) {
    const random1 = Math.round(Math.random() * 1000);
    let random2 = Math.round(Math.random() * 1000);
    random2 = random1 === random2 ? random2 + 1 : random2;
    pMessageSeedData[pMsgSeedLoop] = {
        id: pMsgSeedLoop + 1,
        content: 'private MessageContent' + pMsgSeedLoop,
        user: random1,
        touser: random2,
    };
}

module.exports = {
    userSeedData: userSeedData,
    userSeedData1: userSeedData1,
    roomSeedData: roomSeedData,
    messageSeedData: messageSeedData,
    pMessageSeedData: pMessageSeedData,
};
