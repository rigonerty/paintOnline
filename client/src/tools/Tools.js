export default class Tools{
    constructor(canvas, id, socket){
        this.canvas = canvas;
        this.id = id;
        this.socket = socket;
        this.ctx = canvas.getContext("2d")
        this.destroyEvents()

    }

    set fillColor(color){
        this.ctx.fillStyle = color
    }
    set strokeColor(color){
        this.ctx.strokeStyle = color
    }
    set lineWidth(number){
        this.ctx.lineWidth = number
    }

    destroyEvents(){
        this.canvas.onmousedown =  null
        this.canvas.onmouseup = null
        this.canvas.onmousemove =  null
    }
}