const {
	BAN_USER_BY_ID,
	ADD_MESSAGE,
	GET_MESSAGES,
	GET_PRIVATE_MESSAGES,
	UPDATE_ROOM_USERS,
	UPDATE_PRIVATE_USER,
	GET_ROOMS,
	GET_ROOM_USERS,
} = require('../actions/socketio');

module.exports = {
	JOIN_ROOM: (socket, data) => {
		if (data.room.access) {
			//public room join
			socket.join(data.room.id, async () => {
				/** Get list of messages to send back to client */
				const dateNow = Date.now();

				Promise.all([GET_MESSAGES(data), UPDATE_ROOM_USERS(data)])
					.then(value => {
						const messages = value[0];
						const room = value[1];

						socket.emit(
							'updateRoomData',
							JSON.stringify({
								messages: messages,
								room: room,
							}),
						);
						return ADD_MESSAGE({
							room: data.room,
							user: null,
							content: data.content,
							admin: data.admin,
						});
					})
					.then(addMessage => {
						/** Emit back the message */
						socket.broadcast
							.to(data.room.id)
							.emit('receivedNewMessage', JSON.stringify(addMessage));
						GET_ROOM_USERS(data).then(getRoomUsers => {
							/** Get Room to update user list for all other clients */
							socket.broadcast
								.to(data.room.id)
								.emit('updateUserList', JSON.stringify(getRoomUsers));
						});
					});
				GET_ROOMS().then(getRooms => {
					/** Emit event to all clients in the roomlist view except the sender */
					socket.broadcast.emit(
						'updateRooms',
						JSON.stringify({
							room: getRooms,
						}),
					);
				});
			});
		} else {
			//set user's new socket id
			UPDATE_PRIVATE_USER(data);
		}
	},
	BAN_USER: data => {
		BAN_USER_BY_ID(data, 1);
		setTimeout(function() {
			BAN_USER_BY_ID(data, 0);
		}, process.env.BAN_TIME);
	},
};
