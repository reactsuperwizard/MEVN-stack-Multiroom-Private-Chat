const express = require('express');
const router = express.Router();
const passport = require('passport');

const Room = require('../models/Room');
const User = require('../models/User');

const {
    createErrorObject,
    checkCreateRoomFields
} = require('../middleware/authenticate');

/**
 * @description GET /api/room
 */
router.get('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
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
    if (rooms) {
        return res.status(200).json(rooms);
    } else {
        return res.status(404).json({
            error: 'No Rooms Found'
        });
    }
});

/**
 * @description GET /api/room/:room_id
 */
router.get('/:room_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const room = await Room.findByPk(req.params.room_id, {
        raw: true
    });
    await User.findAndCountAll({
            where: {
                room_id: room['id']
            }
        })
        .then(result => {
            room['users'] = result.rows;
        })

    // const user = 
    // room['user']
    //     .populate('user', ['username', 'social', 'image', 'handle'])
    //     .populate('users.lookup', ['username', 'social', 'image', 'handle'])
    //     .exec();

    if (room) {
        return res.status(200).json(room);
    } else {
        return res.status(404).json({
            error: `No room with name ${req.params.room_name} found`
        });
    }
});

/**
 * @description POST /api/room
 */
router.post(
    '/',
    [passport.authenticate('jwt', {
        session: false
    }), checkCreateRoomFields],
    async (req, res) => {
        let errors = [];

        const room = await Room.findOne({
            where: {
                name: req.body.room_name
            }
        });
        if (room) {
            if (room.name === req.body.room_name) {
                errors.push({
                    param: 'room_taken',
                    msg: 'Roomname already taken'
                });
            }
            return res.json({
                errors: createErrorObject(errors)
            });
        } else {
            const newRoom = new Room({
                name: req.body.room_name,
                user: req.user.id,
                access: req.body.password ? false : true,
                password: req.body.password
            });

            newRoom
                .save()
                .then(room => {
                    User.findOne({
                            where: {
                                id: room['user']
                            }
                        })
                        .then(user => {
                            room['user'] = user;
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        .finally(() => {
                            return res.status(200).json(room);
                        });
                })
                .catch(err => {
                    return res.json(err);
                });
        }
    }
);

// /**
//  * @description POST /api/room/verify
//  */
// router.post('/verify', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     if (!req.body.password === true) {
//         return res.json({
//             errors: createErrorObject([
//                 {
//                     param: 'password_required',
//                     msg: 'Password is required'
//                 }
//             ])
//         });
//     }

//     const room = await Room.findOne({ name: req.body.room_name }).exec();

//     if (room) {
//         const verified = await room.isValidPassword(req.body.password);

//         if (verified === true) {
//             room.accessIds.push(req.user.id);
//             await room.save();
//             return res.status(200).json({ success: true });
//         } else {
//             return res.json({
//                 errors: createErrorObject([
//                     {
//                         param: 'invalid_password',
//                         msg: 'Invalid Password'
//                     }
//                 ])
//             });
//         }
//     } else {
//         return res.status(404).json({ errors: `No room with name ${req.params.room_name} found` });
//     }
// });

// /**
//  * @description DELETE /api/room/:room_name
//  */
// router.delete('/:room_name', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     try {
//         const room = await Room.findOneAndDelete({ name: req.params.room_name })
//             .populate('user', ['username'])
//             .select('-password')
//             .lean();

//         if (room) {
//             return res.status(200).json(room);
//         } else {
//             return res.status(404).json({
//                 errors: `No room with name ${
//                     req.params.room_name
//                 } found, You will now be redirected`
//             });
//         }
//     } catch (err) {
//         return res.status(404).json(err);
//     }
// });

// /**
//  * @description PUT /api/room/update/name
//  */
// router.post('/update/name', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     req.check('new_room_name')
//         .isString()
//         .isLength({ min: 3, max: 20 })
//         .withMessage('New Room Name must be between 3 and 20 characters');

//     let errors = req.validationErrors();

//     if (errors.length > 0) {
//         return res.send({
//             errors: createErrorObject(errors)
//         });
//     }

//     const room = await Room.findOneAndUpdate(
//         { name: req.body.room_name },
//         { name: req.body.new_room_name },
//         { fields: { password: 0 }, new: true }
//     )
//         .populate('user', ['username'])
//         .populate('users.lookup', ['username']);

//     if (room) {
//         return res.status(200).json(room);
//     } else {
//         return res.status(404).json({ errors: `No room with name ${req.params.room_name} found` });
//     }
// });

/**
 * @description PUT /api/room/remove/users
 */
router.post('/remove/users', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {

    let room = await Room.findByPk(req.body.room_id, {
        raw: true
    });

    if (room) {
        const updateFields = ({
            room_id: null
        });
        await User.update(updateFields, {
                returning: true,
                raw: true,
                where: {
                    id: req.user.id
                }
            })
            .then(async info => {
                if (info[1]) {
                    const users = await User.findAll({
                        where: {
                            room_id: req.body.room_id
                        }
                    }, {
                        raw: true
                    })
                    room['users'] = users;
                }
            })
        return res.status(200).json(room);
    } else {
        return res.status(404).json({
            errors: `No room with name ${req.body.room_name} found`
        });
    }
});

/**
 * @description PUT /api/room/remove/users/:id/all
 */
router.put(
    '/remove/users/all',
    passport.authenticate('jwt', {
        session: false
    }),
    async (req, res) => {
        await Room.updateMany({
            $pull: {
                users: {
                    $in: [req.body.user_id]
                }
            }
        });

        const rooms = await Room.find({})
            .populate('user', ['username'])
            .populate('users.lookup', ['username'])
            .select('-password')
            .exec();

        if (rooms) {
            return res.status(200).json(rooms);
        } else {
            return res.status(404).json({
                error: 'No Rooms Found'
            });
        }
    }
);

module.exports = router;