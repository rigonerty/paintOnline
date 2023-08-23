import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import { ToolBar } from "./components/ToolBar";
import {BrowserRouter,Routes,Route, Navigate} from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/:id" element={
            <>
              <ToolBar/>
              <SettingBar/>
              <Canvas/>
            </>
          }/>
          <Route path='/*' element={<Navigate to={`f${(+new Date).toString(16)}`} replace/>}/>

        </Routes>

      </div>
    </BrowserRouter>

  );
}

export default App;
