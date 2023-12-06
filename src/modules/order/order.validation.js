
import joi from 'joi'
export const create=joi.object({
    couponName:joi.string().required(),
    address:joi.string(),
    phone:joi.string()
})