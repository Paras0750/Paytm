import { Request, Response, Router } from "express";
import { Account } from "../db";
import { ProtectRequest } from "./user";
import { authMiddleware } from "../middleware";
import mongoose from "mongoose";

const accountRoutes = Router();

// accountRoutes.get("/:accountName", (req: Request, res: Response) => {
//   const { accountName } = req.params;

//   res.send(accountName);
// });

accountRoutes.get("/balance", authMiddleware, async (req: ProtectRequest, res: Response) => {
  try {
    console.log(req.userId);

    const user = await Account.findOne({ userId: req.userId });
    console.log(user);

    res.status(200).json({
      message: `Current Balance: ${user?.balance}`,
      balance: user?.balance
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

accountRoutes.post("/transfer", authMiddleware, async (req: ProtectRequest, res: Response) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;
  console.log(amount, to);

  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);

  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  await session.commitTransaction();

  res.json({
    message: "Transfer successful",
  });
});

export default accountRoutes;
