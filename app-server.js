// import express from "express";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.routes.js";
// import { authenticate } from "./middleware/auth.middleware.js";

// dotenv.config();

// const app = express();
// app.use(express.json());

// app.use("/auth", authRoutes);

// app.get("/protected", authenticate, (req, res) => {
//   res.json({
//     message: "You accessed protected data",
//     user: req.user,
//   });
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
//import express from "express";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.routes.js";
// import { authenticate } from "./middleware/auth.middleware.js";
// import prisma from "./prismaClient.js";
// dotenv.config();

// const app = express();
// app.use(express.json());

// app.use("/auth", authRoutes);
// app.use(authenticate)
// app.get("/orders", async (req, res) => {
//   try {
//     const userId = req.user.userId; 

//     const orders = await prisma.order.findMany({
//       where: {
//         UserID: userId
//       },
//       include: {
//         items: {
//           include: {
//             product: true
//           }
//         },
//         payments: true
//       }
//     });

//     res.json({
//       message: "Orders fetched successfully",
//       orders
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }});
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
// import express from "express";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.routes.js";
// import { authenticate } from "./middleware/auth.middleware.js";
// import { authorize } from "./middleware/authorize.middleware.js";
// import prisma from "./prismaClient.js";

// dotenv.config();

// const app = express();
// app.use(express.json());

// app.use("/auth", authRoutes);

// //  AUTHENTICATION + AUTHORIZATION
// app.get(
//  "/orders",
//   authenticate,
//   authorize("USER", "ADMIN"),
//   async (req, res) => {
//     try {
//       const userId = req.user.userId;

//       const orders = await prisma.order.findMany({
//         where: { UserID: userId },
//         include: {
//           items: { include: { product: true } },
//           payments: true
//         }
//       });

//       res.json({
//         message: "Orders fetched successfully",
//         orders
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// );

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// import express from "express";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.routes.js";
// import orderRoutes from "./routes/order.routes.js";

// dotenv.config();

// const app = express();
// app.use(express.json());

// app.use("/auth", authRoutes);
// app.use("/orders", orderRoutes);

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });
// import express from "express";
// import session from "express-session";
// import cookieParser from "cookie-parser";
// import csrf from "csurf";

// import Routes from "./Routes.js";

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "session_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false 
//     }
//   })
// );

// export const csrfProtection = csrf({ cookie: true });

// app.use("/api", Routes);

// export default app;
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import jwt from "jsonwebtoken";

 

const env = process.env.NODE_ENV || "development";

dotenv.config({
  path: `.env.${env}`
});
import prisma from "./prismaClient.js";



const app = express();
app.use(express.json());
app.use("/auth", authRoutes);


app.get("/orders", async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).send("No token provided");
    }

    const decoded = jwt.verify(
      decodeURIComponent(token),
      process.env.JWT_ACCESS_SECRET
    );

    //  ENFORCE AUTHORIZATION HERE
    if (decoded.role !== "USER") {
      return res.status(403).send("Admins only");
    }

    const orders = await prisma.order.findMany({
      where: { UserID: decoded.userId }
    });

    res.send(`
      <h2>Your Orders</h2>
      <pre>${JSON.stringify(orders, null, 2)}</pre>
    `);
  } catch (err) {
    res.status(401).send("Invalid or expired token");
  }
});


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
