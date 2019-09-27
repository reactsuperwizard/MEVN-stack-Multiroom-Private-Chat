/** Dotenv Environment Variables */
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

/** Connect to MongoDB */
// const mongoose = require('mongoose');
// require('./db/mongoose');

/** Built In Node Dependencies */
// const path = require('path');
// const fs = require('fs');

/** Logging Dependencies */
// const morgan = require('morgan');
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

/** Socket IO */
const app = express();
const server = require('http').Server(app);
// const io = require('socket.io')(server);
// const {
//     ADD_MESSAGE,
//     UPDATE_ROOM_USERS,
//     GET_ROOMS,
//     GET_ROOM_USERS,
//     FILTER_ROOM_USERS,
//     CREATE_MESSAGE_CONTENT
// } = require('./actions/socketio');

// const { JOIN_ROOM } = require('./helpers/socketEvents');

/** Routes */
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/profile');
// const roomRoutes = require('./routes/room');
// const messageRoutes = require('./routes/messages');

/** Middleware */
// app.use(
//     morgan('combined', {
//         stream: fs.createWriteStream('logs/access.log', { flags: 'a' })
//     })
// );
// app.use(morgan('dev'));

// if (process.env.NODE_ENV === 'production') {
//     /** Trust Proto Header for heroku */
//     app.enable('trust proxy');
//     app.use(helmet());
//     app.use(enforce.HTTPS({ trustProtoHeader: true }));
// }

// app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(expressValidator());
app.use(cors());
// app.set('io', io);

/** Routes Definitions */
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/room', roomRoutes);
// app.use('/api/messages', messageRoutes);

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(
//         new winston.transports.Console({
//             format: winston.format.simple()
//         })
//     );
// }

/** Socket IO Connections */

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
    });
}

module.exports = { app };
