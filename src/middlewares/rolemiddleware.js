function authorizeRoles(...allowedRoles) {
    
  return (req, res, next) => {
    const userRole = req.authUser?.role;

    if (!userRole) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Access denied'
      });
    }

    next();
  };
}

module.exports = authorizeRoles;