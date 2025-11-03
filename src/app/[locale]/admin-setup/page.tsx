"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";
import { setupAdminUser, checkAdminStatus } from "@/lib/adminSetup";

export default function AdminSetupPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [adminStatus, setAdminStatus] = useState<{
    isAdmin: boolean;
    message: string;
    userData?: Record<string, unknown>;
    error?: unknown;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        checkUserAdminStatus();
      }
    });

    return () => unsubscribe();
  }, []);

  const checkUserAdminStatus = async () => {
    try {
      const status = await checkAdminStatus();
      setAdminStatus(status);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Signed in successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Sign in error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupAdmin = async () => {
    setLoading(true);
    setMessage("");

    try {
      await setupAdminUser();
      setMessage("Admin user setup successfully!");
      await checkUserAdminStatus();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Setup error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setMessage("Signed out successfully");
      setAdminStatus(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setMessage(`Sign out error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Setup</h1>

        {!user ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-green-600 font-medium">✅ Signed in as: {user.email}</p>
              <p className="text-sm text-gray-500">UID: {user.uid}</p>
            </div>

            {adminStatus && (
              <div className={`p-4 rounded-md ${adminStatus.isAdmin ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
                <p className={`font-medium ${adminStatus.isAdmin ? "text-green-800" : "text-yellow-800"}`}>{adminStatus.isAdmin ? "✅ Admin Status: Active" : "⚠️ Admin Status: Not Set"}</p>
                <p className="text-sm text-gray-600 mt-1">{adminStatus.message}</p>
              </div>
            )}

            <div className="space-y-3">
              {!adminStatus?.isAdmin && (
                <button
                  onClick={handleSetupAdmin}
                  disabled={loading}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? "Setting up..." : "Setup as Admin"}
                </button>
              )}

              <button onClick={checkUserAdminStatus} disabled={loading} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? "Checking..." : "Check Admin Status"}
              </button>

              <button onClick={handleSignOut} className="w-full py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Sign Out
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
            <p className="text-sm text-blue-800">{message}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-900 mb-2">Instructions:</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>Sign in with your Firebase Auth email/password</li>
            <li>Click &quot;Setup as Admin&quot; to create your admin user document</li>
            <li>Check admin status to verify setup</li>
            <li>You can now use the API routes for event management</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
