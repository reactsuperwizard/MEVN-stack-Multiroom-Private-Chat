const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

module.exports = {
    ADD_MESSAGE: async data => {
        const newMessage = new Message({
            content: data.content,
            admin: data.admin ? true : false,
            user: data.user ? data.user.id : null,
            room: data.room.id
        });

        let messageData = await newMessage.save();
        if (data.user) {
            const userData = await User.findByPk(data.user.id, {
                raw: true
            });
            messageData['user'] = userData;
        }
        return messageData;
    },
    GET_MESSAGES: async data => {

        const messages = await Message.findAll({
            where: {
                room: data.room.id
            }
        });

        for (var i = 0; i < messages.length; i++) {
            const message = messages[i];
            await User.findByPk(message['user'], {
                    raw: true
                })
                .then(user => {
                    message['user'] = user;
                })
                .catch(err => {
                    console.log('err', err);
                })
        }
        return messages;
    },
    CREATE_MESSAGE_CONTENT: (room, socketId) => {
        const user = room.previous.users.find(user => user.socketId === socketId);

        return user && user.handle ?
            `${user.handle} has left ${room.updated.name}` :
            `Unknown User has left ${room.updated.name}`;
    },
    GET_ROOMS: async () => {
        const rooms = await Room.findAll({}, {
            raw: true
        });

        for (var i = 0; i < rooms.length; i++) {
            const room = rooms[i];
            await User.findOne({
                    where: {
                        id: room['user']
                    }
                }, {
                    raw: true
                })
                .then(user => {
                    room['user'] = user;
                })
            await User.findAndCountAll({
                    where: {
                        room_id: room['id']
                    }
                })
                .then(result => {
                    room['users'] = result.count;
                })
                .catch(err => {
                    console.log('err', err);
                })
        }
        return rooms;
        // return await Room.find({})
        //     .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
        //     .select('-password');
    },
    GET_ROOM_USERS: async data => {
        return await User.findAll({
            where: {
                room_id: data.room.id
            }
        }, {
            raw: true
        });
    },
    UPDATE_ROOM_USERS: async data => {
        let room;
        const updateFields = ({
            room_id: data.room.id,
            socketid: data.socketId
        });
        await User.update(updateFields, {
                returning: true,
                raw: true,
                where: {
                    id: data.user.id
                }
            })
            .then(async info => {
                if (info[1]) {
                    room = await Room.findByPk(data.room.id, {
                        raw: true
                    })
                    const users = await User.findAll({
                        where: {
                            room_id: data.room.id
                        }
                    }, {
                        raw: true
                    })
                    room['users'] = users;
                }
            })
        return room;
    },
    FILTER_ROOM_USERS: async data => {
        let room = await Room.findByPk(data.roomId);
        const updateFields = {
            'room_id': null
        }
        await User.update(updateFields, {
                returning: true,
                raw: true,
                where: {
                    socketid: data.socketId
                }
            })
            .then(async info => {
                if (info[1]) {
                    if (room) {
                        const previousUserState = room;

                        room['users'] = await User.findAll({
                            where: {
                                'room_id': room.id
                            }
                        }, {
                            raw: true
                        });

                        return {
                            previous: previousUserState,
                            updated: room
                        };
                    }
                }
            })
    }
};