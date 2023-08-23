import React from 'react'
import "../styles/toolbar.scss"
import ToolState from '../store/ToolState'


const SettingBar = () => {
    const changeColor = (e)=>{
    ToolState.setStrokeColor(e.target.value)
  }
  return (
    <div className='settingbar'>
      <label htmlFor='settingbar__line__width' className='settingbar__width'>Толщина линии:</label>
      <input
        onChange={(e)=> ToolState.setLineWidth(e.target.value)}
        type='number' 
        id='settingbar__line__width'
        className='settingbar__width'
        max={50}
        min={1}
        defaultValue={1}
      />
      <label htmlFor='settingbar__line_color' className='settingbar__width'>Цвет линии:</label>
      <input type='color' id='settingbar__line_color' onChange={e=> changeColor(e)} className='settingbar__width'/>
    </div>
  )
}

export default SettingBar