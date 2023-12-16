import { Router } from "express";
import * as productController from './product.controller.js'
import fileUpload, { fileValidation } from "../../services/multer.js";
import auth from "../../middleware/auth.js";
import { endPoint } from "./product.endpoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './product.validation.js';
import reviewRouter from '../review/review.router.js'
const router = Router();
router.use('/:productId/review',reviewRouter)
router.get('/', asyncHandler(productController.getProducts));
router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 4 }
]), validation(validators.createProduct), asyncHandler(productController.createProduct))
router.get('/:productId/getProductsWithReview', asyncHandler(productController.getProductsWithReview));
export default router;