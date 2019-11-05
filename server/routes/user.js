const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
var uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs')
const multer = require('multer')
var path = require('path')

const {
    checkEditProfileFields
} = require('../middleware/authenticate');

const {
    DELETE_USER
} = require('../actions/socketio');

// upload path for avatar image
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../chat_storage/avatar');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
// upload path for upload image
const storage_upload = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, '../client/public_images/upload_images');
        cb(null, '../chat_storage/upload');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {

    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
        // if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, false);
    } else {
        cb(null, true);
    }
}

//file filter for image, audio, video
const fAudioVideoFilter = (req, file, cb) => {

    const type = file.mimetype;
    const typeArray = type.split("/");
    if (typeArray[0] !== 'image' && typeArray[0] !== 'audio' && typeArray[0] !== 'video') {
        // if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, false);
    } else {
        cb(null, true);
    }
}
// upload var for avatar image

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: fileFilter
})
// upload var for upload image
const upload_images = multer({
    storage: storage_upload,
    limits: {
        fileSize: 1024 * 1024 * 50
    },
    fileFilter: fAudioVideoFilter
})
/**
 * @description  GET /api/user/users
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 * @access private
 */

router.get('/users', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const users = await User.findAll({}, {
        raw: true
    });

    if (users) {
        return res
            .status(200)
            .json(users)
            .end();
    } else {
        return res.status(404).json({
            error: 'No Users Found'
        });
    }
});
/**
 * @description PUT /api/user/image
 */
router.post(
    '/image', [upload_images.single('image'), passport.authenticate('jwt', {
        session: false
    })], async (req, res) => {
        if (req.file) {
            res.json({
                success: true,
                image: req.file.filename
            })
        } else {
            res.json({
                success: false
            })
        }
    });


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
    [upload.single('image'), passport.authenticate('jwt', {
        session: false
    }), checkEditProfileFields],
    async (req, res) => {
        const updateFields = {};

        for (let key of Object.keys(req.body)) {
            if (req.body[key] !== null) {
                updateFields[key] = req.body[key];
            }
        }

        bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (hash && req.body['password']) {
                updateFields['password'] = hash;
            }
            if (req.file) {
                updateFields['image'] = req.file.filename
            }
            User.update(updateFields, {
                    returning: true,
                    plain: true,
                    where: {
                        id: req.user.id
                    }
                })
                .then(function (doc) {
                    if (doc[1]) {
                        User.findByPk(req.user.id, {
                                attributes: {
                                    exclude: ['password']
                                }
                            })
                            .then(doc => {
                                res.json({
                                    success: true,
                                    user: doc
                                })
                            })
                    }
                })
                // .then(doc => res.json({ success: true, user: doc }))
                .catch(err => {
                    console.log('err', err);
                    res.json({
                        error: err
                    })
                });
        })

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
router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json(req.user);
});

/**
 * @description DELETE api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.delete('/current', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    /** Delete the user */
    const status = await DELETE_USER(req.user.id);
    res.json({
        success: status
    });
});

module.exports = router;