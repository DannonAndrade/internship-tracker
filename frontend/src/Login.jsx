export default function Login() {
    const handleLogin = () => {
      // Redirect to backend OAuth route
      window.location.href = "http://localhost:5000/auth/google";
    };
  
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Internship Tracker</h1>
          <button
            onClick={handleLogin}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }