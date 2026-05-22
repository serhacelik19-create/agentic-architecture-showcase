import { useState, type FormEvent } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { adminApi } from './api';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminApi.login(username, password);
      if (response.user.role === 'super_admin') {
        onLoginSuccess(response.user);
        return;
      }
      setError('Bu panele sadece süper admin rolü ile erişilebilir.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-layout">
        <div className="login-copy">
          <div className="login-badge">
            <Sparkles size={16} />
            Command Center
          </div>
          <h1>YKS süper admin kontrol merkezi.</h1>
          <p>
            Kurumlar, erişim, bakım modları, kullanıcı yetkileri ve AI maliyetleri tek operasyon
            ekranında birleşir.
          </p>

          <div className="login-highlight-grid">
            <div className="login-highlight-card">
              <ShieldCheck size={18} />
              <strong>Yetki kontrolü</strong>
              <span>Kurum ve rol erişimleri merkezi biçimde yönetilir.</span>
            </div>
            <div className="login-highlight-card">
              <Sparkles size={18} />
              <strong>Operasyon görünümü</strong>
              <span>Bakım, kurum durumu ve maliyet sinyalleri aynı akışta izlenir.</span>
            </div>
          </div>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-top">
            <div className="brand-mark large">Y</div>
            <div>
              <h2>Süper Admin Girişi</h2>
              <p>YKS Admin</p>
            </div>
          </div>

          {error && <div className="inline-alert danger">{error}</div>}

          <label className="field">
            <span>Kullanıcı adı</span>
            <div className="field-input">
              <User size={16} />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="serhat"
                required
              />
            </div>
          </label>

          <label className="field">
            <span>Şifre</span>
            <div className="field-input">
              <Lock size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                title={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button type="submit" className="primary-button wide" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            {!loading && <ArrowRight size={18} />}
          </button>

          <small className="login-note">Sadece süper admin rolündeki hesaplar kabul edilir.</small>
        </form>
      </div>
    </div>
  );
};

export default Login;
