import { Router } from "express";
import userRoutes from "./modules/user/userRoutes";
import purchaseRoutes from "./modules/purchase/purchaseRoutes";
import purchaseLocationRoutes from "./modules/purchaseLocation/purchaseLocationRoutes";
import paymentMethodRoutes from "./modules/paymentMethod/paymentMethodRoutes";
import categoryRoutes from "./modules/category/categoryRoutes";

const router = Router();

router.get("/", (req, res) => {
    res.send("Welcome to the API");
});

router.use("/users", userRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/purchaseLocation", purchaseLocationRoutes);
router.use("/paymentMethod", paymentMethodRoutes);
router.use("/category", categoryRoutes);

export default router;
