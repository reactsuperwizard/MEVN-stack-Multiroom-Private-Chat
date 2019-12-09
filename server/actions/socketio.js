const Message = require('../models/Message');
const PrivateMessage = require('../models/PrivateMessage');
const Room = require('../models/Room');
const User = require('../models/User');
const Relation = require('../models/Relation');
const RoomRelation = require('../models/RoomRelation');
const Sequelize = require('sequelize');

const fs = require('fs');

/**URLs */
const chatStorageUrl = '../chat_storage/';
const roomAvatarUrl = chatStorageUrl + 'room_avatar/';
const uploadUrl = chatStorageUrl + 'upload/';
const userAvatarUrl = chatStorageUrl + 'avatar/';

module.exports = {
	DELETE_ROOM_BY_PARAM: async room => {
		const status = await Room.destroy({
			where: {
				id: room.id,
			},
		});
		const messages = await Message.findAll(
			{
				where: {
					room: room.id,
				},
			},
			{
				raw: true,
			},
		);

		Message.destroy({
			where: {
				room: room.id,
			},
		});
		RoomRelation.destroy({
			where: {
				room: room.id,
			},
		});
		if (status) {
			const msgUrls = messages
				.filter(msg => msg.content.includes('!!!image!!!'))
				.map(function(obj) {
					return uploadUrl + obj.content.substring(11);
				});

			if (room.avatar != 'defaultRoom.png') {
				msgUrls.push(roomAvatarUrl + room.avatar);
			}
			msgUrls.forEach(path => {
				fs.access(path, err => {
					if (!err) {
						fs.unlinkSync(path, err => {
							console.log('file deleting err', err);
						});
					} else {
						console.log('file accessing err', err);
					}
				});
			});
			return {
				status: true,
				room: room,
			};
		}
		return {
			status: false,
			errors: `No room found, You will now be redirected`,
		};
	},
	//room, roomAdmin, user
	GET_RELATIONS: async data => {
		const relations = {};
		relations.roomR = 0;
		relations.privateR = 0;
		relations.privateRs = {};

		const roomRs = RoomRelation.findOne(
			{
				where: {
					room: data.room,
					user: data.user,
				},
			},
			{
				raw: true,
			},
		);
		const privateRs = Relation.findAll(
			{
				where: {
					user: data.user,
				},
			},
			{
				raw: true,
			},
		);
		const privateR = Relation.findOne(
			{
				where: {
					user: data.roomAdmin,
					touser: data.user,
				},
			},
			{
				raw: true,
			},
		);
		const value = await Promise.all([roomRs, privateRs, privateR]);
		relations.roomR = value[0] ? value[0].status : relations.roomR;
		relations.privateRs = value[1] ? value[1] : relations.privateRs;
		relations.privateR = value[2] ? value[2].status : relations.privateR;
		return relations;
	},
	ADD_MESSAGE: async data => {
		const newMessage = new Message({
			content: data.content,
			admin: data.admin ? true : false,
			user: data.user ? data.user.id : null,
			room: data.room.id,
		});

		let messageData = await newMessage.save();
		if (data.user) {
			const userData = await User.findByPk(data.user.id, {
				raw: true,
			});
			messageData['user'] = userData;
		}
		return messageData;
	},
	ADD_PRIVATE_MESSAGE: async data => {
		if (!data.user || !data.select || !data.content) return null;
		const newMessage = new PrivateMessage({
			content: data.content,
			admin: data.admin ? true : false,
			user: data.user ? data.user.id : null,
			touser: data.select ? data.select : null,
		});

		const arr = await Relation.findOrCreate({
			where: {
				touser: data.user.id,
				user: data.select,
			},
			defaults: {
				touser: data.user.id,
				user: data.select,
				status: 0,
			},
		});
		const relat = arr[0]; // the first element is the instance

		if (relat && relat.status == 2) return null;
		let messageData = await newMessage.save();
		if (data.user) {
			const userData = await User.findByPk(data.user.id, {
				raw: true,
			});
			const touserData = await User.findByPk(data.select, {
				raw: true,
			});
			messageData['user'] = userData;
			messageData['touser'] = touserData;
			messageData['user']['status'] = relat ? relat.status : 0;
		}
		return messageData;
	},
	GET_USER_SOCKET: async data => {
		const userData = await User.findByPk(data, {
			raw: true,
		});
		return userData.socketid;
	},
	onlyUnique: (value, index, self) => {
		return self.indexOf(value) === index;
	},
	GET_MESSAGES: async data => {
		const messages_p = Message.findAll(
			{
				where: {
					room: data.room.id,
				},
				attributes: ['id', 'content', 'user', 'createdAt'],
				limit: 10000,
				order: [['id', 'DESC']],
			},
			{ raw: true },
		);
		let messages = [];
		return messages_p
			.then(msgs => msgs.reverse())
			.then(msgs => {
				messages = msgs;
				const userIds = messages
					.map(message => message.user)
					.filter((value, index, self) => self.indexOf(value) === index);
				return User.findAll(
					{
						where: { id: userIds },
						attributes: ['id', 'handle', 'image'],
					},
					{
						raw: true,
					},
				);
			})
			.then(users => {
				for (var i = 0; i < messages.length; i++) {
					const message = messages[i];

					message['user'] = users.find(user => user.id == message.user);
				}
				return messages;
			});
	},
	GET_PRIVATE_MESSAGES: async data => {
		const messages = await Message.findAll({
			where: {
				room: data.room.id,
			},
		});

		for (var i = 0; i < messages.length; i++) {
			const message = messages[i];
			await User.findByPk(message['user'], {
				raw: true,
			})
				.then(user => {
					message['user'] = user;
				})
				.catch(err => {
					console.log('err', err);
				});
		}
		return messages;
	},
	// 0 - left content, 1 - Room Admin changed status for user
	CREATE_MESSAGE_CONTENT: async (room, socketId, status = 0) => {
		if (!status) {
			const user = room.previous.users.find(user => user.socketId === socketId);
			return user && user.handle
				? `${user.handle} has left ${room.updated.name}`
				: `Unknown User has left ${room.updated.name}`;
		}
		const user = await User.findByPk(socketId.user, {
			raw: true,
		});
		const status_text = !socketId.status
			? ' was actived'
			: socketId.status == 1
			? ' was banned'
			: ' was blocked';
		return user && user.handle
			? `${user.handle} ${status_text}`
			: `Unknown User ${status_text}`;
	},
	GET_ROOMS: async () => {
		const rooms = await Room.findAll(
			{},
			{
				raw: true,
			},
		);
		const users = await User.findAll(
			{
				// where: {
				// 	status_active: 1,
				// },
			},
			{
				raw: true,
			},
		);
		for (var i = 0; i < rooms.length; i++) {
			rooms[i]['user'] = users.find(user => user.id == rooms[i]['user']);
			rooms[i]['users'] = users.filter(
				user => user['room_id'] === rooms[i]['id'] && user.status_active == 1,
			).length;
		}
		return { rooms: rooms, online: users.length };
		// return await Room.find({})
		//     .populate('user users.lookup', ['username', 'social', 'handle', 'image'])
		//     .select('-password');
	},
	GET_ROOM_USERS: async data => {
		return User.findAll(
			{
				where: {
					room_id: data.room.id,
				},
			},
			{
				raw: true,
			},
		);
	},
	UPDATE_ROOM_USERS: async data => {
		let room;
		const updateFields = {
			room_id: data.room.id,
			socketid: data.socketId,
		};
		return User.update(updateFields, {
			returning: true,
			raw: true,
			where: {
				id: data.user.id,
			},
		})
			.then(async info => {
				if (!info[1]) throw 'empty';

				Room.update(
					{
						lastAcTime: null,
					},
					{
						returning: true,
						raw: true,
						where: {
							id: data.room.id,
						},
					},
				);
				room = await Room.findByPk(data.room.id, {
					raw: true,
				});
				const room_p = Room.findByPk(data.room.id, {
					raw: true,
				});
				const users_p = User.findAll(
					{
						where: {
							room_id: data.room.id,
						},
					},
					{
						raw: true,
					},
				);

				return Promise.all([room_p, users_p]);
			})
			.then(value => {
				const room = value[0];
				const users = value[1];
				room['users'] = users;
				return room;
			})
			.catch(err => null);
	},
	UPDATE_PRIVATE_USER: async data => {
		const updateFields = {
			socketid: data.socketId,
		};
		await User.update(updateFields, {
			returning: true,
			raw: true,
			where: {
				id: data.user.id,
			},
		}).then(async info => {
			if (info[1]) {
				return true;
			}
		});
		return false;
	},
	FILTER_ROOM_USERS: async data => {
		let room = await Room.findByPk(data.roomId);
		const updateFields = {
			room_id: null,
		};
		await User.update(updateFields, {
			returning: true,
			raw: true,
			where: {
				socketid: data.socketId,
			},
		}).then(async info => {
			if (info[1]) {
				if (room) {
					const previousUserState = room;

					room['users'] = await User.findAll(
						{
							where: {
								room_id: room.id,
							},
						},
						{
							raw: true,
						},
					);

					return {
						previous: previousUserState,
						updated: room,
					};
				}
			}
		});
	},
	DELETE_USER: async data => {
		let msgs, pMsgs, userp;
		const messages = Message.findAll(
			{
				where: {
					user: data,
				},
			},
			{
				raw: true,
			},
		);
		const pMessages = PrivateMessage.findAll(
			{
				where: Sequelize.or(
					{
						user: data,
					},
					{
						touser: data,
					},
				),
			},
			{
				raw: true,
			},
		);
		const puser = User.findOne(
			{
				where: {
					id: data,
				},
			},
			{
				raw: true,
			},
		);
		Promise.all([messages, pMessages, puser]).then(value => {
			msgs = value[0];
			pMsgs = value[1];
			userp = value[2];
			const msg_p = Message.destroy({
				where: {
					user: data,
				},
			});
			const pmsg_p = PrivateMessage.destroy({
				where: Sequelize.or(
					{
						user: data,
					},
					{
						touser: data,
					},
				),
			});
			const rel_p = Relation.destroy({
				where: Sequelize.or(
					{
						user: data,
					},
					{
						touser: data,
					},
				),
			});
			const user_p = User.destroy({
				where: {
					id: data,
				},
			});

			Promise.all([msg_p, pmsg_p, rel_p, user_p])
				.then(value => {
					const msgUrls = msgs
						.filter(msg => msg.content.includes('!!!image!!!'))
						.map(function(obj) {
							return uploadUrl + obj.content.substring(11);
						});
					const pmsgUrls = pMsgs
						.filter(pmsg => pmsg.content.includes('!!!image!!!'))
						.map(function(obj) {
							return uploadUrl + obj.content.substring(11);
						});

					const URLs = msgUrls.concat(pmsgUrls);
					if (!userp.image.includes('www.gravatar.com')) {
						URLs.push(userAvatarUrl + userp.image);
					}
					URLs.forEach(path => {
						fs.access(path, err => {
							if (!err) {
								fs.unlinkSync(path, err => {
									console.log('file deleting err', err);
								});
							} else {
								console.log('file accessing err', err);
							}
						});
					});

					return true;
				})
				.catch(err => {
					console.log(err, 'err');
					return false;
				});
		});
	},
	BAN_USER_BY_ID: async (id, status) => {
		await User.update(
			{ status_participate: status },
			{
				where: {
					id: id,
				},
			},
		);
	},
	GET_USER_DATA_BY_ID: async id => {
		const user = await User.findOne({ where: { id: id } }, { raw: true });
		return user.status_participate;
	},
	ACTIVE_ALL_USERS: () => {
		User.update({ status_participate: 0 }, { where: {} });
	},
};
