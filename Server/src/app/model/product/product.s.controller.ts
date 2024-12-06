import httpStatus from "http-status";
import { TImageFiles } from "../../interface/image.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductService } from "./product.service";

const createProduct = catchAsync(async (req, res, next) => {
  console.log(req.files, req.body);

  const result = await ProductService.createProduct(
    req.body,
    req.extendedUserData,
    req.files as TImageFiles
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product is created successfully",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'All Products are retrieved successfully',
  //     data: result,
  // });
});

const getSingleProduct = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Product is retrieved successfully',
  //     data: result,
  // });
});

const updateProduct = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Product is updated successfully',
  //     data: result,
  // });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  // const result =
  // sendResponse(res, {
  //     statusCode: httpStatus.OK,
  //     success: true,
  //     message: 'Product is deleted successfully',
  //     data: result,
  // });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
