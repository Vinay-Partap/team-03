import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function OAuthCallback() { const navigate = useNavigate(); useEffect(() => { const p = new URLSearchParams(window.location.search); const token=p.get('token'), user=p.get('user'); if (token && user) { sessionStorage.setItem('token', token); sessionStorage.setItem('user', user); navigate('/dashboard', { replace: true }); } else navigate('/login', { replace: true }); }, [navigate]); return <p className="p-8">Completing Google sign-in…</p>; }
