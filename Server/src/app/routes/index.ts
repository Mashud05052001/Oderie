import { Router } from "express";
import { AuthRoutes } from "../model/auth/auth.route";
import { CategoryRoutes } from "../model/category/category.route";
import { ProductRoutes } from "../model/product/product.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", element: AuthRoutes },
  { path: "/category", element: CategoryRoutes },
  { path: "/product", element: ProductRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.element));

export const AllRoutes = router;
