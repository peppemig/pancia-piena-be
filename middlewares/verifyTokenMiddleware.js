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

module.exports = auth;
