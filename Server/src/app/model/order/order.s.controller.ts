import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderService } from "./order.service";
import { OrderStatus } from "@prisma/client";
import pick from "../../utils/pick";
import { OrderFilterItems } from "./order.constant";
import { paginateProps } from "../../constant/model.constant";

const createOrder = catchAsync(async (req, res) => {
  const result = await OrderService.createOrder(req.body, res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Name is created successfully",
    data: result,
  });
});

const changeOrderStatus = catchAsync(async (req, res) => {
  let status: OrderStatus = "CANCELLED";
  if (req?.query.status === "DELIVERED") status = "DELIVERED";
  const result = await OrderService.changeOrderStatus(
    req.params?.id,
    req.extendedUserData,
    { status }
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Order status successfully changed to ${status.toLowerCase()}`,
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const filters = pick(req.query, OrderFilterItems);
  const options = pick(req.query, paginateProps);
  const result = await OrderService.getAllOrders(
    req.extendedUserData,
    filters,
    options
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All orders retrieved successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  changeOrderStatus,
  getAllOrders,
};
