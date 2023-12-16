import { Router } from "express";
import * as reviewcontroller from './review.controller.js'
import auth from "../../middleware/auth.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router=Router({mergeParams:true})

router.post ('/',auth(['User']),asyncHandler(reviewcontroller.create))

export default router