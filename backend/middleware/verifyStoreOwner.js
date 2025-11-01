import jwt from "jsonwebtoken";

const verifyStoreOwner = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  try {
    const secret = process.env.JWT_SECRET || "your_secret_key";
    const decoded = jwt.verify(token, secret);

    // Ensure only STORE_OWNER can access
    if (decoded.role !== "STORE_OWNER") {
      return res.status(403).json({ error: "Access denied: Store owners only" });
    }

    // Attach user info for use in controller
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export default verifyStoreOwner;
