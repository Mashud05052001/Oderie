import { Router } from "express";
// Pleast put first alphabet smallercase carefully
// import { ProductValidation } from "./Product.validation";
import validateRequest from "../../middleware/validateRequest";
import { ProductController } from "./product.s.controller";
import { ProductValidation } from "./product.validation";
import { multerUpload } from "../../config/multer.config";
import validateImageFileRequest from "../../middleware/validateImageFileRequest";
import { ImageFilesOfArrayValidationSchema } from "../../zod/image.validation";
import { parseBody } from "../../middleware/bodyParser";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/",
  auth("VENDOR"),
  multerUpload.fields([{ name: "files", maxCount: 4 }]),
  validateImageFileRequest(ImageFilesOfArrayValidationSchema, false),
  parseBody,
  validateRequest(ProductValidation.create),
  ProductController.createProduct
);

router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getSingleProduct);
router.patch("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export const ProductRoutes = router;
