import { Product } from "@prisma/client";
import { TImageFiles } from "../../interface/image.interface";
import { TExtendedUserData } from "../../interface/jwt.type";
import { TProductCreate } from "./product.interface";
import { Prisma } from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createProduct = async (
  payload: TProductCreate,
  vendorData: TExtendedUserData,
  images: TImageFiles
) => {
  const category = await Prisma.category.findUnique({
    where: { id: payload.categoryId },
  });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "The category is not found");
  }
  const productData = {
    ...payload,
    vendorId: vendorData.vendorId as string,
    img: images.files.map((imgInfo) => imgInfo.path),
  };
  const result = await Prisma.product.create({ data: productData });

  return result;
};

const getAllProducts = async () => {};

const getSingleProduct = async () => {};

const updateProduct = async () => {};

const deleteProduct = async () => {};

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
