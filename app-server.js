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
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";
import prisma from "./prismaClient.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/orders", authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: {
        UserID: userId
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payments: true
      }
    });

    res.json({
      message: "Orders fetched successfully",
      orders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
