import './App.css'
import Dashboard from './pages/Dashboard'
import { SignIn } from './pages/Signin'
import { SignUp } from './pages/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div> <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/share/:shareId" element={<Dashboard />} />
        </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
