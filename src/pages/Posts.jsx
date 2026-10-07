import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import './Profile.css';

export default function Posts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getPosts()
      .then((data) => {
        if (cancelled) return;
        setPosts(Array.isArray(data) ? data : []);
      })
      .catch((err) => !cancelled && setError(err.message || "Не удалось загрузить посты"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <h1 className="hero__title">Там, где мир начинается с путешествий</h1>
      </section>

      <div className="container">
        {loading && <Spinner />}
        {!loading && !error && posts.length === 0 && (
          <div className="page-status">Пока нет ни одной истории. Станьте первым!</div>
        )}
        {posts.length > 0 && (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
        {user && (
          <div className="posts__cta">
            <Link to="/posts/new" className="btn btn--primary btn--lg">
              Добавить моё путешествие
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
