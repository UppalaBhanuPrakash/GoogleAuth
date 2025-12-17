// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import prisma from "../prismaClient.js";

// export const register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const hash = await bcrypt.hash(password, 10);

//     const user = await prisma.authUser.create({
//       data: {
//         username,
//         email,
//         passwordHash: hash
//       }
//     });

//     res.status(201).json({
//       message: "User registered",
//       userId: user.id
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await prisma.authUser.findUnique({
//       where: { email }
//     });

//     if (!user || !user.isActive) {
//       return res.status(401).json({ message: "Invalid user" });
//     }

//     const isValid = await bcrypt.compare(password, user.passwordHash);

//     if (!isValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";


const generateAccessToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d"
  });

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.authUser.findUnique({ where: { email } });

  console.log("LOGGED IN USER:", {
    id: user?.id,
    email: user?.email,
    role: user?.role
  });
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.authUser.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  res.json({
    accessToken,
    refreshToken
  });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await prisma.authUser.findFirst({
      where: {
        id: payload.userId,
        refreshToken
      }
    });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // ✅ FIXED
    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};


export const logout = async (req, res) => {
  const { userId } = req.user;

  await prisma.authUser.update({
    where: { id: userId },
    data: { refreshToken: null }
  });

  res.json({ message: "Logged out successfully" });
};
