import Tools from "./Tools";
import ToolState from "../store/ToolState";

export default class Circle extends Tools{
    constructor(canvas,id,socket){
        super(canvas,id,socket);
        this.listen()
    }

    listen(){
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }
    draw(x,y,h){
        let img = new Image()
        img.src = this.saved
        img.onload = ()=>{
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img,0,0,this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x,y,h>0?h:h*(-1),0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }

    }
    static staticDraw(ctx,x,y,h, strokeColor, fillColor,lineWidth){
        ctx.beginPath()
        ctx.arc(x,y,h>0?h:h*(-1),0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.strokeStyle = strokeColor
        ctx.fillStyle = fillColor
        ctx.lineWidth = lineWidth
    }
    mouseDownHandler(e){
        this.mouseDown = true
        this.ctx.beginPath()
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }
    mouseUpHandler(e){
        this.mouseDown = false
        this.socket.send(JSON.stringify({
                method:"draw",
                id:this.id,
                figure:{
                    type:"circle",
                    x: this.startX,
                    y: this.startY,
                    height: this.height,
                    strokeColor: ToolState.strokeColor,
                    fillColor: ToolState.fillColor,
                    lineWidth: ToolState.lineWidth
                }
            }))
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
            let currentY = e.pageY - e.target.offsetTop;
            this.height = currentY - this.startY
            this.draw(this.startX, this.startY, this.height)
        }
    }
}