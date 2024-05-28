import connectDB from '../../DB/connection.js';
import categoryRouter from './category/category.router.js';
import productRouter from './product/product.router.js';
import authRouter from './auth/auth.router.js';
import subcategoryRouter from './subcategory/subcategory.router.js';
import couponRouter from './coupon/coupon.router.js';
import orderRouter from './order/order.router.js';
import cartRouter from './cart/cart.router.js'
import userRouter from './user/user.router.js'
import cors from 'cors'
import { globalErrorHandler } from '../services/errorHandling.js';
import xlsx from 'xlsx'
const initApp = (app, express) => {
    app.use(express.json());
    /* app.use(async(req,res,next)=>{
   let whitelist =['http://www.tariq.com']
   if(!whitelist.includes(req.header('origin'))){
   return next(new Error('invalid'),{cause:404})
   }else{
   next();
}})*/

    connectDB();
    app.use(cors())
    app.use('/userPdf',express.static('./'))
    app.use('/category', categoryRouter);
    app.use('/product', productRouter);
    app.use('/auth', authRouter);
    app.use('/subcategory', subcategoryRouter);
    app.use('/coupon', couponRouter);
    app.use('/cart', cartRouter);
    app.use('/order', orderRouter);
    app.use('/user',userRouter)
    app.get('/', (req, res) => res.status(200).json({ message: "welcome" }));
    app.use('*', (req, res) => res.status(500).json({ message: "Page not found" }));

    app.use(globalErrorHandler);
}

export default initApp;