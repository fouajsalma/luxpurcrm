import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { 
  LogIn, Mail, Lock, CheckCircle, AlertCircle, 
  ArrowRight, BarChart3, Users, Shield, Eye, EyeOff,
  Fingerprint, Zap
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      
      if (rememberMe) {
        localStorage.setItem("rememberEmail", form.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      setSuccess("Connexion réussie ! Redirection...");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on mount
  useState(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-4">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl flex flex-col lg:flex-row bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-500 hover:shadow-blue-500/20">
        
        {/* LEFT SIDE - Features */}
        <div className="lg:w-1/2 p-8 lg:p-12 text-white bg-gradient-to-br from-blue-900/60 via-indigo-900/40 to-slate-900/60 backdrop-blur-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <LogIn className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                LeadManager
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Content de vous
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"> revoir</span>
            </h1>
            
            <p className="text-blue-200 text-lg">
              Connectez-vous et continuez à gérer vos leads facilement.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: BarChart3, title: "Tableau de bord", desc: "Visualisez vos performances en temps réel", color: "from-blue-500 to-cyan-500" },
              { icon: Users, title: "Collaboration", desc: "Travaillez efficacement en équipe", color: "from-indigo-500 to-purple-500" },
              { icon: Shield, title: "Sécurité", desc: "Vos données sont protégées et sécurisées", color: "from-emerald-500 to-teal-500" },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-blue-200">{item.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 text-sm text-blue-200">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>Accès rapide à tous vos leads et statistiques</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Fingerprint className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Connexion
              </h2>
              <p className="text-slate-500 mt-2">Accédez à votre espace de travail</p>
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3 animate-slideDown">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* EMAIL FIELD */}
            <div className="relative group">
              <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''}`}>
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-400'}`} />
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none
                  transition-all duration-200 bg-white/90 hover:bg-white"
                  required
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="relative group">
              <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''}`}>
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-500' : 'text-slate-400 group-hover:text-blue-400'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-200 
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none
                  transition-all duration-200 bg-white/90 hover:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all duration-200 group-hover:border-blue-400">
                    {rememberMe && (
                      <CheckCircle className="w-4 h-4 text-white m-0.5" />
                    )}
                  </div>
                </div>
                <span className="text-slate-600 group-hover:text-blue-600 transition-colors cursor-pointer">
                  Se souvenir de moi
                </span>
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
              text-white font-semibold overflow-hidden group transition-all duration-300
              hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Se connecter
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Demo Credentials */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-center">
              <p className="text-xs text-blue-600 font-medium mb-1">🔐 Compte de démonstration</p>
              <p className="text-xs text-slate-500">demo@leadmanager.com / password123</p>
            </div>

            {/* REGISTER LINK */}
            <p className="text-center text-sm text-slate-500">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                Créer un compte
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}