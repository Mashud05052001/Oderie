import { Router } from "express";
import { AuthRoutes } from "../model/auth/auth.route";
import { CategoryRoutes } from "../model/category/category.route";
import { ProductRoutes } from "../model/product/product.route";
import { FollowRoutes } from "../model/follow/follow.route";

const router = Router();

const moduleRoutes = [
  { path: "/auth", element: AuthRoutes },
  { path: "/category", element: CategoryRoutes },
  { path: "/product", element: ProductRoutes },
  { path: "/follow", element: FollowRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.element));

export const AllRoutes = router;
