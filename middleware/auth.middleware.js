// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     console.log("JWT_SECRET:", process.env.JWT_SECRET);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; 
//     next();
//   } catch (err) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };
// import jwt from "jsonwebtoken";
// import prisma from "../prismaClient.js";

// export const authenticate = async (req, res, next) => {
//   const header = req.headers.authorization;

//   if (!header) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = header.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await prisma.authUser.findUnique({
//       where: { id: decoded.userId }
//     });

//     if (!user || !user.isActive) {
//       return res.status(401).json({ message: "User disabled" });
//     }

//     req.user = { userId: user.id };
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
// import jwt from "jsonwebtoken";

// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "No token provided" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//     req.user = decoded; // { userId }
//     next();
//   } catch {
//     return res.status(401).json({ message: "Access token expired or invalid" });
//   }
// };
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Must be: Authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Access token expired or invalid"
    });
  }
};
