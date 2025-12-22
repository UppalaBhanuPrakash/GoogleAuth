// export const authorize = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user || !req.user.role) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: "You do not have permission to perform this action"
//       });
//     }

//     next();
//   };
// };
// export const authorize = (...allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: "Forbidden: insufficient permissions"
//       });
//     }

//     next();
//   };
// };
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource"
      });
    }

    next();
  };
};


