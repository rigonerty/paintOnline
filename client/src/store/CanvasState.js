import {makeAutoObservable} from "mobx"

class CanvasState{
    canvas = null
    undo = []
    redo=[]
    username = ""
    sesionId = null
    socket = null
    constructor(){
        makeAutoObservable(this)
    }
    setSocket(socket){
        this.socket = socket
    }
    setSesionId(sesionId){
        this.sesionId = sesionId
    }
    setUsername(username){
        this.username = username
    }
    setCanvas(canvas){
        this.canvas=canvas
    }
    pushToUndo(data){
        this.undo.push(data)
    }
    pushToRedo(data){
        this.redo.push(data)
    }
    Undo(undo){
        const ctx = this.canvas.getContext("2d")
        this.undo = undo
        if(this.undo.length){
            const dataUrl = this.undo.pop()
            this.redo.push(this.canvas.toDataURL())
            this.newImg(ctx,dataUrl)
        }else{
            ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        }
    }
    Redo(redo){
        this.redo = redo
        const ctx = this.canvas.getContext("2d")
        if(this.redo.length){
            const dataUrl = this.redo.pop()
            this.undo.push(this.canvas.toDataURL())
            this.newImg(ctx,dataUrl)
        }
    }
    newImg(ctx, dataUrl){
        const img = new Image()
        img.src= dataUrl
        img.onload = ()=>{
            ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
            ctx.drawImage(img,0,0,this.canvas.width, this.canvas.height)
        }
    }
    socketSendUndo(){
        this.socket.send(JSON.stringify({
                method:"draw",
                id: this.sesionId,
                figure:{
                    type: "undo",
                    undo: this.undo
                }
            }))
    }
    socketSendRedo(){
        this.socket.send(JSON.stringify({
                method:"draw",
                id: this.sesionId,
                figure:{
                    type: "redo",
                    redo: this.redo
                }
            }))
    }
}
export default new CanvasState()