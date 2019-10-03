const express = require('express');
const router = express.Router();

const passport = require('passport');

const User = require('../models/User');

const { checkEditProfileFields } = require('../middleware/authenticate');

const bcrypt = require('bcryptjs')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, false);
    } else {
        cb(null, true);
    }
}


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: fileFilter
})
// /**
//  * @description  GET /api/user/users
//  * @param  {Middleware} passport.authenticate
//  * @param  {false} session
//  * @param  {Object} request
//  * @param  {Object} response
//  * @access private
//  */

// router.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     const users = await User.find({}, 'image email username location').exec();

//     if (users) {
//         return res
//             .status(200)
//             .json(users)
//             .end();
//     } else {
//         return res.status(404).json({ error: 'No Users Found' });
//     }
// });

/**Password Encrypt Function */
encryptPwd = async (pwd) => {

}

/**
 * @description PUT /api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.put(
    '/current',
    [upload.single('image'), passport.authenticate('jwt', { session: false }), checkEditProfileFields],
    async (req, res) => {
        const updateFields = {};
        // let hash;

        for (let key of Object.keys(req.body)) {
            if (req.body[key] !== null) {
                updateFields[key] = req.body[key];
            }
        }

        bcrypt.hash(req.body.password, 10, (error, hash) => {
            console.log('req.body', req.body);
            if (hash && req.body['password']) {
                updateFields['password'] = hash;
            }
            if (req.file) {
                updateFields['image'] = req.file.filename
            }
            User.update(updateFields, { returning: true, plain: true, where: { id: req.user.id } })
                .then(function (doc) {
                    if (doc[1]) {
                        User.findByPk(req.user.id, {
                            attributes: { exclude: ['password'] }
                        })
                            .then(doc => {
                                res.json({ success: true, user: doc })
                            })
                    }
                })
                // .then(doc => res.json({ success: true, user: doc }))
                .catch(err => {
                    console.log('err', err);
                    res.json({ error: err })
                });
        })

        console.log(req.body);
    }
);

/**
 * @description GET api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

// /**
//  * @description DELETE api/user/current
//  * @param  {String} id
//  * @param  {Middleware} passport.authenticate
//  * @param  {false} session
//  * @param  {Object} request
//  * @param  {Object} response
//  */
// router.delete('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
//     /** Delete the user */
//     await User.findOneAndDelete({ _id: req.user.id });

//     res.json({ success: true });
// });

module.exports = router;
