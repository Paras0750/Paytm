import { Router } from "express";
import userRoutes from "./user";
import accountRoutes from "./account";

const routes = Router();

routes.use("/user", userRoutes);
routes.use("/account", accountRoutes);

export { routes };
