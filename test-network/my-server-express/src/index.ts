import express, { Request, Express, Response } from "express"
import configViewEngine from "./Config/configViewEngine";
import initAPIRoute from "./Routers/router"
import * as dotenv from "dotenv";
import { ledgerService } from "./Sevices/ledgerServices";
import { buildCAClient } from "./Sevices/fabricCAServices";
import { PrismaClient } from "@prisma/client";
import { initData } from "./Prisma/initDB";
dotenv.config();


const port: number = Number(process.env.PORT || '1111');
const frontEndHost: string = process.env.FRONT_END_HOST || 'http://192.168.1.96:5173';
console.log(frontEndHost);
const app: Express = express();
app.use(function (req: Request , res: Response, next) {
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, Params');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if(req.method == 'OPTIONS'){
        res.end();
    }
    next();
});


configViewEngine(app);
initAPIRoute(app);

initData();

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
