import React, { useState } from "react";
import { Button, Input, Divider, Toast } from "../components/common";

// ── Login Page ─────────────────────────────────────────────────────────────────
export const LoginPage = ({ onLogin, switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setShowToast(true);
    setTimeout(() => { setShowToast(false); onLogin(); }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      {showToast && <Toast message="Welcome back! Logging in…" type="success" onClose={() => setShowToast(false)} />}
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your OSS account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex flex-col gap-5">
            <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})); }} error={errors.email} icon="✉" required />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({...p, password: ""})); }} error={errors.password} icon="🔒" required />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Remember me
              </label>
              <button className="text-blue-600 font-medium hover:underline">Forgot password?</button>
            </div>
            <Button onClick={handleSubmit} size="lg" className="w-full justify-center">Sign In</Button>
          </div>

          <Divider label="or continue with" />

          <div className="grid grid-cols-2 gap-3">
            {["🔵 Google", "⚫ GitHub"].map(p => (
              <button key={p} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{" "}
          <button onClick={switchToSignup} className="text-blue-600 font-semibold hover:underline">Sign up free</button>
        </p>
      </div>
    </div>
  );
};

// ── Signup Page ────────────────────────────────────────────────────────────────
export const SignupPage = ({ onSignup, switchToLogin }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const set = (k, v) => { setForm(p => ({...p, [k]: v})); setErrors(p => ({...p, [k]: ""})); };

  const validate = () => {
    const e = {};
    if (!form.name) e.name = "Full name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password || form.password.length < 8) e.password = "Password must be 8+ characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setShowToast(true);
    setTimeout(() => { setShowToast(false); onSignup(); }, 1500);
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ["", "bg-red-400", "bg-amber-400", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      {showToast && <Toast message="Account created! Redirecting…" type="success" onClose={() => setShowToast(false)} />}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-200">
            <span className="text-white text-2xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Create account</h1>
          <p className="text-slate-500 mt-1 text-sm">Start building surveys for free</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <div className="flex flex-col gap-5">
            <Input label="Full Name" placeholder="Alex Johnson" value={form.name} onChange={e => set("name", e.target.value)} error={errors.name} icon="👤" required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => set("email", e.target.value)} error={errors.email} icon="✉" required />
            <div>
              <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set("password", e.target.value)} error={errors.password} icon="🔒" required />
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? strengthColors[strength] : "bg-slate-200"}`} />)}
                  </div>
                  <span className={`text-xs font-medium ${strength === 1 ? "text-red-500" : strength === 2 ? "text-amber-600" : "text-emerald-600"}`}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>
            <Input label="Confirm Password" type="password" placeholder="Re-enter password" value={form.confirm} onChange={e => set("confirm", e.target.value)} error={errors.confirm} icon="🔑" required />
            <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>I agree to the <a href="#" className="text-blue-600 font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-medium hover:underline">Privacy Policy</a></span>
            </label>
            <Button onClick={handleSubmit} size="lg" className="w-full justify-center">Create Account</Button>
          </div>

          <Divider label="or sign up with" />
          <div className="grid grid-cols-2 gap-3">
            {["🔵 Google", "⚫ GitHub"].map(p => (
              <button key={p} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">{p}</button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <button onClick={switchToLogin} className="text-blue-600 font-semibold hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
};
