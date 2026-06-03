import { THEMES } from '../theme/themes';
import { load } from '../utils/storage';

export default function LoginScreen({ onLogin, loading }) {
  const savedTheme = load("hj_theme", "mrok");
  const t = THEMES[savedTheme] || THEMES.mrok;
  return (
    <div className="profile-screen">
      <div className="profile-logo">⚔ Hero Journal</div>
      <div className="profile-tagline">
        Zaloguj się, aby synchronizować kampanię<br/>między komputerem a telefonem.
      </div>
      <button onClick={onLogin} disabled={loading}
        style={{ display:"flex", alignItems:"center", gap:"0.75rem", background:t.bgCard, border:`1px solid ${t.accentBorder}`, color:t.text, fontFamily:"Cinzel,serif", fontSize:"0.72rem", letterSpacing:"0.12em", textTransform:"uppercase", padding:"0.9rem 1.6rem", cursor:loading?"wait":"pointer", transition:"all 0.2s", opacity:loading?0.7:1, marginTop:"0.5rem" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {loading ? "Logowanie…" : "Zaloguj przez Google"}
      </button>
      <div style={{ marginTop:"1.5rem", fontFamily:"Crimson Text,Georgia,serif", fontSize:"0.9rem", color:t.textDim, textAlign:"center", maxWidth:"300px", lineHeight:1.7, fontStyle:"italic" }}>
        Twoje dane kampanii są prywatne — dostępne wyłącznie na Twoim koncie Google.
      </div>
    </div>
  );
}
