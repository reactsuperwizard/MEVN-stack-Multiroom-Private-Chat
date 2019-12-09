/** Dotenv Environment Variables */
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

/** Connect to MongoDB */
// const mongoose = require('mongoose');
// require('./db/mongoose');

/** Built In Node Dependencies */
const path = require('path');
const fs = require('fs');

/** Logging Dependencies */
const morgan = require('morgan');
// const winston = require('winston');
const { logger } = require('./config/logModule');

/** Passport Configuration */
const passport = require('passport');
require('./config/passport')(passport);

/** Express */
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
// const helmet = require('helmet');
// const enforce = require('express-sslify');
// const compression = require('compression');
const schedule = require('node-schedule');
/** Socket IO */
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const {
	GET_USER_DATA_BY_ID,
	ADD_MESSAGE,
	ADD_PRIVATE_MESSAGE,
	GET_USER_SOCKET,
	GET_ROOMS,
	GET_ROOM_USERS,
	FILTER_ROOM_USERS,
	CREATE_MESSAGE_CONTENT,
	ACTIVE_ALL_USERS,
} = require('./actions/socketio');

const { DELETE_STICKY_ROOM } = require('./actions/cronjob');

const FloodProtection = require('./helpers/flood-protection');
const { JOIN_ROOM, BAN_USER } = require('./helpers/socketEvents');

var j = schedule.scheduleJob(
	{
		rule: '*/60000 * * * * *',
	},
	function() {
		DELETE_STICKY_ROOM();
	},
);
/**URLs */
const chatStorageUrl = '../chat_storage/';
const roomAvatarUrl = chatStorageUrl + 'room_avatar/';

/** Routes */
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/profile');
const roomRoutes = require('./routes/room');
const relationRoutes = require('./routes/relation');
const roomRelationRoutes = require('./routes/roomRelation');
const privateMsgRoutes = require('./routes/privateMsg');
const adsenseRoutes = require('./routes/adsense');

/** Middleware */
app.use(
	morgan('combined', {
		stream: fs.createWriteStream('logs/access.log', {
			flags: 'a',
		}),
	}),
);
app.use(morgan('dev'));

// if (process.env.NODE_ENV === 'production') {
//     /** Trust Proto Header for heroku */
//     app.enable('trust proxy');
//     app.use(helmet());
//     app.use(enforce.HTTPS({ trustProtoHeader: true }));
// }

// app.use(compression());

app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);
app.use(bodyParser.json());

// file url
app.use('/public', express.static(path.resolve(__dirname, '../chat_storage')));

app.use(passport.initialize());
app.use(expressValidator());
app.use(cors());
app.set('io', io);

/** Routes Definitions */
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/profile', profileRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/relation', relationRoutes);
app.use('/api/roomRelation', roomRelationRoutes);
app.use('/api/privateMsg', privateMsgRoutes);
app.use('/api/adsense', adsenseRoutes);

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple()
//         })
//     );
// }

