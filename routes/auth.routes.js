// import express from "express";
// import jwt from "jsonwebtoken";

// const router = express.Router();

// router.post("/login", (req, res) => {
//   const { username } = req.body;

//   if (!username) {
//     return res.status(400).json({ error: "Username required" });
//   }

//   const token = jwt.sign(
//     { username },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );

//   res.json({ token });
// });

// export default router;
// import express from "express";
// import { register, login } from "../controllers/auth.controller.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);

// export default router;

// import express from "express";
// import { register, login } from "../controllers/auth.controller.js";
// import { validate } from "../middleware/validate.js";
// import { registerSchema, loginSchema } from "../validators/auth.schema.js";

// const router = express.Router();

// router.post("/register", validate(registerSchema), register);
// router.post("/login", validate(loginSchema), login);

// export default router;
import express from "express";
import { login, refresh, logout } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);

export default router;
