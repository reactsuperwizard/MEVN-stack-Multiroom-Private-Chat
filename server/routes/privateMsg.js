const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/User');
const PrivateMessage = require('../models/PrivateMessage');
const Sequelize = require("sequelize")


/**
 * @description GET /api/privateMsg/:user_id
 */
router.get('/:user_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        raw: true
    });
    const touser = await User.findByPk(req.params.user_id, {
        raw: true
    });
    PrivateMessage.findAll({
            where: Sequelize.or({
                'user': req.user.id,
                'touser': req.params.user_id
            }, {
                'user': req.params.user_id,
                'touser': req.user.id
            })
        }, {
            raw: true
        })
        .then(msgs => {
            for (let i = 0; i < msgs.length; i++) {
                msgs[i].user = msgs[i].user == req.user.id ? user : touser;
                msgs[i].touser = msgs[i].touser == req.user.id ? touser : user;
            }
            return res.status(200).json({
                'status': 2,
                'message': msgs
            });
        })
        .catch(err => {
            console.log('err', err);
        });
});

module.exports = router;