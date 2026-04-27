const stores = new Map();

const DEFAULT_MESSAGE = "Too many requests. Please try again later.";

const createRateLimiter = ({
  windowMs,
  max,
  message = DEFAULT_MESSAGE,
  keyGenerator,
}) => {
  if (!windowMs || !max) {
    throw new Error("windowMs and max are required for rate limiter");
  }

  return (req, res, next) => {
    const identifier =
      typeof keyGenerator === "function"
        ? keyGenerator(req)
        : `${req.ip}:${req.baseUrl}${req.path}`;
    const now = Date.now();
    const record = stores.get(identifier);

    if (!record || record.resetTime <= now) {
      stores.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.set("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({ message, retryAfter: retryAfterSeconds });
    }

    record.count += 1;
    stores.set(identifier, record);
    return next();
  };
};

module.exports = { createRateLimiter };
