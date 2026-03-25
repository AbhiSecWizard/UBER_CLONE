const socketIo = require('socket.io');
const userModel = require('./src/models/user.model');
const captainModel = require('./src/models/captain.model');

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:5173", 
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling'] 
    });

    io.on('connection', (socket) => {
        socket.on('join', async (data) => {
            const { userId, userType } = data;
            if (!userId || !userType) return;

            socket.join(userId);

            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, 
                        { socketId: socket.id }, 
                        { returnDocument: 'after' } // 🔥 Warning Fixed
                    );
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, 
                        { socketId: socket.id }, 
                        { returnDocument: 'after' } // 🔥 Warning Fixed
                    );
                }
            } catch (err) { console.log("DB Update Error:", err.message); }
        });

        socket.on('disconnect', async () => {
            // 🔥 Warning Fixed: findOneAndUpdate mein bhi 'returnDocument' dalo
            await captainModel.findOneAndUpdate(
                { socketId: socket.id }, 
                { status: 'inactive' },
                { returnDocument: 'after' } 
            );
        });
    });
};

const sendMessageToSocketId = (targetId, messageObject) => {
    if (io) {
        // targetId yahan Captain/User ki Database ID honi chahiye
        io.to(targetId).emit(messageObject.event, messageObject.data);
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };