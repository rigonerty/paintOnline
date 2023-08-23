import {makeAutoObservable} from "mobx"

class ToolState{
    tool = null
    strokeColor = "black"
    fillColor= "black"
    lineWidth= 1
    constructor(){
        makeAutoObservable(this)
    }
    setTool(tool){
        this.tool=tool
    }
    setFillColor(color){
        this.tool.fillColor =color
        this.fillColor= color
    }
    setStrokeColor(color){
        this.tool.strokeColor=color
        this.strokeColor = color
    }
    setLineWidth(number){
        this.tool.lineWidth= number
        this.lineWidth= number
    }
}
export default new ToolState()