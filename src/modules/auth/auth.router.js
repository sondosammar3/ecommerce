import { Router } from "express";
const router = Router();
import * as authController from './auth.controller.js'
import Upload, { fileValidation } from "../../services/multer.js";

import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validators from './auth.validation.js'

router.post('/signup', Upload(fileValidation.image).single('proPicture'), validation(validators.signup), asyncHandler(authController.signUp));
router.post('/signin', validation(fileValidation.signin), asyncHandler(authController.signin));
router.get('/confirmEmail/:token', validation(fileValidation.confirmEmail), asyncHandler(authController.confirmEmail));
router.patch('/sendCode', validation(fileValidation.sendCode), asyncHandler(authController.sendCode));
router.patch('/forgetPassword', validation(fileValidation.forgetPassword), asyncHandler(authController.forgetPassword));
router.delete('/deleteInvalidConfirm', asyncHandler(authController.deleteInvalidConfirm))


export default router;