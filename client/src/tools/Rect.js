import Tools from "./Tools";
import ToolState from "../store/ToolState";

export default class Rect extends Tools{
    constructor(canvas,id,socket){
        super(canvas,id,socket);
        this.listen()
    }

    listen(){
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }
    draw(x,y,w,h){
        let img = new Image()
        img.src = this.saved
        img.onload = ()=>{
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img,0,0,this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.rect(x,y,w,h)
            this.ctx.fill()
            this.ctx.stroke()
        }

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
                    type:"rect",
                    x: this.startX,
                    y: this.startY,
                    width: this.width,
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
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX
            this.height = currentY - this.startY
            this.draw(this.startX, this.startY, this.width, this.height)
        }
    }
    static staticDraw(ctx,x,y,w,h,strokeColor,fillColor,lineWidth){
        ctx.fillStyle = fillColor
        ctx.strokeStyle = strokeColor
        ctx.beginPath()
        ctx.rect(x,y,w,h)
        ctx.fill()
        ctx.stroke()
        ctx.lineWidth = lineWidth
    }
}