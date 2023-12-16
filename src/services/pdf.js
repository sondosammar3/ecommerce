import pdf from "pdf-creator-node";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { options } from "./option.js";
const __filename=fileURLToPath(import.meta.url)
 const __dirname=dirname(__filename)

export  const createPdf =()=>{
    //let html = fs.readFileSync("pdf.html", "utf8");
   const htmlpath=join(__dirname,'../../templtes/pdf.html')
   const html=fs.readFileSync(htmlpath,"utf8")
   var document = {
    html: html,
    data: {},
    path: "./output.pdf",
   
  };
  pdf.create(document,options)
}