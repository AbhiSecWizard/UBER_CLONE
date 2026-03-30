const socketIo = require('socket.io');
const userModel = require('./src/models/user.model');
const captainModel = require('./src/models/captain.model');

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // Testing ke liye fast, production mein specific URL rakhein
            methods: ['GET', 'POST'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`New Connection: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (!userId || !userType) {
                console.log("❌ Join failed: Missing userId or userType");
                return;
            }

            // Room join karwana (UserId hi room name hai)
            socket.join(userId);
            console.log(`👤 User ${userId} joined room. Type: ${userType}`);

            try {
                if (userType === 'user') {
                    const updatedUser = await userModel.findByIdAndUpdate(userId, 
                        { socketId: socket.id }, 
                        { new: true } 
                    );
                    console.log(`✅ User DB Updated: ${updatedUser._id}`);
                } else if (userType === 'captain') {
                    const updatedCaptain = await captainModel.findByIdAndUpdate(userId, 
                        { socketId: socket.id }, 
                        { new: true }
                    );
                    console.log(`✅ Captain DB Updated: ${updatedCaptain._id}`);
                }
            } catch (err) {
                console.error("❌ DB Update Error:", err.message);
            }
        });

        socket.on('disconnect', async () => {
            console.log(`🔌 Disconnected: ${socket.id}`);
            // Captain ko inactive mark karna
            await captainModel.findOneAndUpdate(
                { socketId: socket.id }, 
                { status: 'inactive' }
            );
        });
    });
};

const sendMessageToSocketId = (targetId, messageObject) => {
    if (io) {
        // targetId yahan Database ki _id hai kyunki humne socket us room mein join karwaya hai
        io.to(targetId).emit(messageObject.event, messageObject.data);
    }
};

module.exports = { initializeSocket, sendMessageToSocketId };