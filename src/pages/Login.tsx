import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, UserPlus } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || (isLogin ? 'שגיאה בהתחברות' : 'שגיאה בהרשמה'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-2 sm:p-4" dir="rtl">
      <div className="w-full max-w-md bg-zinc-900/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-zinc-800/60 p-5 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2">
            {isLogin ? 'ברוכים הבאים' : 'יצירת משתמש חדש'}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm">
            {isLogin ? 'התחברו כדי לשמור קורסים ולערוך סיכומים' : 'הירשמו כדי לשמור קורסים ולערוך סיכומים'}
          </p>
        </div>

        {error && (
          <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-900/30 text-red-400 rounded-xl text-xs sm:text-sm text-center border border-red-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">שם מלא</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  required={!isLogin}
                  className="block w-full pl-4 pr-11 py-2.5 sm:py-3 border border-zinc-700 rounded-xl leading-5 bg-zinc-800 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-all min-h-[44px]"
                  placeholder="ישראל ישראלי"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">אימייל</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-4 pr-11 py-2.5 sm:py-3 border border-zinc-700 rounded-xl leading-5 bg-zinc-800 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-all min-h-[44px]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">סיסמה</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-4 pr-11 py-2.5 sm:py-3 border border-zinc-700 rounded-xl leading-5 bg-zinc-800 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition-all min-h-[44px]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px] cursor-pointer"
          >
            {loading ? (isLogin ? 'מתחבר...' : 'נרשם...') : (isLogin ? 'התחברות' : 'הרשמה')}
            {isLogin ? <ArrowRight className="w-4 h-4 shrink-0" /> : <UserPlus className="w-4 h-4 shrink-0" />}
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs sm:text-sm text-cyan-400 hover:text-cyan-300 font-medium py-1.5 min-h-[40px] inline-flex items-center cursor-pointer"
          >
            {isLogin ? 'אין לכם חשבון? הירשמו כאן' : 'כבר יש לכם חשבון? התחברו כאן'}
          </button>
        </div>

        <div className="mt-6 sm:mt-8 text-center pt-5 sm:pt-6 border-t border-zinc-800">
          <button 
            type="button"
            onClick={() => {
              navigate('/');
            }}
            className="text-xs sm:text-sm text-zinc-400 hover:text-cyan-400 transition-colors py-1.5 min-h-[40px] inline-flex items-center cursor-pointer"
          >
            חזרה לדף הבית
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
