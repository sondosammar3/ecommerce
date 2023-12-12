import cartModel from "../../../DB/model/cart.model.js"
import couponModel from "../../../DB/model/coupon.model.js";
import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import userModel from "../../../DB/model/user.model.js";

export const createOrder = async (req, res, next) => {
    const { couponName } = req.body;

    // check cart
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart || cart.products.length==0) {
        return next(new Error('cart is empty', { cause: 400 }));
    }
    req.body.products = cart.products;

    // check coupon
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName });

        if (!coupon) {
            return next(new Error('coupon not found', { cause: 404 }));
        }
        const currentDate = new Date();
        if (coupon.expireDate <= currentDate) {
            return next(new Error('this coupon has expired', { cause: 400 }));
        }

        if (coupon.usedBy.includes(req.user._id)) {
            return next(new Error('coupon already used', { cause: 409 }));
        }
        req.body.coupon = coupon;
    }
    let subTotals = 0;
    const finalProductList = [];
    for (let product of req.body.products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity }
        });

        if (!checkProduct) {
            return next(new Error('Product quantity not available', { cause: 402 }));
        }

        product = product.toObject();
        product.name = checkProduct.name;
        product.unitPrice = checkProduct.price;
        product.discount = checkProduct.discount;
        product.finalPrice = product.quantity * checkProduct.finalPrice;
        subTotals += product.finalPrice;
        finalProductList.push(product);
    }
    const user = await userModel.findById(req.user.id);

    const order = await orderModel.create({
        userId: req.user.id,
        products: finalProductList,
        finalPrice: subTotals - ((subTotals * req.body.coupon?.amount || 0) / 100),
        address: req.body?.address || user.address,
        phoneNumber: req.body?.phone || user.phone,
        couponName: req.body.couponName ?? ''
    })

    for (const product of req.body.products) {
        await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -product.quantity } });
    }

    if (req.body.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user.id } }); //addToSet : add without dublicate
    }
    await cartModel.updateOne({ userId: req.user.id }, { products: [] });

    return res.status(201).json({ message: "success", order });
}

export const cancelOrder=async(req,res,next) =>{
const {orderId}=req.params
const order=await orderModel.findOne({_id:orderId,userId:req.user._id})
if(!order){
    return next(new Error('invalid order',{cause:404}))
}
if(order.status!='pending'){
    return next(new Error('cant cancel this order',{cause:404}))

}
req.body.status='cancelled'
req.body.updateBy=req.user._id;
const newOrder=await orderModel.findByIdAndUpdate(orderId,req.body,{new:true})

for (const product of order.products) {
    await productModel.updateOne({ _id: product.productId }, { $inc: { stock:product.quantity } });
}
if (order.couponName) {
    await couponModel.updateOne({ _id: req.body.coupon._id }, { $pull: { usedBy: req.user.id } }); //addToSet : add without dublicate
}

return res.json({message:"success",newOrder})
}

export const getOrder=async(req,res,next)=>{
const order=await orderModel.find({userId:req.user._id})
return res.json({message:"success",order})

}