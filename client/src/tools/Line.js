import Tools from "./Tools";
import ToolState from "../store/ToolState";
export default class Line extends Tools{
    constructor(canvas,id,socket){
        super(canvas,id,socket);
        this.listen()
    }

    listen(){
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }
    draw(x,y){
        let img = new Image()
        img.src = this.saved
        img.onload = ()=>{
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img,0,0,this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.startX,this.startY)
            this.ctx.lineTo(x,y)            
            this.ctx.stroke()
        }
        
    }
    static staticDraw(ctx,x,y,startX,startY, strokeColor, fillColor,lineWidth){
        ctx.beginPath()
        ctx.moveTo(startX,startY)
        ctx.lineTo(x,y)            
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
                type:"line",
                x: this.currentX,
                y: this.currentY,
                startX: this.startX,
                startY: this.startY,
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
            this.currentX = e.pageX - e.target.offsetLeft
            this.currentY = e.pageY - e.target.offsetTop
            this.draw(this.currentX, this.currentY)
        }
    }
}