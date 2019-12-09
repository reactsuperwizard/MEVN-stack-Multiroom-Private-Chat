const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
var uuidv4 = require('uuid/v4');
var path = require('path');
const Sequelize = require('sequelize');

/**URLs */

const Room = require('../models/Room');
const User = require('../models/User');
const Relation = require('../models/Relation');

const {
	createErrorObject,
	checkCreateRoomFields,
} = require('../middleware/authenticate');

const { GET_RELATIONS, DELETE_ROOM_BY_PARAM } = require('../actions/socketio');

// upload path for avatar image
const storage = multer.diskStorage({
	destination: '../chat_storage/room_avatar',
	filename: function(req, file, cb) {
		cb(null, uuidv4() + path.extname(file.originalname));
	},
});
const fileFilter = (req, file, cb) => {
	let ext = path.extname(file.originalname);
	ext = ext.toLowerCase();
	if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
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
 * @description GET /api/room
 */
router.get(
	'/',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		const rooms_p = Room.findAll(
			{},
			{
				raw: true,
			},
		);
		const users_p = User.findAll(
			{},
			{
				raw: true,
			},
		);
		return Promise.all([rooms_p, users_p])
			.then(value => {
				const rooms = value[0];
				const users = value[1];
				for (let i = 0; i < rooms.length; i++) {
					const room = rooms[i];
					room['user'] = users.find(user => user['id'] == room['user']);
					//public room - set the number of users as room users
					room['users'] = users.filter(
						user => user['room_id'] === room['id'] && user.status_active == 1,
					).length;
				}

				if (rooms) {
					return res.status(200).json({ rooms: rooms, online: users.length });
				} else {
					return res.status(404).json({
						error: 'No Rooms Found',
					});
				}
			})
			.catch(err => {
				console.log('err', err);
			});
	},
);

/**
 * @description GET /api/room/:room_id
 */
router.get(
	'/:room_id',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		const room = await Room.findByPk(req.params.room_id, {
			raw: true,
		});
		if (room) {
			if (room['access']) {
				//public room
				const relations = await GET_RELATIONS({
					room: req.params.room_id,
					roomAdmin: room.user,
					user: req.user.id,
				});

				if (relations.privateR == 2 || relations.roomR == 2) {
					return res.status(200).json({
						msg: 'You are blocked',
					});
				}
				User.findAndCountAll({
					where: {
						room_id: room['id'],
					},
				}).then(async result => {
					room['users'] = result.rows;
					room['privateRs'] = relations.privateRs;
					room['status'] = relations.roomR;
					return res.status(200).json(room);
				});
			} else {
				//private room
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

				await User.findAll(
					{
						where: {
							id: uniqueIds,
						},
					},
					{
						raw: true,
					},
				).then(result => {
					room['users'] = result;
					for (const user of room['users']) {
						const from_st = relations.filter(
							relation =>
								relation['user'] == req.user.id &&
								relation['touser'] == user.id,
						);
						const to_st = relations.filter(
							relation =>
								relation['touser'] == req.user.id &&
								relation['user'] == user.id,
						);
						user['dataValues']['from'] = from_st[0] ? from_st[0].status : false;
						user['dataValues']['to'] = to_st[0] ? to_st[0].status : false;
					}
					return res.status(200).json(room);
				});
			}
		} else {
			return res.status(404).json({
				error: `No room with name ${req.params.room_name} found`,
			});
		}
	},
);

/**
 * @description POST /api/room
 */
router.post(
	'/',
	[
		upload.single('room_avatar'),
		passport.authenticate('jwt', {
			session: false,
		}),
		checkCreateRoomFields,
	],
	async (req, res) => {
		let errors = [];
		const fileName = req.file ? req.file.filename : 'defaultRoom.png';

		const totalRoom = await Room.findAll(
			{},
			{
				raw: true,
			},
		);
		const room = totalRoom.find(room => room.name == req.body.room_name);
		const roomByUser = totalRoom.filter(room => room.user == req.user.id)
			.length;

		if (room) {
			if (room.name === req.body.room_name) {
				errors.push({
					param: 'room_taken',
					msg: 'Roomname already taken',
				});
			}
		}
		//Maximum Total Room - 100
		if (totalRoom.length > 99) {
			errors.push({
				param: 'totalRoomExceeds',
				msg: 'Already created 100 rooms',
			});
		}
		//One user can create 3 Rooms as a maximum
		if (roomByUser > 2) {
			errors.push({
				param: 'UserRoomExceeds',
				msg: 'You already created 3 rooms',
			});
		}

		if (errors.length) {
			return res.json({
				errors: createErrorObject(errors),
			});
		}
		const newRoom = new Room({
			name: req.body.room_name,
			user: req.user.id,
			avatar: fileName,
			access: req.body.password ? false : true,
			password: req.body.password,
		});

		newRoom
			.save()
			.then(room => {
				User.findOne({
					where: {
						id: room['user'],
					},
				})
					.then(user => {
						room['user'] = user;
					})
					.catch(err => {
						console.log(err);
					})
					.finally(() => {
						room['users'] = 0;
						return res.status(200).json(room);
					});
			})
			.catch(err => {
				return res.json(err);
			});
	},
);

