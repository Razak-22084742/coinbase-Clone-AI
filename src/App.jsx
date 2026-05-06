import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AssetDetail from "./pages/AssetDetail.jsx";
import Explore from "./pages/Explore.jsx";
import Home from "./pages/Home.jsx";
import Learn from "./pages/Learn.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Profile from "./pages/Profile.jsx";
import AddCrypto from "./pages/AddCrypto.jsx";
import WarningBanner from "./components/WarningBanner.jsx";
import FooterDisclaimer from "./components/FooterDisclaimer.jsx";

/**
 * ProtectedRoute — wraps pages that require the user to be logged in.
 *
 * - While AuthContext is loading (checking localStorage on first load), shows a spinner
 *   to prevent a brief flash-redirect to /signin for already-logged-in users.
 * - If user is not logged in, redirects to /signin.
 * - If user IS logged in, renders the children (the protected page).
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      {/* Sticky warning banner — sits above NavBar on every page */}
      <WarningBanner />

      <Routes>
        {/* Public routes — accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/asset/:id" element={<AssetDetail />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/add-crypto" element={<AddCrypto />} />

        {/* Protected routes — user must be logged in */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Global footer disclaimer — appears at the bottom of every page */}
      <FooterDisclaimer />
    </>
  );
}

export default App;
