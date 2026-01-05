import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { profile, signOut } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      {profile && (
        <div>
          <p>Welcome, {profile.name}</p>
          <button onClick={signOut} className="px-4 py-2 border rounded-lg">Logout</button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
