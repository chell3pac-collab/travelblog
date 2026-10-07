import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import ReviewPage from "./pages/ReviewPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/posts/new" element={<RequireAuth><CreatePost /></RequireAuth>} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/:id/review" element={<RequireAuth><ReviewPage /></RequireAuth>} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="*" element={<div className="container"><div className="page-status">Страница не найдена</div></div>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
