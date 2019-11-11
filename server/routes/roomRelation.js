const express = require('express');
const router = express.Router();
const passport = require('passport');

const RoomRelation = require('../models/RoomRelation');
const Message = require('../models/Message');
const _ = require('../../node_modules/lodash');
const Sequelize = require('sequelize');
const fs = require('fs');

const {
	createErrorObject,
	checkCreateRoomFields,
} = require('../middleware/authenticate');

/**URLs */
const chatStorageUrl = '../chat_storage/';
const uploadUrl = chatStorageUrl + 'upload/';

/**
 * @description POST /api/RoomRelation
 * id : touser
 * status: status
 */
// , Sequelize.and({
// 'user': req.user.id,
// 'touser': req.params.user_id
// }))
router.post(
	'/',
	passport.authenticate('jwt', {
		session: false,
	}),
	async (req, res) => {
		const arr = await RoomRelation.findOrCreate({
			where: {
				room: req.body.room,
				user: req.body.user,
			},
		});
		const instance = arr[0]; // the first element is the instance

		const pRelation = RoomRelation.update(
			{
				status: req.body.status,
			},
			{
				where: {
					id: instance.id,
				},
			}
		);

		const messages = await Message.findAll(
			{
				where: {
					user: req.body.user,
					room: req.body.room,
				},
			},
			{
				raw: true,
			}
		);
		const pMessages = Message.destroy({
			where: {
				user: req.body.user,
				room: req.body.room,
			},
		});
		Promise.all([pRelation, pMessages])
			.then(pRelation => {
				const msgUrls = messages
					.filter(msg => msg.content.includes('!!!image!!!'))
					.map(function(obj) {
						return uploadUrl + obj.content.substring(11);
					});
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

				res.status(200).send({
					status: true,
				});
			})
			.catch(err => {
				console.log('err', err);
			});
	}
);
module.exports = router;
