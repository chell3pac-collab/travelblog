import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createComment } from "../api/posts";
import FieldError from "../components/FieldError";
import './ReviewPage.css';

const NAME_MAX = 255;
const COMMENT_MAX = 600;

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullName: "", comment: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function validate() {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Напишите имя";
    else if (form.fullName.trim().length > NAME_MAX) e.fullName = "Максимум " + NAME_MAX + " символов";
    if (!form.comment.trim()) e.comment = "Добавьте текст отзыва";
    else if (form.comment.length > COMMENT_MAX) e.comment = "Максимум " + COMMENT_MAX + " символов";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setServerError("");
    const e = validate();
    setErrors(e);

    if (Object.keys(e).length) return;

    setSubmitting(true);
    try {
      await createComment(id, { fullName: form.fullName.trim(), comment: form.comment.trim() });

      setShowSuccessModal(true);

    } catch (err) {
      setServerError(err.message || "Не удалось отправить отзыв");
    } finally {
      setSubmitting(false);
    }
  }

  const closeAndRedirect = () => {
    setShowSuccessModal(false);
    navigate(`/posts/${id}`);
  };

  return (
    <>
      <section className="page-hero">
        <h1 className="page-hero__title">Истории ваших путешествий</h1>
      </section>

      <div className="container">
        <form className="review-form" onSubmit={handleSubmit} noValidate>
          <h2 className="review-form__title">Добавление отзыва</h2>
          {serverError && <p className="auth-card__error" role="alert">{serverError}</p>}
          <div className="review-form__wrapper">
            <label className="field">
              <span className="field__label">
                <span className="req">
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.18799 2.40806C6.18799 2.19806 6.10399 2.01606 5.93599 1.87606C5.76799 1.73606 5.57199 1.65206 5.36199 1.65206C5.08199 1.65206 4.71799 1.86206 4.28399 2.26806C3.97599 2.56206 3.63999 2.78606 3.28999 2.92606C3.31799 2.53406 3.42999 2.15606 3.59799 1.79206C3.79399 1.35806 3.90599 1.05006 3.90599 0.868056C3.90599 0.630057 3.82199 0.420056 3.68199 0.252056C3.51399 0.084056 3.31799 5.62668e-05 3.09399 5.62668e-05C2.85599 5.62668e-05 2.65999 0.084056 2.50599 0.252056C2.35199 0.420056 2.28199 0.630057 2.28199 0.868056C2.28199 1.05006 2.37999 1.35806 2.58999 1.79206C2.75799 2.15606 2.85599 2.53406 2.89799 2.92606C2.53399 2.78606 2.21199 2.56206 1.90399 2.26806C1.45599 1.86206 1.10599 1.65206 0.825994 1.65206C0.601994 1.65206 0.419994 1.73606 0.251994 1.87606C0.0839941 2.01606 -5.84498e-06 2.19806 -5.84498e-06 2.40806C-5.84498e-06 2.68806 0.0979942 2.89806 0.293994 3.05206C0.489994 3.22006 0.727994 3.29006 1.00799 3.29006C1.07799 3.29006 1.24599 3.27606 1.49799 3.24806C1.74999 3.22006 1.94599 3.20606 2.07199 3.20606C2.28199 3.20606 2.51999 3.23406 2.77199 3.27606C2.54799 3.52806 2.22599 3.78006 1.83399 4.00406C1.49799 4.20006 1.28799 4.34006 1.17599 4.43806C0.979994 4.63406 0.881994 4.87206 0.881994 5.12406C0.881994 5.34806 0.951994 5.54406 1.10599 5.68406C1.25999 5.85206 1.45599 5.92206 1.67999 5.92206C2.16999 5.92206 2.50599 5.48806 2.67399 4.62006C2.75799 4.17206 2.89799 3.79406 3.09399 3.50006C3.27599 3.79406 3.41599 4.17206 3.51399 4.62006C3.68199 5.48806 4.00399 5.92206 4.50799 5.92206C4.73199 5.92206 4.91399 5.85206 5.08199 5.68406C5.22199 5.54406 5.30599 5.34806 5.30599 5.12406C5.30599 4.87206 5.20799 4.63406 5.01199 4.43806C4.89999 4.34006 4.67599 4.20006 4.35399 4.00406C3.94799 3.78006 3.63999 3.52806 3.41599 3.27606C3.66799 3.23406 3.89199 3.20606 4.11599 3.20606C4.22799 3.20606 4.42399 3.22006 4.68999 3.24806C4.94199 3.27606 5.09599 3.29006 5.17999 3.29006C5.44599 3.29006 5.68399 3.22006 5.89399 3.05206C6.08999 2.89806 6.18799 2.68806 6.18799 2.40806Z" fill="#FF4D4F" />
                  </svg>
                </span> Ваше имя
              </span>
              <input
                type="text"
                className={errors.fullName ? "input--error" : ""}
                maxLength={NAME_MAX}
                placeholder="Ваше имя"
                value={form.fullName}
                onChange={(ev) => setForm({ ...form, fullName: ev.target.value })}
              />
              <FieldError error={errors.fullName} />
            </label>
            <label className="field">
              <span className="field__label">
                <span className="req">
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.18799 2.40806C6.18799 2.19806 6.10399 2.01606 5.93599 1.87606C5.76799 1.73606 5.57199 1.65206 5.36199 1.65206C5.08199 1.65206 4.71799 1.86206 4.28399 2.26806C3.97599 2.56206 3.63999 2.78606 3.28999 2.92606C3.31799 2.53406 3.42999 2.15606 3.59799 1.79206C3.79399 1.35806 3.90599 1.05006 3.90599 0.868056C3.90599 0.630057 3.82199 0.420056 3.68199 0.252056C3.51399 0.084056 3.31799 5.62668e-05 3.09399 5.62668e-05C2.85599 5.62668e-05 2.65999 0.084056 2.50599 0.252056C2.35199 0.420056 2.28199 0.630057 2.28199 0.868056C2.28199 1.05006 2.37999 1.35806 2.58999 1.79206C2.75799 2.15606 2.85599 2.53406 2.89799 2.92606C2.53399 2.78606 2.21199 2.56206 1.90399 2.26806C1.45599 1.86206 1.10599 1.65206 0.825994 1.65206C0.601994 1.65206 0.419994 1.73606 0.251994 1.87606C0.0839941 2.01606 -5.84498e-06 2.19806 -5.84498e-06 2.40806C-5.84498e-06 2.68806 0.0979942 2.89806 0.293994 3.05206C0.489994 3.22006 0.727994 3.29006 1.00799 3.29006C1.07799 3.29006 1.24599 3.27606 1.49799 3.24806C1.74999 3.22006 1.94599 3.20606 2.07199 3.20606C2.28199 3.20606 2.51999 3.23406 2.77199 3.27606C2.54799 3.52806 2.22599 3.78006 1.83399 4.00406C1.49799 4.20006 1.28799 4.34006 1.17599 4.43806C0.979994 4.63406 0.881994 4.87206 0.881994 5.12406C0.881994 5.34806 0.951994 5.54406 1.10599 5.68406C1.25999 5.85206 1.45599 5.92206 1.67999 5.92206C2.16999 5.92206 2.50599 5.48806 2.67399 4.62006C2.75799 4.17206 2.89799 3.79406 3.09399 3.50006C3.27599 3.79406 3.41599 4.17206 3.51399 4.62006C3.68199 5.48806 4.00399 5.92206 4.50799 5.92206C4.73199 5.92206 4.91399 5.85206 5.08199 5.68406C5.22199 5.54406 5.30599 5.34806 5.30599 5.12406C5.30599 4.87206 5.20799 4.63406 5.01199 4.43806C4.89999 4.34006 4.67599 4.20006 4.35399 4.00406C3.94799 3.78006 3.63999 3.52806 3.41599 3.27606C3.66799 3.23406 3.89199 3.20606 4.11599 3.20606C4.22799 3.20606 4.42399 3.22006 4.68999 3.24806C4.94199 3.27606 5.09599 3.29006 5.17999 3.29006C5.44599 3.29006 5.68399 3.22006 5.89399 3.05206C6.08999 2.89806 6.18799 2.68806 6.18799 2.40806Z" fill="#FF4D4F" />
                  </svg>
                </span> Отзыв
              </span>
              <textarea
                className={errors.comment ? "input--error" : ""}
                rows={7}
                maxLength={COMMENT_MAX}
                placeholder="Добавьте текст отзыва"
                value={form.comment}
                onChange={(ev) => setForm({ ...form, comment: ev.target.value })}
              />
              <div className="field__inner">
                <FieldError error={errors.comment} />
              <span className="field__counter">{form.comment.length} / 600</span>
              </div>
            </label>
          </div>
          <div className="review-form__actions">
            <button type="button" className="btn btn--yellow-outline" onClick={() => navigate(-1)} disabled={submitting}>
              <span className="btn__arrow" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.46983 12.5301C3.32938 12.3895 3.25049 12.1988 3.25049 12.0001C3.25049 11.8013 3.32938 11.6107 3.46983 11.4701L9.46983 5.47009C9.53849 5.3964 9.62129 5.3373 9.71329 5.29631C9.80529 5.25532 9.9046 5.23328 10.0053 5.2315C10.106 5.22972 10.206 5.24825 10.2994 5.28597C10.3928 5.32369 10.4776 5.37983 10.5489 5.45105C10.6201 5.52227 10.6762 5.60711 10.714 5.70049C10.7517 5.79388 10.7702 5.89391 10.7684 5.99461C10.7666 6.09532 10.7446 6.19463 10.7036 6.28663C10.6626 6.37863 10.6035 6.46143 10.5298 6.53009L5.80983 11.2501H19.9998C20.1987 11.2501 20.3895 11.3291 20.5302 11.4698C20.6708 11.6104 20.7498 11.8012 20.7498 12.0001C20.7498 12.199 20.6708 12.3898 20.5302 12.5304C20.3895 12.6711 20.1987 12.7501 19.9998 12.7501H5.80983L10.5298 17.4701C10.6035 17.5388 10.6626 17.6216 10.7036 17.7136C10.7446 17.8056 10.7666 17.9049 10.7684 18.0056C10.7702 18.1063 10.7517 18.2063 10.714 18.2997C10.6762 18.3931 10.6201 18.4779 10.5489 18.5491C10.4776 18.6203 10.3928 18.6765 10.2994 18.7142C10.206 18.7519 10.106 18.7705 10.0053 18.7687C9.9046 18.7669 9.80529 18.7449 9.71329 18.7039C9.62129 18.6629 9.53849 18.6038 9.46983 18.5301L3.46983 12.5301Z" fill="#FFA902" />
                </svg>
              </span> Назад
            </button>
            <button type="submit" className="btn btn--yellow" disabled={submitting}>
              {submitting ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
      {showSuccessModal && (
        <div className="modal-overlay" onClick={closeAndRedirect}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={closeAndRedirect}
              aria-label="Закрыть"
            >
              <span>
                <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.66613 18.3079L5.03931 17.5999L9.99727 11.9999L5.03931 6.39989L5.66613 5.69189L10.6241 11.2919L15.5821 5.69189L16.2089 6.39989L11.2509 11.9999L16.2089 17.5999L15.5821 18.3079L10.6241 12.7079L5.66613 18.3079Z" fill="black" />
                </svg>
              </span>
            </button>
            <p className="modal-message">Ваш отзыв успешно добавлен</p>
          </div>
        </div>
      )}
    </>
  );
}

