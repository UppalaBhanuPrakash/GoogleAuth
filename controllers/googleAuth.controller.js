import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { email, name } = ticket.getPayload();

    let user = await prisma.authUser.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.authUser.create({
        data: {
          email,
          username: name,
          provider: "GOOGLE",
          role: "USER",
          isActive: true
        }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User disabled" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.authUser.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    //  ROLE-BASED REDIRECT
    if (user.role === "USER") {
      return res.redirect(
        `https://googleauth-1-clzg.onrender.com/orders?token=${encodeURIComponent(accessToken)}`
      );
    }

    return res.status(403).json({
      message: "Only ADMIN users can access orders"
    });

  } catch (err) {
    return res.status(401).json({ message: "Google authentication failed" });
  }
};
