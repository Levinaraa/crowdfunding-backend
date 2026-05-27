console.log('AUTH MIDDLEWARE LOADED!');

const { verifyJwt } = require('../utils/authutils');

function authenticateToken(req, res, next) {
  console.log('CHECKING TOKEN:', req.headers.authorization ? 'YES' : 'NO');
  
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    console.log('NO BEARER TOKEN');
    return res.status(401).json({
      message: 'Bearer token diperlukan!'
    });
  }

  const token = authHeader.slice(7);
  console.log('VERIFYING TOKEN...');

  try {
    const payload = verifyJwt(token);
    req.authUser = {
      id: Number(payload.sub || payload.userId),
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
    console.log('AUTH Berhasil:', req.authUser.email);
    next();
  } catch (error) {
    console.log('TOKEN ERROR:', error.message);
    res.status(401).json({
      message: 'Token invalid: ' + error.message
    });
  }
}

module.exports = authenticateToken;