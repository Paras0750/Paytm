import { Request, Response, Router } from "express";
import { Account, User } from "../db";
import zod from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware";
import { randomInt } from "crypto";
dotenv.config();

const userRoutes = Router();
export interface ProtectRequest extends Request {
  userId?: string;
}

userRoutes.get("/bulk", async (req: Request, res: Response) => {
  const filter = req.query.filter || "";
  console.log(filter);

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.status(200).json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

const updateBody = zod.object({
  password: zod.string().min(6),
  firstName: zod.string(),
  lastName: zod.string(),
});

userRoutes.post(
  "/update",
  authMiddleware,
  async (req: ProtectRequest, res: Response) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }
    const { password, firstName, lastName } = req.body;
    if (password.length < 6) {
      return res.status(411).json({
        message: "Password Length can't be smaller than 6 digits",
      });
    }
    try {
      await User.updateOne(
        { _id: req.userId },
        { firstName: firstName, lastName: lastName, password: password }
      );

      return res.status(200).json({
        message: "User Details updated successfully",
      });
    } catch (err) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
);

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

userRoutes.post("/signin", async (req: Request, res: Response) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      res.status(404).send("No User Found!");
    }

    if (req.body.password !== user?.password) {
      return res.status(401).send("Password Do Not Match!");
    }
    // token valid for 1 hour
    const userId = user?._id;

    const token = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET || "",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      username: user?.firstName,
    });
  } catch (err) {
    console.log(err);
    res.status(411).json({ message: "Internal Sever Error" });
  }
});

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

userRoutes.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  console.log(req.body);
  
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  await Account.create({
    userId: user._id,
    balance: randomInt(10000)
  })
  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET || ""
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

export default userRoutes;
