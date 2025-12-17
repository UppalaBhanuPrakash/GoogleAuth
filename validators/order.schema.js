import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    TotalAmount: z.number().positive(),
    Status: z.string(),
    items: z.array(
      z.object({
        ProductID: z.number(),
        Quantity: z.number().int().positive(),
        PriceAtPurchase: z.number().positive()
      })
    )
  })
});
