import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { UserProvider } from './context/UserContext';
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Polls from "./pages/Polls"
import MyIdeasPage from "./pages/MyIdeas"
import PollPage from "./pages/Poll"
import PollAdd from "./pages/PollAdd"
import IdeaAdd from "./pages/IdeaAdd"
import Profile from "./pages/Profile"
import Search from "./components/features/search/Search"
import Ideas from "./components/features/ideas/Ideas"
import { Toaster } from "react-hot-toast";
import Footer from "./components/layout/Footer"
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";


function AppContent() {
  const { theme } = useTheme();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: theme === "dark" ? "rgb(43, 39, 55)" : "#ffffff",
            color: theme === "dark" ? "#e8eaf6" : "#111111",
            border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb",
            backdropFilter: "blur(12px)",
          },
          success: {
            iconTheme: {
              primary: "#9BC53D",
              secondary: theme === "dark" ? "rgb(43,39,55)" : "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: theme === "dark" ? "rgb(43,39,55)" : "#ffffff",
            },
          },
        }}
      />
      <UserProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-polls" element={<ProtectedRoute><Polls /></ProtectedRoute>} />
                <Route path="/my-ideas" element={<ProtectedRoute><MyIdeasPage /></ProtectedRoute>} />
                <Route path="/polls/:uuid" element={<ProtectedRoute><PollPage /></ProtectedRoute>} />
                <Route path="/add-poll" element={<ProtectedRoute><PollAdd /></ProtectedRoute>} />
                <Route path="/add-idea" element={<ProtectedRoute><IdeaAdd /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/polls/:uuid/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/polls/:uuid/ideas" element={<ProtectedRoute><Ideas title={""} budget={0} /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}