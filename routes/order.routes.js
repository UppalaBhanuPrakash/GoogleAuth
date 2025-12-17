import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { createOrderSchema } from "../validators/order.schema.js";
import { createOrder, getOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createOrderSchema),
  createOrder
);

router.get(
  "/",
  authenticate,
  getOrders
);

export default router;
