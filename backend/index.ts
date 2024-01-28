import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { routes } from "./routes";
import cors from "cors";

const PORT = 3000 || process.env.PORT;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log("Port Running on ", PORT);
});
