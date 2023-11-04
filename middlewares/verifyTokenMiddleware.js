const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.GOOGLE_PROJECT_ID,
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    privateKey: process.env.GOOGLE_PRIVATE_KEY,
  }),
});

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, msg: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const authUser = await admin.auth().verifyIdToken(token);
    req.user = {
      id: authUser.user_id,
      email: authUser.email,
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, msg: "Not authenticated" });
  }
};

const socketAuth = async (socket, next) => {
  if (!socket.handshake.query && !socket.handshake.query.token) {
    next(new Error("Not authenticated"));
  }

  const token = socket.handshake.query.token;

  try {
    const authUser = await admin.auth().verifyIdToken(token);
    socket.user = authUser.user_id;
    next();
  } catch (error) {
    next(new Error("Not authenticated"));
  }
};

module.exports = { auth, socketAuth };
