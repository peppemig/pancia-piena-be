const admin = require("firebase-admin");
const creds = require("../firebase/creds.json");

admin.initializeApp({
  credential: admin.credential.cert(creds),
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
