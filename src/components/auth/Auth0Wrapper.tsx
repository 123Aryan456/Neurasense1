import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

interface Auth0WrapperProps {
  children: React.ReactNode;
}

const Auth0Wrapper = ({ children }: Auth0WrapperProps) => {
  const navigate = useNavigate();

  const domain =
    import.meta.env.VITE_AUTH0_DOMAIN || "dev-yourdomain.auth0.com";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id";
  const audience =
    import.meta.env.VITE_AUTH0_AUDIENCE || "https://api.yourdomain.com";

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || "/dashboard");
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0Wrapper;
