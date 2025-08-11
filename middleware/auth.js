const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  try {
    // 1) Ensure secret is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET missing in environment');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    // 2) Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization || '';
    let token = '';

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]?.trim();
    }
    // Optional: also check cookie if you plan to support it
    if (!token && req.cookies && req.cookies.token) {
      token = (req.cookies.token || '').trim();
    }

    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    // 3) Remove accidental wrapping quotes (common when copy/pasting)
    if ((token.startsWith('"') && token.endsWith('"')) ||
        (token.startsWith("'") && token.endsWith("'"))) {
      token = token.slice(1, -1);
    }

    // 4) Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // e.g., { id, username, iat, exp }
    return next();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('JWT verify error:', err?.name, err?.message);
    }
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    if (err?.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

