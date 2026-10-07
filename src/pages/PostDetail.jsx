import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPost, getComments } from "../api/posts";
import { useAuth } from "../context/AuthContext";
import { assetUrl } from "../api/client";
import Spinner from "../components/Spinner";
import './PostDetail.css';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    async function load() {
      try {
        const data = await getPost(id);
        if (cancelled) return;
        setPost(data);

        let list = [];
        try {
          const fetched = await getComments(id);
          list = Array.isArray(fetched) ? fetched : [];
        } catch {
          list = Array.isArray(data?.comments) ? data.comments : [];
        }
        if (!cancelled) setComments(list);
      } catch (err) {
        if (!cancelled) setError(err.status === 404 ? "Пост не найден" : err.message || "Не удалось загрузить пост");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Spinner />;
  if (!post) return null;

  const paragraphs = (post.full_description || "")
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <section className="page-hero">
        <h1 className="page-hero__title">Истории ваших путешествий</h1>
      </section>
      <div className="container">
        {post.photo && <img className="post-detail__photo" src={assetUrl(post.photo)} alt={post.title} />}
        <div className="post-detail__wrapper">
          <article className="post-detail">
            <h2 className="post-detail__title">{post.title}</h2>
            <div className="post-detail__text">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </article>

          <section className="comments">
            <div className="comments__list">
              {comments.length === 0 && <p className="comments__empty">Пока нет отзывов — будьте первым!</p>}
              {comments.map((c, i) => (
                <div className="comment" key={c.id || `${c.created_at}-${i}`}>
                  <div className="comment__head">
                    <span className="comment__name">{c.author_name || "Путешественник"}</span>
                    <span className="comment__date">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="comment__text">{c.comment}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="back-row">
            <button type="button" className="btn btn--yellow-outline" onClick={() => navigate(-1)}>
              <span className="btn__arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.47001 12.5301C3.32956 12.3895 3.25067 12.1988 3.25067 12.0001C3.25067 11.8013 3.32956 11.6107 3.47001 11.4701L9.47001 5.47009C9.53867 5.3964 9.62147 5.3373 9.71347 5.29631C9.80547 5.25532 9.90479 5.23328 10.0055 5.2315C10.1062 5.22972 10.2062 5.24825 10.2996 5.28597C10.393 5.32369 10.4778 5.37983 10.549 5.45105C10.6203 5.52227 10.6764 5.60711 10.7141 5.70049C10.7519 5.79388 10.7704 5.89391 10.7686 5.99461C10.7668 6.09532 10.7448 6.19463 10.7038 6.28663C10.6628 6.37863 10.6037 6.46143 10.53 6.53009L5.81001 11.2501H20C20.1989 11.2501 20.3897 11.3291 20.5303 11.4698C20.671 11.6104 20.75 11.8012 20.75 12.0001C20.75 12.199 20.671 12.3898 20.5303 12.5304C20.3897 12.6711 20.1989 12.7501 20 12.7501H5.81001L10.53 17.4701C10.6037 17.5388 10.6628 17.6216 10.7038 17.7136C10.7448 17.8056 10.7668 17.9049 10.7686 18.0056C10.7704 18.1063 10.7519 18.2063 10.7141 18.2997C10.6764 18.3931 10.6203 18.4779 10.549 18.5491C10.4778 18.6203 10.393 18.6765 10.2996 18.7142C10.2062 18.7519 10.1062 18.7705 10.0055 18.7687C9.90479 18.7669 9.80547 18.7449 9.71347 18.7039C9.62147 18.6629 9.53867 18.6038 9.47001 18.5301L3.47001 12.5301Z" fill="#FFA902" />
                </svg>
              </span> Назад
            </button>
            {user ? (
              <div className="comments__cta">
                <Link to={`/posts/${id}/review`} className="btn btn--primary">
                  Ваше впечатление об этом месте
                </Link>
              </div>
            ) : (
              <p className="comments__hint">Оставлять отзывы могут только авторизованные пользователи.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
}
