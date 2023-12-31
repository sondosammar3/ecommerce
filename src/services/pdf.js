import pdf from "pdf-creator-node";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { options } from "./option.js";
const __filename=fileURLToPath(import.meta.url)
 const __dirname=dirname(__filename)
/* let users = [
    {
      name: "Shyam",
      age: "26",
    },
    {
      name: "Navjot",
      age: "26",
    },
    {
      name: "Vitthal",
      age: "26",
    },
  ];*/
export  const createPdf =(users,filename,req,res)=>{
    //let html = fs.readFileSync("pdf.html", "utf8");
   const htmlpath=join(__dirname,'../../templtes/pdf.html')
   const html=fs.readFileSync(htmlpath,"utf8")
   var document = {
    html: html,
    data: {users},
    path: `./${filename}`,
   
  };
  pdf.create(document,options).then(()=>{
   return res.send(`<a href="${req.protocol}://${req.headers.host}/userPdf/${filename}">download</a>`)
  })
}