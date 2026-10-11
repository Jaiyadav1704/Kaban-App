import express from "express";
import { createColumn, getColumn } from "../Controller/columnController.js";
import protect from "../middleware/authMiddleware.js";

const columnroute = express.Router();

columnroute.post("/create-column",protect,createColumn);
columnroute.get("/get-columns/:boardId",protect,getColumn);

export default columnroute;