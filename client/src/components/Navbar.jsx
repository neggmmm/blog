import { Link } from "react-router-dom"
import { ThemeToggle } from "./ThemeToggle"
import { useAuth } from "../context/AuthContext"
import { Button } from "./ui/button"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar flex items-center justify-between px-6 py-4 border-b border-border bg-background/95">
      <div className="navbar-brand flex items-center gap-2">
        <Link to="/" className="navbar-logo text-2xl font-bold text-primary no-underline tracking-tight">
          BLOG
        </Link>
      </div>
      <div className="navbar-links flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <>
            <Link to="/create">
              <Button variant="outline">Create Post</Button>
            </Link>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
} 