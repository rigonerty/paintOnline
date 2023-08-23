import React,{ useState } from 'react'
import "../styles/toolbar.scss"
import ToolState from '../store/ToolState'
import Brush from '../tools/Brush'
import CanvasState from '../store/CanvasState'
import Rect from '../tools/Rect'
import Circle from '../tools/Circle'
import Eraser from '../tools/Eraser'
import Line from '../tools/Line'

export const ToolBar = () => {
  const changeColor = (e)=>{
    ToolState.setFillColor(e.target.value)
    ToolState.setStrokeColor(e.target.value)
  }
  const download = ()=>{
    const dataUrl = CanvasState.canvas.toDataURL()
    const a = document.createElement("a")
    console.log(dataUrl)
    a.href = dataUrl
    a.download = CanvasState.sesionId +".jpg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

  }
  const [isActive,setActive] = useState("brush")
  return (
    <div className='toolbar'>
        <button 
          className={"toolbar__btn brush "+(isActive === "brush"? "active":"")}
          onClick={()=>{
            ToolState.setTool(new Brush(CanvasState.canvas, CanvasState.sesionId, CanvasState.socket))
            setActive("brush")
          }}></button>
        <button
          className={"toolbar__btn rect "+(isActive === "rect"? "active":"")}
          onClick={()=>{
            ToolState.setTool(new Rect(CanvasState.canvas, CanvasState.sesionId, CanvasState.socket))
            setActive("rect")
          }}></button>
        <button
          className={"toolbar__btn circle "+(isActive === "circle"? "active":"")}
          onClick={()=>{
            ToolState.setTool(new Circle(CanvasState.canvas, CanvasState.sesionId, CanvasState.socket))
            setActive("circle")
          }}></button>
        <button
          className={"toolbar__btn eraser "+(isActive === "eraser"? "active":"")}
          onClick={()=>{
            ToolState.setTool(new Eraser(CanvasState.canvas, CanvasState.sesionId, CanvasState.socket))
            setActive("eraser")
          }}></button>
        <button
          className={"toolbar__btn line "+(isActive === "line"? "active":"")}
          onClick={()=>{
            ToolState.setTool(new Line(CanvasState.canvas, CanvasState.sesionId, CanvasState.socket))
            setActive("line")
          }}></button>
        <input type='color' onChange={e=> changeColor(e)} className='toolbar__inp'/>
        <button className='toolbar__btn undo' onClick={()=>{
          CanvasState.socketSendUndo()
        }}></button>
        <button className='toolbar__btn redo' onClick={()=>{
          CanvasState.socketSendRedo()
        }}></button>
        <button className='toolbar__btn save' onClick={()=>download()}></button>
    </div>
  )
}
