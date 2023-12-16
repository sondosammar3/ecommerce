import 'dotenv/config';
import express from 'express';
import initApp from './src/modules/app.router.js';
import {createPdf} from './src/services/pdf.js'
const app = express();
const PORT = process.env.PORT || 6000;

initApp(app, express);
createPdf()
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}....`);
});