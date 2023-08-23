import React, { useEffect, useRef, useState } from 'react'
import "../styles/canvas.scss"
import CanvasState from '../store/CanvasState'
import ToolState from '../store/ToolState'
import Brush from '../tools/Brush'
import Rect from '../tools/Rect'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useParams} from "react-router-dom"
import axios from "axios"
import Circle from '../tools/Circle'
import Line from '../tools/Line'
import Eraser from '../tools/Eraser'
const Canvas = () => {
    const params = useParams()
    const canvasRef = useRef()
    const  usernameRef = useRef()
    const [isShow,setShow] = useState(true)
    useEffect(()=>{
      const ctx = canvasRef.current.getContext("2d")
        CanvasState.setCanvas(canvasRef.current)
        axios.get(`http://localhost:5000/image?id=${params.id}`)
          .then(resp =>{
            let img = new Image()
            img.src = resp.data
            img.onload = ()=>{
                ctx.clearRect(0,0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(img,0,0,canvasRef.current.width, canvasRef.current.height)
            }
          })
    }, [ ])
    useEffect(()=>{
      if(CanvasState.username){
          const socket = new WebSocket("ws://localhost:5000/")
          socket.onopen = ()=>{
            ToolState.setTool(new Brush(canvasRef.current,params.id,socket))
            CanvasState.setSesionId(params.id)
            CanvasState.setSocket(socket)
            socket.send(JSON.stringify({
              id: params.id,
              username: CanvasState.username,
              method: "connection"
            }))
          }
          socket.onmessage = (event)=>{
            const msg = JSON.parse(event.data)
            if(msg.method === "connection"){
              console.log(`Пользователь ${msg.username} подключился`)
            }
            if(msg.method === "draw"){
              drawHandler(msg)
            }
          }
      }

    }, [CanvasState.username])
    const drawHandler = (msg)=>{
      const ctx = canvasRef.current.getContext("2d")
      const figure = msg.figure
      switch(figure.type){
              case "brush":
                Brush.staticDraw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
                break
              case "finish":
                ctx.beginPath()
                break
              case "rect":
                Rect.staticDraw(ctx,figure.x, figure.y, figure.width,figure.height, figure.strokeColor,figure.fillColor, figure.lineWidth )
                break
              case "circle":
                Circle.staticDraw(ctx,figure.x, figure.y,figure.height, figure.strokeColor,figure.fillColor, figure.lineWidth )
                break
              case "line":
                Line.staticDraw(ctx,figure.x, figure.y,figure.startX,figure.startY , figure.strokeColor,figure.fillColor, figure.lineWidth )
                break
              case "eraser":
                Eraser.staticDraw(ctx,figure.x, figure.y, figure.lineWidth )
                break
              case "undo":
                CanvasState.Undo(figure.undo)
                break
              case "redo":
                CanvasState.Redo(figure.redo)
                break
            }                
      
    }
    const onMouseUp = ()=>{
      CanvasState.pushToUndo(canvasRef.current.toDataURL())
      axios.post(`http://localhost:5000/image?id=${params.id}`, {
        img:CanvasState.canvas.toDataURL(),
        // json:JSON.stringify({
        //   undo: CanvasState.undo,
        //   redo: CanvasState.redo
        // })
      })
    }
    const connectionHandler = ()=>{
      CanvasState.setUsername(usernameRef.current.value)
      setShow(false)
    }
  return (
    <div className='canvas'>
        <Modal show={isShow} onHide={()=>{}}>
          <Modal.Header closeButton>
            <Modal.Title>Введите свое имя</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="text" style={{width:"100%"}} ref={usernameRef}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={connectionHandler}>
              Войти
            </Button>
          </Modal.Footer>
        </Modal>
        <canvas
          onMouseUp={()=> onMouseUp()}
          width={600} 
          height={400} 
          ref={canvasRef}/>
    </div>
  )
}

export default Canvas