import { ThemeProvider } from "./components/ThemeProvider"
import { ThemeToggle } from "./components/ThemeToggle"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CreatePost from "./pages/CreatePost"
import PostDetail from "./pages/PostDetail"
import VerifyEmail from "./pages/VerifyEmail"
import RequestPasswordReset from "./pages/RequestPasswordReset"
import ResetPassword from "./pages/ResetPassword"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={<CreatePost />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/request-password-reset" element={<RequestPasswordReset />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App 