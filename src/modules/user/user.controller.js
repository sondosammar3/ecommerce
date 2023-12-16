import userModel from "../../../DB/model/user.model.js"
 export const getProfile=async(req,res)=>{
    const user=await userModel.findById(req.user._id)
    return res.status(200).json({message:"success",user})
 }


import XLSX from 'xlsx'
import { createPdf } from "../../services/pdf.js"
 export const  uploadUserExcel=async(req,res,next)=>{

   const workBook=XLSX.readFile(req.file.path);
   const worksheet = workBook.Sheets[workBook.SheetNames[0]];
   const user=XLSX.utils.sheet_to_json(worksheet)
   if (!await userModel.insertMany(user)){
      next (new Error('invalid',{cause:400}))
   }
  
   return res.status(201).json({message:"success"})
 }


 export const getUsers=async(req,res,next)=>{
    let users=await userModel.find({}).lean()
    await createPdf(users,'listusers.pdf',req,res)

 }