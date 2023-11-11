import React from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login';

function App() {
  return (
  <BrowserRouter>
    <Routes>
        <Route exact path='/' element={<Login/>}/>
        <Route exact path="/home" element = {<Home/>}/>
    </Routes>
  </BrowserRouter> 
  );
}

export default App;
