// import AppRoutes from "./routes/AppRoutes";
// import { auth } from "./services/firebase";
import { useAuth } from "./context/AuthContext";

function App() {

   const { user, appUser, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return(
    <div>
      <h1>Auth Test</h1>
      <p>User: {user?.email}</p>
      <p>Role: {appUser?.role}</p>
    </div>
  );
}

export default App;