import slugify from "slugify";
import categoryModel from "../../../DB/model/category.model.js";
import cloudinary from "../../services/cloudinary.js";
import { pagination } from "../../services/pagination.js";
import productModel from "../../../DB/model/product.model.js";

export const getCategories = async (req, res) => {

    const categories = await categoryModel.find().populate('subcategory');

    return res.status(201).json({ message: "success", categories });
}

export const getActiveCategoies = async (req, res) => {
    const {skip,limit}=pagination(req.query.page,req.query.limit)

    const categories = await categoryModel.find({ status: "Active" }).skip(skip).limit(limit).select("name image");
    return res.status(200).json({ message: "success",count:categories.length, categories });
}
export const getSpecificCategory = async (req, res) => {
    const { id } = req.params;
    const category = await categoryModel.findById(id);
    if(!category){
        return res.status(404).json({ message: "not found" });

    }
    return res.status(201).json({ message: "success", category });
}
export const createCategory = async (req, res) => {
   
    const name = req.body.name.toLowerCase();
    const category = await categoryModel.findOne({ name });
    if (category) {
        return res.status(409).json({ message: "category name already exists" });
    }
    const slug = slugify(name);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.APP_Name}/categories`,
    });
    const newCategory = await categoryModel.create({ name, slug, image: { secure_url, public_id },
        createdBy:req.user.id, updatedBy: req.user.id });
    return res.status(201).json({ message: "success", newCategory });
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.status(404).json({ message: `invalid category id ${id} ` });
        }

        if (name) {
            if(await categoryModel.findOne({name,_id:{$ne:id._id} }))
            {
                return res.status(409).json({message: `category ${name} already exists`});
            }
            category.name = name;
            category.slug = slugify(name);
        }
        if(status){
            category.status = status;
        }

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_Name}/categories` })
            await cloudinary.uploader.destroy(category.image.public_id);
            category.image = { secure_url, public_id };
        }
        category.updatedBy = req.user.id;
        await category.save();

        return res.status(201).json({ message: "success", category });

    } catch (err) {
        return res.status(500).json({ message: "catch error", err })
    }

}

export const deleteCategory=async(req,res,next)=>{
  
    const {categoryId}=req.params
    await categoryModel.findByIdAndDelete(categoryId)
    if(!categoryId){
        return next(new Error (`category not found`,{cause:404}))

    }
    await productModel.deleteMany({categoryId})
    return res.status(200).json({message:"success"})

}