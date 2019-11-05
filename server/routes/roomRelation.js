const express = require('express');
const router = express.Router();
const passport = require('passport');

const RoomRelation = require('../models/RoomRelation');
const Message = require('../models/Message');
const _ = require('../../node_modules/lodash');
const Sequelize = require("sequelize")

const {
    createErrorObject,
    checkCreateRoomFields
} = require('../middleware/authenticate');

/**
 * @description POST /api/RoomRelation
 * id : touser
 * status: status
 */
// , Sequelize.and({
// 'user': req.user.id,
// 'touser': req.params.user_id
// }))
router.post('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const arr = await RoomRelation.findOrCreate({
        where: {
            'room': req.body.room,
            'user': req.body.user
        }
    });
    const instance = arr[0]; // the first element is the instance

    const pRelation = RoomRelation.update({
        status: req.body.status
    }, {
        where: {
            id: instance.id
        }
    });

    const pMessages = Message.destroy({
        where: {
            user: req.body.user,
            room: req.body.room
        }
    })
    Promise.all([msg_p, pMessages])
        .then(pRelation => {
            res.status(200).send({
                status: true
            });
        })
        .catch(err => {
            console.log('be:RoomRelation post upsert err', err);
        });
});
module.exports = router;