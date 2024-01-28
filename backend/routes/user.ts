import { Request, Response, Router } from "express";
import { User } from "../db";
import zod from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const userRoutes = Router();

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
    const userId = user?._id;
    const token = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET || ""
    );
    res.status(200).json({
      token: token,
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
