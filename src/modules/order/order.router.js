import { Router } from 'express';
import auth from "../../middleware/auth.js";
import * as orderController from './order.controller.js';
import * as validatores from './order.validation.js';
import { validation } from '../../middleware/validation.js';
import { endPoint } from './order.endpoint.js';
import { asyncHandler } from '../../services/errorHandling.js';
import * as orderSchema from './order.validation.js';
const router = Router();


router.post('/', auth(endPoint.create),validation(orderSchema.create), asyncHandler(orderController.createOrder));
router.get('/',auth(endPoint.create),asyncHandler(orderController.getOrder))

router.patch('/cancel/:orderId',auth(endPoint.cancel),asyncHandler(orderController.cancelOrder))
router.patch('/changeOrderStatus/:orderId',auth(endPoint.change),asyncHandler(orderController.changeStatus))
export default router;