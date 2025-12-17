import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {
    console.log("VALIDATION ERROR:", err);

    if (err instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: err.errors
      });
    }

    return res.status(400).json({
      message: "Validation error",
      errors: [{ message: "Unknown validation error" }]
    });
  }
};
