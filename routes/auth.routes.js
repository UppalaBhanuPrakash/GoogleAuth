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
// import express from "express";
// import { login, refresh, logout } from "../controllers/auth.controller.js";
// import { authenticate } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.post("/login", login);
// router.post("/refresh", refresh);
// router.post("/logout", authenticate, logout);

// export default router;

// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import prisma from "../prismaClient.js";

// const router = express.Router();

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const match = await bcrypt.compare(password, user.passwordHash);
//   if (!match) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   const accessToken = jwt.sign(
//     { userId: user.id, role: user.role },
//     process.env.JWT_ACCESS_SECRET,
//     { expiresIn: "15m" }
//   );

//   res.json({ accessToken });
// });

// export default router;
import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const router = express.Router();

router.get("/google", (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

  res.redirect(url);
});


router.get("/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ message: "No authorization code" });
  }

  try {
    //  Exchange code for token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    //  Get user info
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name } = userInfo.data;

    //  Find or create user
    let user = await prisma.authUser.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.authUser.create({
        data: {
          email,
          username: name,
          role: "USER",
          isActive: true,
        },
      });
    }

    //  CREATE accessToken FIRST
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.authUser.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return res.redirect(
      `http://localhost:3000/orders?token=${encodeURIComponent(accessToken)}`
    );

  } catch (err) {
    console.error("Google OAuth error:", err.message);
    return res.status(500).json({ message: "Google authentication failed" });
  }
});

export default router;
