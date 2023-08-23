import Tools from "./Tools";
import ToolState from "../store/ToolState";
export default class Eraser extends Tools{
    constructor(canvas,id,socket){
        super(canvas,id,socket);
        this.listen()
    }

    listen(){
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    static staticDraw(ctx,x,y,lineWidth){
        ctx.lineTo(x,y)
        ctx.strokeStyle = "white"
        ctx.stroke()
        ctx.lineWidth = lineWidth
    }
    mouseDownHandler(e){
        this.mouseDown = true
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            method:"draw",
            id:this.id,
            figure:{
                type:"finish",
            }
        }))
    }
    mouseMoveHandler(e){
        if(this.mouseDown){
            this.socket.send(JSON.stringify({
                method:"draw",
                id:this.id,
                figure:{
                    type:"eraser",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    lineWidth: ToolState.lineWidth
                }
            }))
        }
    }
}