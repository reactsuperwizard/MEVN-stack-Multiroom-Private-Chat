const express = require('express');
const router = express.Router();
const passport = require('passport');

const Relation = require('../models/Relation');
const _ = require('../../node_modules/lodash');
const Sequelize = require("sequelize")

const {
    createErrorObject,
    checkCreateRoomFields
} = require('../middleware/authenticate');

/**
 * @description POST /api/relation
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
    const arr = await Relation.findOrCreate({
        where: {
            'user': req.user.id,
            'touser': req.body.to
        }
    });
    // console.log(arr);
    const instance = arr[0]; // the first element is the instance
    await Relation.update({
            status: req.body.status
        }, {
            where: {
                id: instance.id
            }
        })
        .then(result => {
            res.status(200).send({
                status: true
            });
        })
        .catch(err => {
            console.log('be:relation post upsert err', err);
        });
});
module.exports = router;