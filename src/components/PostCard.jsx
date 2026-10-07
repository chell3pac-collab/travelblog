import { Link } from "react-router-dom";
import { assetUrl } from "../api/client";
import './PostCard.css';
import './btn.css';

export default function PostCard({ post }) {
  const meta = post.country || post.city
    ? `${post.country || ""}${post.country && post.city ? ", " : ""}${post.city || ""}`
    : "";
  return (
    <article className="post-card">
      <Link to={`/posts/${post.id}`} className="post-card__photo-link">
        {post.photo ? (
          <img className="post-card__photo" src={assetUrl(post.photo)} alt={post.title} loading="lazy" />
        ) : (
          <div className="post-card__photo post-card__photo--empty">🌍</div>
        )}
      </Link>
      <div className="post-card__body">
        <h2 className="post-card__title">
          {post.title}
        </h2>
          <p className="post-card__excerpt">{post.excerpt}</p>
          <div className="wrapper">
          {meta && <p className="post-card__meta">{meta}</p>}
          <Link to={`/posts/${post.id}`} className="post-card__more">
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
