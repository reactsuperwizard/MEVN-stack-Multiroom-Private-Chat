const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/User');
var uuidv4 = require('uuid/v4');
const bcrypt = require('bcryptjs');
const multer = require('multer');
var path = require('path');
const Relation = require('../models/Relation');
const Sequelize = require('sequelize');

const { checkEditProfileFields } = require('../middleware/authenticate');

const { DELETE_USER } = require('../actions/socketio');

// upload path for avatar image
const storage = multer.diskStorage({
	destination: '../chat_storage/avatar',
	filename: function(req, file, cb) {
		cb(null, uuidv4() + path.extname(file.originalname));
	},
});
// upload path for upload image
const storage_upload = multer.diskStorage({
	destination: '../chat_storage/upload',
	filename: function(req, file, cb) {
		cb(null, uuidv4() + path.extname(file.originalname));
	},
});
const fileFilter = (req, file, cb) => {
	const fileType = file.mimetype.toLowerCase();
	if (
		fileType !== 'image/png' &&
		fileType !== 'image/jpg' &&
		fileType !== 'image/jpeg'
	) {
		// if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
		cb(null, false);
	} else {
		cb(null, true);
	}
};

//file filter for image, audio, video
const fAudioVideoFilter = (req, file, cb) => {
	const type = file.mimetype;
	const typeArray = type.split('/');
	if (
		typeArray[0] !== 'image' &&
		typeArray[0] !== 'audio' &&
		typeArray[0] !== 'video'
	) {
		// if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
		cb(null, false);
	} else {
		cb(null, true);
	}
};
// upload var for avatar image

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 50,
	},
	fileFilter: fileFilter,
});
/**
 * @description  GET /api/user/users
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 * @access private
 */

router.get(
	'/users',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		//Get All Users
		const relations = await Relation.findAll(
			{
				where: Sequelize.or(
					{
						user: req.user.id,
					},
					{
						touser: req.user.id,
					},
				),
			},
			{
				raw: true,
			},
		);
		const ids = relations.map(rel => rel.user);
		const toIds = relations.map(rel => rel.touser);

		Array.prototype.unique = function() {
			var a = this.concat();
			for (var i = 0; i < a.length; ++i) {
				for (var j = i + 1; j < a.length; ++j) {
					if (a[i] === a[j]) a.splice(j--, 1);
				}
			}

			return a;
		};
		var uniqueIds = ids.concat(toIds).unique();
		const users = await User.findAll(
			{
				where: {
					id: uniqueIds,
				},
			},
			{
				raw: true,
			},
		);
		for (const user of users) {
			const from_st = relations.filter(
				relation =>
					relation['user'] == req.user.id && relation['touser'] == user.id,
			);
			const to_st = relations.filter(
				relation =>
					relation['touser'] == req.user.id && relation['user'] == user.id,
			);
			user['dataValues']['from'] = from_st[0] ? from_st[0].status : false;
			user['dataValues']['to'] = to_st[0] ? to_st[0].status : false;
		}
		return res.status(200).json({
			users: users,
		});
	},
);
/**
 * @description PUT /api/user/image
 */
// upload var for upload image
const upload_images = multer({
	storage: storage_upload,
	limits: {
		fileSize: 1024 * 1024 * 50,
	},
	fileFilter: fAudioVideoFilter,
}).single('image');

router.post(
	'/image',
	[
		passport.authenticate('jwt', {
			session: false,
		}),
	],
	async (req, res) => {
		try {
			upload_images(req, res, function(err) {
				if (err || !req.file) {
					res.json({
						success: false,
					});
				} else {
					res.json({
						success: true,
						image: req.file.filename,
					});
				}
			});
		} catch (err) {
			res.json({
				success: true,
				image: req.file.filename,
			});
		}
	},
);

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
	[
		upload.single('image'),
		passport.authenticate('jwt', {
			session: false,
		}),
		checkEditProfileFields,
	],
	async (req, res) => {
		const updateFields = {};

		for (let key of Object.keys(req.body)) {
			if (req.body[key] !== null) {
				updateFields[key] = req.body[key];
			}
		}

		bcrypt.hash(req.body.password, 10, async (error, hash) => {
			if (hash && req.body['password']) {
				updateFields['password'] = hash;
			}
			if (req.file) {
				updateFields['image'] = req.file.filename;
			}
			const user = await User.findByPk(req.user.id, {
				raw: true,
			});
			const avatarUrl = user.image;

			User.update(updateFields, {
				returning: true,
				plain: true,
				where: {
					id: req.user.id,
				},
			})
				.then(function(doc) {
					User.findByPk(req.user.id, {
						attributes: {
							exclude: ['password'],
						},
					}).then(doc => {
						return res.json({
							success: true,
							user: doc,
						});
					});
				})
				// .then(doc => res.json({ success: true, user: doc }))
				.catch(err => {
					console.log('err', err);
					res.json({
						error: err,
					});
				});
		});
	},
);

/**
 * @description GET api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.get(
	'/current',
	passport.authenticate('jwt', {
		session: false,
	}),
	(req, res) => {
		res.json(req.user);
	},
);

/**
 * @description DELETE api/user/current
 * @param  {String} id
 * @param  {Middleware} passport.authenticate
 * @param  {false} session
 * @param  {Object} request
 * @param  {Object} response
 */
router.delete(
	'/current',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		/** Delete the user */
		const status = await DELETE_USER(req.user.id);
		res.json({
			success: status,
		});
	},
);

module.exports = router;
