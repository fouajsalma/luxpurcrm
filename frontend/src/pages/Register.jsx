import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { 
  UserPlus, Mail, Lock, User, CheckCircle, 
  AlertCircle, ArrowRight, BarChart3, 
  ShieldCheck, Zap, Eye, EyeOff 
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors) setErrors(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.password !== form.password_confirmation) {
      setErrors({ password: ["Les mots de passe ne correspondent pas"] });
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/register", form);
      localStorage.setItem("token", res.data.token);

      setSuccess("Inscription réussie ! Redirection...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setErrors(err.response?.data?.errors || { message: "Erreur serveur" });
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: "nom", placeholder: "Nom", icon: User, type: "text" },
    { name: "prenom", placeholder: "Prénom", icon: User, type: "text" },
    { name: "email", placeholder: "Adresse email", icon: Mail, type: "email" },
    { name: "password", placeholder: "Mot de passe", icon: Lock, type: "password", showToggle: true },
    { name: "password_confirmation", placeholder: "Confirmer le mot de passe", icon: Lock, type: "password", showToggle: true },
  ];

  const passwordStrength = () => {
    const pwd = form.password;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = passwordStrength();
    if (strength === 0) return "bg-gray-200";
    if (strength <= 2) return "bg-red-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const strength = passwordStrength();
    if (strength === 0) return "";
    if (strength <= 2) return "Faible";
    if (strength === 3) return "Moyen";
    return "Fort";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row overflow-hidden rounded-3xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-500 hover:shadow-indigo-500/20">
        
        {/* LEFT SECTION - Features */}
        <div className="lg:w-1/2 p-8 lg:p-12 text-white bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900/60 backdrop-blur-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                LeadManager
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Créez votre
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"> compte</span>
            </h1>
            
            <p className="text-indigo-200 text-lg">
              Gérez vos leads, suivez votre équipe et développez votre business.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: BarChart3, title: "Analyses avancées", desc: "Visualisez vos performances en temps réel", color: "from-blue-500 to-cyan-500" },
              { icon: ShieldCheck, title: "Sécurité renforcée", desc: "Vos données sont protégées", color: "from-emerald-500 to-teal-500" },
              { icon: Zap, title: "Automatisation", desc: "Gagnez du temps intelligemment", color: "from-orange-500 to-red-500" },
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
                  <p className="text-sm text-indigo-200">{item.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5000+</div>
                <div className="text-xs text-indigo-300">Utilisateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-xs text-indigo-300">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-xs text-indigo-300">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Form */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex items-center justify-center">
          <form onSubmit={submit} className="w-full max-w-md space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
                Inscription
              </h2>
              <p className="text-slate-500 mt-2">Commencez votre essai gratuit</p>
            </div>

            {/* SUCCESS MESSAGE */}
            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-3 animate-slideDown">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* ERROR MESSAGES */}
            {errors && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm space-y-2 animate-shake">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Erreur d'inscription</span>
                </div>
                {Object.entries(errors).map(([field, messages]) => (
                  <div key={field} className="pl-6 text-red-600">
                    • {field}: {Array.isArray(messages) ? messages.join(", ") : messages}
                  </div>
                ))}
              </div>
            )}

            {/* INPUT FIELDS */}
            {inputFields.map((field, index) => {
              const Icon = field.icon;
              const isPasswordField = field.type === "password";
              const showToggle = field.showToggle;
              const isFocused = focusedField === field.name;
              
              return (
                <div key={index} className="relative group">
                  <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-[1.02]' : ''}`}>
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${isFocused ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                    
                    <input
                      type={showToggle && isPasswordField && (field.name === "password" ? (showPassword ? "text" : "password") : (field.name === "password_confirmation" ? (showConfirmPassword ? "text" : "password") : field.type))}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-slate-200 
                      focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 outline-none
                      transition-all duration-200 bg-white/90 hover:bg-white"
                      required
                    />
                    
                    {showToggle && isPasswordField && (
                      <button
                        type="button"
                        onClick={() => {
                          if (field.name === "password") setShowPassword(!showPassword);
                          else setShowConfirmPassword(!showConfirmPassword);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                      >
                        {(field.name === "password" ? showPassword : showConfirmPassword) ? 
                          <EyeOff className="w-5 h-5" /> : 
                          <Eye className="w-5 h-5" />
                        }
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Password Strength Indicator */}
            {form.password && form.password.length > 0 && (
              <div className="space-y-2 animate-fadeIn">
                <div className="flex gap-1 h-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        i <= passwordStrength() ? getStrengthColor() : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {passwordStrength() > 0 && (
                  <p className={`text-xs font-medium ${
                    passwordStrength() <= 2 ? "text-red-500" : 
                    passwordStrength() === 3 ? "text-yellow-500" : "text-green-500"
                  }`}>
                    Force du mot de passe : {getStrengthText()}
                  </p>
                )}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600
              text-white font-semibold overflow-hidden group transition-all duration-300
              hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    S'inscrire
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-sm text-slate-500">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-colors">
                Se connecter
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
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}