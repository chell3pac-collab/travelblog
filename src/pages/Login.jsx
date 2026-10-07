import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FieldError from "../components/FieldError";
import './Login.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(name, value) {
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  }


  function validate() {
    const e = {};
    if (!form.email.trim()) e.email = "Укажите логин";
    else if (!EMAIL_RE.test(form.email.trim())) e.email = "Некорректный email";
    if (!form.password) e.password = "Введите пароль";
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
      await login({ email: form.email.trim(), password: form.password });
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.errors?.email?.[0] || err.errors?.password?.[0] || err.errors?._global?.[0] || err.message || "Не удалось войти");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-hero ">
        <h1 className="page-hero__title">Истории ваших путешествий</h1>
      </section>

      <div className="container">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-card__title">Вход в профиль</h2>
          {serverError && <p className="auth-card__server-error">{serverError}</p>}
          <div className="auth-card__wrapper">
            <label className="field">
              <span className="field__label">
                <span className="req">
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.18775 2.40806C6.18775 2.19806 6.10375 2.01606 5.93575 1.87606C5.76775 1.73606 5.57175 1.65206 5.36175 1.65206C5.08175 1.65206 4.71775 1.86206 4.28375 2.26806C3.97575 2.56206 3.63975 2.78606 3.28975 2.92606C3.31775 2.53406 3.42975 2.15606 3.59775 1.79206C3.79375 1.35806 3.90575 1.05006 3.90575 0.868056C3.90575 0.630057 3.82175 0.420056 3.68175 0.252056C3.51375 0.084056 3.31775 5.62668e-05 3.09375 5.62668e-05C2.85575 5.62668e-05 2.65975 0.084056 2.50575 0.252056C2.35175 0.420056 2.28175 0.630057 2.28175 0.868056C2.28175 1.05006 2.37975 1.35806 2.58975 1.79206C2.75775 2.15606 2.85575 2.53406 2.89775 2.92606C2.53375 2.78606 2.21175 2.56206 1.90375 2.26806C1.45575 1.86206 1.10575 1.65206 0.82575 1.65206C0.60175 1.65206 0.41975 1.73606 0.25175 1.87606C0.08375 2.01606 -0.000249986 2.19806 -0.000249986 2.40806C-0.000249986 2.68806 0.09775 2.89806 0.29375 3.05206C0.48975 3.22006 0.72775 3.29006 1.00775 3.29006C1.07775 3.29006 1.24575 3.27606 1.49775 3.24806C1.74975 3.22006 1.94575 3.20606 2.07175 3.20606C2.28175 3.20606 2.51975 3.23406 2.77175 3.27606C2.54775 3.52806 2.22575 3.78006 1.83375 4.00406C1.49775 4.20006 1.28775 4.34006 1.17575 4.43806C0.97975 4.63406 0.88175 4.87206 0.88175 5.12406C0.88175 5.34806 0.95175 5.54406 1.10575 5.68406C1.25975 5.85206 1.45575 5.92206 1.67975 5.92206C2.16975 5.92206 2.50575 5.48806 2.67375 4.62006C2.75775 4.17206 2.89775 3.79406 3.09375 3.50006C3.27575 3.79406 3.41575 4.17206 3.51375 4.62006C3.68175 5.48806 4.00375 5.92206 4.50775 5.92206C4.73175 5.92206 4.91375 5.85206 5.08175 5.68406C5.22175 5.54406 5.30575 5.34806 5.30575 5.12406C5.30575 4.87206 5.20775 4.63406 5.01175 4.43806C4.89975 4.34006 4.67575 4.20006 4.35375 4.00406C3.94775 3.78006 3.63975 3.52806 3.41575 3.27606C3.66775 3.23406 3.89175 3.20606 4.11575 3.20606C4.22775 3.20606 4.42375 3.22006 4.68975 3.24806C4.94175 3.27606 5.09575 3.29006 5.17975 3.29006C5.44575 3.29006 5.68375 3.22006 5.89375 3.05206C6.08975 2.89806 6.18775 2.68806 6.18775 2.40806Z" fill="#FF4D4F" />
                  </svg>
                </span> Логин
              </span>
              <input
                type="email"
                className={errors.email || serverError ? "input--error" : ""}
                value={form.email}
                onChange={(ev) => updateField("email", ev.target.value)}
                placeholder="Email"
                autoComplete="email"
              />
              <FieldError error={errors.email} />
            </label>
            <label className="field">
              <span className="field__label">
                <span className="req">
                  <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.18775 2.40806C6.18775 2.19806 6.10375 2.01606 5.93575 1.87606C5.76775 1.73606 5.57175 1.65206 5.36175 1.65206C5.08175 1.65206 4.71775 1.86206 4.28375 2.26806C3.97575 2.56206 3.63975 2.78606 3.28975 2.92606C3.31775 2.53406 3.42975 2.15606 3.59775 1.79206C3.79375 1.35806 3.90575 1.05006 3.90575 0.868056C3.90575 0.630057 3.82175 0.420056 3.68175 0.252056C3.51375 0.084056 3.31775 5.62668e-05 3.09375 5.62668e-05C2.85575 5.62668e-05 2.65975 0.084056 2.50575 0.252056C2.35175 0.420056 2.28175 0.630057 2.28175 0.868056C2.28175 1.05006 2.37975 1.35806 2.58975 1.79206C2.75775 2.15606 2.85575 2.53406 2.89775 2.92606C2.53375 2.78606 2.21175 2.56206 1.90375 2.26806C1.45575 1.86206 1.10575 1.65206 0.82575 1.65206C0.60175 1.65206 0.41975 1.73606 0.25175 1.87606C0.08375 2.01606 -0.000249986 2.19806 -0.000249986 2.40806C-0.000249986 2.68806 0.09775 2.89806 0.29375 3.05206C0.48975 3.22006 0.72775 3.29006 1.00775 3.29006C1.07775 3.29006 1.24575 3.27606 1.49775 3.24806C1.74975 3.22006 1.94575 3.20606 2.07175 3.20606C2.28175 3.20606 2.51975 3.23406 2.77175 3.27606C2.54775 3.52806 2.22575 3.78006 1.83375 4.00406C1.49775 4.20006 1.28775 4.34006 1.17575 4.43806C0.97975 4.63406 0.88175 4.87206 0.88175 5.12406C0.88175 5.34806 0.95175 5.54406 1.10575 5.68406C1.25975 5.85206 1.45575 5.92206 1.67975 5.92206C2.16975 5.92206 2.50575 5.48806 2.67375 4.62006C2.75775 4.17206 2.89775 3.79406 3.09375 3.50006C3.27575 3.79406 3.41575 4.17206 3.51375 4.62006C3.68175 5.48806 4.00375 5.92206 4.50775 5.92206C4.73175 5.92206 4.91375 5.85206 5.08175 5.68406C5.22175 5.54406 5.30575 5.34806 5.30575 5.12406C5.30575 4.87206 5.20775 4.63406 5.01175 4.43806C4.89975 4.34006 4.67575 4.20006 4.35375 4.00406C3.94775 3.78006 3.63975 3.52806 3.41575 3.27606C3.66775 3.23406 3.89175 3.20606 4.11575 3.20606C4.22775 3.20606 4.42375 3.22006 4.68975 3.24806C4.94175 3.27606 5.09575 3.29006 5.17975 3.29006C5.44575 3.29006 5.68375 3.22006 5.89375 3.05206C6.08975 2.89806 6.18775 2.68806 6.18775 2.40806Z" fill="#FF4D4F" />
                  </svg>
                </span> Пароль
              </span>
              <input
                type="password"
                className={errors.password || serverError ? "input--error" : ""}
                value={form.password}
                onChange={(ev) => updateField("password", ev.target.value)}
                placeholder="Пароль"
                autoComplete="current-password"
              />
              <FieldError error={errors.password} />
            </label>
          </div>
          <div className="auth-card__actions">
            <Link to="/register" className="btn btn--primary-framed">
              Зарегистрироваться
            </Link>
            <button type="submit" className="btn btn--primary-lg" disabled={submitting}>
              {submitting ? "Входим…" : "Войти"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}