let userTypings = {};
let clients = [];
/** Socket IO Connections */
io.on('connection', socket => {
	let currentRoomId = null;
	const floodProtection = new FloodProtection({
		rate: process.env.maxMsgCount,
		per: process.env.floodUnit,
	});
	clients.push({ id: socket.id, func: floodProtection });
	/** Socket Events */
	socket.on('disconnect', async () => {
		if (currentRoomId) {
			/** Filter through users and remove user from user list in that room */
			const roomState = await FILTER_ROOM_USERS({
				roomId: currentRoomId,
				socketId: socket.id,
			});
			GET_ROOM_USERS({ room: { id: currentRoomId } }).then(getRoomUsers => {
				socket.broadcast
					.to(currentRoomId)
					.emit('updateUserList', JSON.stringify(getRoomUsers));
			});

			GET_ROOMS().then(getRooms => {
				socket.broadcast.emit(
					'updateRooms',
					JSON.stringify({
						room: getRooms,
					}),
				);
			});

			socket.broadcast.to(currentRoomId).emit(
				'receivedNewMessage',
				JSON.stringify(
					await ADD_MESSAGE({
						room: {
							id: roomState.previous.id,
						},
						user: null,
						content: CREATE_MESSAGE_CONTENT(roomState, socket.id),
						admin: true,
					}),
				),
			);
		}
	});
	/** Join User in Room */
	socket.on('userJoined', data => {
		currentRoomId = data.room.id;
		data.socketId = socket.id;
		JOIN_ROOM(socket, data);
	});
	// socket.on('getUserList_Relation', data => {
	// 	// const clientIds = io.sockets.clients();
	// 	// console.log('socketIds', clientIds);
	// 	Object.keys(io.sockets.sockets).forEach(function(id) {
	// 		console.log('ID:', id); // socketId
	// 	});
	// 	// socket.broadcast.emit('getUserList_Relation', clientIds);
	// 	// GET_USER()
	// 	// 	.then(users => {
	// 	// 		users.filter(function(user) {
	// 	// 			this.indexOf(e.socketid) > 0;
	// 	// 		}, clientIds);
	// 	// 	})
	// 	// 	.catch(err => console.log('err', err));
	// });

	/** Request User Exit Room */
	socket.on('exitRoom', data => {
		currentRoomId = null;
		socket.leave(data.room.id, async () => {
			socket.to(data.room.id).emit(
				'updateRoomData',
				JSON.stringify({
					room: data.room,
				}),
			);

			/** Update room list count */
			socket.broadcast.emit(
				'updateRooms',
				JSON.stringify({
					room: await GET_ROOMS(),
				}),
			);

			io.to(data.room.id).emit(
				'receivedUserExit',
				JSON.stringify({
					room: data.room,
				}),
			);

			/** Send Exit Message back to room */
			socket.broadcast
				.to(data.room.id)
				.emit('receivedNewMessage', JSON.stringify(await ADD_MESSAGE(data)));
		});
	});

	/**Room admin requests to exit the user */
	socket.on('exitUserRoom', async data => {
		currentRoomId = null;
		const socketId = await GET_USER_SOCKET(data.exitUser);
		const Usocket = io.sockets.connected[socketId];

		socket.to(data.room.id).emit(
			'updateRoomData',
			JSON.stringify({
				room: data.room,
			}),
		);

		/** Update room list count */
		socket.broadcast.emit(
			'updateRooms',
			JSON.stringify({
				room: await GET_ROOMS(),
			}),
		);

		io.to(data.room.id).emit(
			'receivedUserExit',
			JSON.stringify({
				room: data.room,
			}),
		);

		/** Send Exit Message back to room */
		socket.broadcast
			.to(data.room.id)
			.emit('receivedNewMessage', JSON.stringify(await ADD_MESSAGE(data)));
		Usocket.leave(data.room.id);
	});

	socket.on('removeUserTyping', data => {
		if (userTypings[data.room.id]) {
			if (userTypings[data.room.id].includes(data.user.handle)) {
				userTypings[data.room.id] = userTypings[data.room.id].filter(
					handle => handle !== data.user.handle,
				);
			}
		}

		socket.broadcast
			.to(data.room.id)
			.emit('receivedUserTyping', JSON.stringify(userTypings[data.room.id]));
	});

	/** New Message Event */
	socket.on('newMessage', async data => {
		const client = clients.find(client => client.id == socket.id);
		if (await GET_USER_DATA_BY_ID(data.user.id)) {
			return;
		}
		if (client.func.check()) {
			if (data.room.access && !data.select) {
				//public message arrived
				const newMessage = await ADD_MESSAGE(data);

				// Emit data back to the client for display
				io.to(data.room.id).emit(
					'receivedNewMessage',
					JSON.stringify(newMessage),
				);
			} else {
				//private message arrived
				const newMessage = await ADD_PRIVATE_MESSAGE(data);

				// Emit data to the select client for display
				if (newMessage) {
					io.to(newMessage['touser']['socketid']).emit(
						'receivedNewMessage',
						JSON.stringify(newMessage),
					);
					io.to(newMessage['user']['socketid']).emit(
						'receivedNewMessage',
						JSON.stringify(newMessage),
					);
					io.to(newMessage['touser']['socketid']).emit(
						'msgAlertTriggered',
						JSON.stringify(newMessage),
					);
				}
			}
		} else {
			io.to(await GET_USER_SOCKET(data.user.id)).emit(
				'msgAlertTriggered',
				JSON.stringify({
					trig: true,
					content: `You are posting a lot. Wait for ${Math.ceil(
						process.env.BAN_TIME / 60000,
					)} minutes before you can post again`,
				}),
			);
			BAN_USER(data.user.id);
		}
	});
	/** New Image Message Event */
	socket.on('newMessage_image', async data => {
		const newMessage = await ADD_MESSAGE(data);

		// Emit data back to the client for display
		io.to(data.room.id).emit('receivedNewMessage', JSON.stringify(newMessage));
	});

	/** Room Deleted Event */
	socket.on('roomDeleted', async data => {
		io.to(data.room.id).emit('receivedNewMessage', JSON.stringify(data));
		io.to(data.room.id).emit('roomDeleted', JSON.stringify(data));
		io.emit('roomListUpdated', JSON.stringify(data));
	});

	/** Room Added Event */
	socket.on('roomAdded', async data => {
		io.emit('roomAdded', JSON.stringify(data));
	});
	/** Room Updated Event */
	socket.on('roomUpdateEvent', async data => {
		io.in(data.room.id).emit('roomUpdated', JSON.stringify(data));
		io.emit('roomNameUpdated', JSON.stringify(data));
	});
	/** User Register Event */
	socket.on('UserRegistered', async data => {
		io.emit('UserRegistered', '');
		GET_ROOMS().then(getRooms => {
			socket.broadcast.emit(
				'updateRooms',
				JSON.stringify({
					room: getRooms,
				}),
			);
		});
	});
	/** User Edited Event */
	socket.on('userEdited', async data => {
		io.emit('userListUpdated', '');
	});
	/** User Status Change Event */
	socket.on('statusChanged', async data => {
		const socketid = await GET_USER_SOCKET(data.touser);
		if (socketid) {
			io.to(socketid).emit(
				'statusChanged',
				JSON.stringify({
					user: data.user,
					status: data.status,
				}),
			);
		}
	});

	socket.on('roomRelationChanged', async data => {
		//public message arrived
		const content = await CREATE_MESSAGE_CONTENT(
			data.room,
			{
				user: data.user,
				status: data.status,
			},
			1,
		);

		const newMessage = await ADD_MESSAGE({
			room: {
				id: data.room,
			},
			user: null,
			content: content,
			admin: true,
		});

		// Emit data back to the client for display
		io.to(data.room).emit('receivedNewMessage', JSON.stringify(newMessage));
		io.to(data.room).emit(
			'roomRelationChanged',
			JSON.stringify({
				user: data.user,
				status: data.status,
			}),
		);
	});

	/** User Deleted Event */
	socket.on('UserDeleted', async data => {
		io.emit('userListUpdated', '');
		socket.broadcast.emit(
			'updateRooms',
			JSON.stringify({
				room: await GET_ROOMS(),
			}),
		);
	});
});
/** Serve static assets if production */
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.resolve(__dirname, '../client', 'dist')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
//     });
// }

if (process.env.NODE_ENV !== 'test') {
	server.listen(process.env.PORT || 5000, () => {
		logger.info(`[LOG=SERVER] Server started on port ${process.env.PORT}`);
		ACTIVE_ALL_USERS();
	});
}

module.exports = {
	app,
};
