import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { errorMiddleware } from "./middleware/errorMiddleware";
import productRoutes from "./routes/products";
import usersRoutes from "./routes/users";
import checkoutRoutes from "./routes/checkout";
import ordersRoutes from "./routes/orders";
import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/category";
import { webhook } from "./controllers/webhook";
import { v2 as cloudinary } from "cloudinary";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:4173", process.env.FRONTEND_URL || ""]
};
app.use(cors(corsOptions));
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.post("/webhook", express.raw({type: "application/json"}), webhook);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads/", express.static(path.join(process.cwd(), "/uploads/")));
app.use("/products", productRoutes);
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);

app.use(errorMiddleware);

app.listen({ address: "0.0.0.0", port: PORT }, () => {
    console.log(`Server running on port: ${PORT}`);
});