/**
 * @description DELETE /api/room/:room_name
 */
router.delete(
	'/:room_name',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		if (
			req.params.room_name != 'HOME' &&
			req.params.room_name != 'Private Room'
		) {
			try {
				const room = await Room.findOne(
					{
						where: {
							name: req.params.room_name,
						},
					},
					{
						raw: true,
					},
				);
				if (!room) {
					return res.status(200).json({});
				}
				const roomUsers = await User.findAndCountAll({
					where: {
						room_id: room.id,
					},
				});
				if (!req.body.check) {
					setTimeout(async () => {
						const delStatus = await DELETE_ROOM_BY_PARAM(room);
						return res.status(200).json(
							delStatus.status
								? room
								: {
										errors: `No room with name ${req.params.room_name} found, You will now be redirected`,
								  },
						);
					}, 0);
				} else if (roomUsers.count == 0) {
					const currentDate = Sequelize.literal('CURRENT_TIMESTAMP');
					Room.update(
						{
							lastAcTime: currentDate,
						},
						{
							returning: true,
							raw: true,
							where: {
								name: req.params.room_name,
							},
						},
					);
				}
			} catch (err) {
				return res.status(200).json({
					errors: `No room with name ${req.params.room_name} found, You will now be redirected`,
				});
			}
		} else {
			return res.status(200).json({});
		}
	},
);

/**
 * @description PUT /api/room/update/name
 */
router.post(
	'/update/name',
	[
		upload.single('room_avatar'),
		passport.authenticate('jwt', {
			session: false,
		}),
	],
	async (req, res) => {
		req
			.check('new_room_name')
			.isString()
			.isLength({
				min: 3,
				max: 20,
			})
			.withMessage('New Room Name must be between 3 and 20 characters');

		let errors = req.validationErrors();

		if (errors.length > 0) {
			return res.send({
				errors: createErrorObject(errors),
			});
		}
		const updateFields = {};
		if (req.body) {
			updateFields['name'] = req.body.new_room_name;
		}
		updateFields['avatar'] = req.file ? req.file.filename : 'defaultRoom.png';
		Room.update(updateFields, {
			returning: true,
			plain: true,
			where: {
				name: req.body.room_name,
			},
		})
			.then(function(doc) {
				if (doc[1]) {
					Room.findOne({
						where: {
							name: req.body.new_room_name,
						},
					}).then(async doc => {
						await User.findAndCountAll({
							where: {
								room_id: doc['id'],
							},
						}).then(result => {
							doc['users'] = result.rows;
						});
						return res.status(200).json(doc);
					});
				}
			})
			// .then(doc => res.json({ success: true, user: doc }))
			.catch(err => {
				console.log('err', err);
				return res.status(404).json({
					errors: `Room ${req.params.room_name} update failed`,
				});
			});
	},
);

/**
 * @description PUT /api/room/remove/users
 */
router.post(
	'/remove/users',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		let room = await Room.findByPk(req.body.room_id, {
			raw: true,
		});
		const id = req.body.user ? req.body.user : req.user.id;

		if (room) {
			const updateFields = {
				room_id: null,
			};
			await User.update(updateFields, {
				returning: true,
				raw: true,
				where: {
					id: id,
				},
			}).then(async info => {
				if (info[1]) {
					const users = await User.findAll(
						{
							where: {
								room_id: req.body.room_id,
							},
						},
						{
							raw: true,
						},
					);
					room['users'] = users;
				}
			});
			return res.status(200).json(room);
		} else {
			return res.status(404).json({
				errors: `No room with name ${req.body.room_name} found`,
			});
		}
	},
);

/**
 * @description GET /api/room/userRelations/:room_id
 */
router.get(
	'/userRelations/:room_id',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		const privateRs = await Relation.findAll(
			{
				where: {
					user: req.user.id,
				},
			},
			{
				raw: true,
			},
		);
		User.findAndCountAll({
			where: {
				room_id: req.params.room_id,
			},
		}).then(async result => {
			const users = result.rows;
			for (const user of users) {
				const from_st = privateRs.find(
					privateR => privateR['touser'] == user.id,
				);
				user['dataValues']['from'] = from_st ? from_st.status : 0;
			}
			return res.status(200).json(users);
		});
	},
);

/**
 * @description PUT /api/room/remove/users/:id/all
 */
router.put(
	'/remove/users/all',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		const updateFields = {
			room_id: null,
		};
		User.update(updateFields, {
			returning: true,
			raw: true,
			where: {
				id: req.body.userid,
			},
		})
			.then(info => {
				return res.status(200).json({ success: true });
			})
			.catch(err => {
				return res.status(200).json({ success: false });
			});
	},
);
module.exports = router;
