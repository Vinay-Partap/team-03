import { useAuth0 } from "@auth0/auth0-react";
import authService from "../../services/auth.service";
import { toast } from "react-hot-toast";

export default function Auth0LoginButton({ signup = false }) {
  const { loginWithRedirect, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0();
  const start = async () => {
    if (!isAuthenticated) return loginWithRedirect(signup ? { authorizationParams: { screen_hint: "signup" } } : undefined);
    try { const claims = await getIdTokenClaims(); await authService.loginWithAuth0(claims.__raw); window.location.assign("/dashboard"); }
    catch (error) { toast.error(error.response?.data?.message || "OAuth login could not be completed"); }
  };
  return <button type="button" disabled={isLoading} onClick={start} className="w-full rounded-xl border border-white/20 py-3 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50">Continue with Auth0</button>;
}
