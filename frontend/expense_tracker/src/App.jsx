import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expense from './pages/Dashboard/Expense'
import UserProvider from './context/userContext'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Home />} />
            <Route path="/income" exact element={<Income />} />
            <Route path="/expense" exact element={<Expense />} /> 
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: '13px',
          },
        }}
      />
    </UserProvider>
      
  )
}

export default App;

const Root = () => {
  //Kiểm tra token trong localStorage
  const isAuthenticated = !!localStorage.getItem('token');

  //Chuyển hướng sang dashboard nếu được xác thực, không thì quay lại login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  )
};
