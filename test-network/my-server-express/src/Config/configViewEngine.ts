import express, { Express, Response, Request } from "express";
import bodyparser from "body-parser"
const configViewEngine = (app: Express) => {
    
    app.use(express.static('./src/public'))
    app.use(bodyparser.json({
        limit: '10mb'
    }))
    app.use(bodyparser.urlencoded({ extended: true, limit: '10mb' }))
    app.set("view engine", "ejs")
    app.set("views", "./src/views")
}

export default configViewEngine;