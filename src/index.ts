import express, { Request, Response } from "express";
import cors from "cors";
import connectToMongoDb, { db } from "./api/db/index";
import { ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? +process.env.PORT : 3001;
const app = express();

app.use(cors());

connectToMongoDb();

app.get("/", (_req: Request, res: Response): void => {
  try {
    res.json({
      msg: "It's workin'!",
    });
  } catch (x) {
    console.error(x);
    res.json({ error: x });
  }
});

app.get("/item/all", async (_req: Request, res: Response): Promise<void> => {
  try {
    const allItems = await db.collection("posts").find().toArray();
    res.json({ docs: allItems });
  } catch (x) {
    console.error(x);
    res.json({ error: x });
  }
});

app.get("/item/:id", async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const singleItem = await db
      .collection("posts")
      .find({ _id: new ObjectId(id) })
      .toArray();
    res.json({ result: singleItem });
  } catch (x) {
    console.error(x);
    res.json({ error: x });
  }
});

app.listen(PORT, (): void => {
  console.log("And we're rolling on port", PORT);
});

export default app;
