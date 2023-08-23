const express = require("express")
const app = express()
const WSserver = require("express-ws")(app)
const cors = require("cors")
const fs = require("fs")
const path = require("path")
const aWss = WSserver.getWss() 
const PORT = 5000
app.use(cors())
app.use(express.json())
app.ws("/",(ws,req)=>{
    ws.on("message",(msg)=>{
        msg = JSON.parse(msg)
        switch(msg.method){
            case "connection":
                connerctionHandler(ws, msg)
            case "draw":
                broadCastConnection(ws, msg)
                break
        }
    })
})

app.post("/image", (req,res)=>{
    try{
        const data = req.body.img.replace("data:image/png;base64,", "")
        // const jsonData = req.body.json
        fs.writeFileSync(path.resolve(__dirname, "files", req.query.id + ".jpg"), data, "base64")
        // fs.writeFileSync(path.resolve(__dirname, "files", req.query.id + ".json"), jsonData)
        return res.status(200).json({message:"Загружено"})
    }catch(e){
        console.log(e)
        return res.status(500).json("error")
    }
})
app.get("/image", (req,res)=>{
    try{
        const file = fs.readFileSync(path.resolve(__dirname, "files", req.query.id + ".jpg"))
        const data = "data:image/png;base64," + file.toString("base64")
        // const jsonData = JSON.parse(fs.readFileSync(path.resolve(__dirname, "files", req.query.id + ".json")))
        return res.json(data)
    }catch(e){
        console.log(e)
        return res.status(500).json("error")
    }
})

app.listen(PORT, ()=>{
    console.log(PORT)
})

const connerctionHandler = (ws,msg)=>{
    ws.id = msg.id
    broadCastConnection(ws, msg)
}
const broadCastConnection = (ws,msg)=>{
    aWss.clients.forEach(client=>{
        if(client.id === msg.id){
            client.send(JSON.stringify(msg))
        }
    })
}