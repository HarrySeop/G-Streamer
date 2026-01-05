import { useEffect } from 'react';
import { gapi } from 'gapi-script';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// TODO: Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

const LoginPage = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive.readonly',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleGoogleLogin = () => {
    gapi.auth2.getAuthInstance().signIn().then((googleUser) => {
      const profile = googleUser.getBasicProfile();
      signIn({
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
      });
      navigate('/');
    }).catch((error) => {
      console.error('Google Sign-In failed:', error);
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={handleGoogleLogin} className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150">
          <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
          <span>Login with Google</span>
      </button>
    </div>
  );
};

export default LoginPage;
