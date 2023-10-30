let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "https://technotes-52tj.onrender.com",
        methods: ["POST", "GET", "PUT", "OPTIONS", "HEAD", "DELETE","PATCH],
        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
