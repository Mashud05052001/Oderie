import { Router } from "express";
import { AuthRoutes } from "../model/auth/auth.route";

const router = Router();

const moduleRoutes = [{ path: "/auth", element: AuthRoutes }];

moduleRoutes.forEach((route) => router.use(route.path, route.element));

export const AllRoutes = router;
