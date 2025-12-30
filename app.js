// import categoryRoutes from "./category.routes.js";
// import productRoutes from "./product.routes.js";
// import userRoutes from "./user.routes.js";
// import orderRoutes from "./order.routes.js";
// import orderItemRoutes from "./orderItem.routes.js";
// import paymentRoutes from "./payment.routes.js";
// import express from "express";
// import jwt from "jsonwebtoken";
// const app = express();
// app.use(express.json());

// app.use("/categories", categoryRoutes);
// app.use("/products", productRoutes);
// app.use("/users", userRoutes);
// app.use("/orders", orderRoutes);
// app.use("/order-items", orderItemRoutes);
// app.use("/payments", paymentRoutes);
// app.post("/login",(req,res)=>{
//     const username=req.body.username;
// })
// app.listen(3000, () => console.log("Server running on port 3000"));
// app.js
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import jwt from "jsonwebtoken";
import prisma from "./prismaClient.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

//  ADD /orders HERE
app.get("/orders", async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).send("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    //  ADMIN ONLY
    if (decoded.role !== "ADMIN") {
      return res.status(403).send("Admins only");
    }

    const orders = await prisma.order.findMany({
      where: { UserID: decoded.userId }
    });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(401).send("Invalid or expired token");
  }
});

export default app;
