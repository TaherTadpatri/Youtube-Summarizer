import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter ,Routes,Route} from "react-router-dom";
import LinkVideo from './Components/LinkVideo.jsx';
import MainPage from './Components/MainPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route  path="/" element={<App />}/>
      <Route  path='/link' element={<LinkVideo/>}/>
      <Route path='/mainPage' element={<MainPage/>} />
    </Routes>
  </BrowserRouter>
    

)
