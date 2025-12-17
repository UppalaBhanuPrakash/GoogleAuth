// import express from "express";
// import { authenticate } from "../middleware/auth.middleware.js";
// import { validate } from "../middleware/validate.js";
// import { createOrderSchema } from "../validators/order.schema.js";
// import { createOrder, getOrders } from "../controllers/order.controller.js";

// const router = express.Router();

// router.post(
//   "/",
//   authenticate,
//   validate(createOrderSchema),
//   createOrder
// );

// router.get(
//   "/",
//   authenticate,
//   getOrders
// );

// export default router;
import express from "express";
import prisma from "../prismaClient.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

/* ADMIN → view all orders */
router.get(
  "/all",
  authenticate,
  authorize("ADMIN"),
  async (req, res) => {
    const orders = await prisma.order.findMany();
    res.json(orders);
  }
);

/* USER / ADMIN → view own orders */
router.get(
  "/",
  authenticate,
  authorize("USER", "ADMIN"),
  async (req, res) => {
    const orders = await prisma.order.findMany({
      where: {
        UserID: req.user.userId
      }
    });
    res.json(orders);
  }
);

export default router;
