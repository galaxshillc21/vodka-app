"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        // Sign up
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("¡Cuenta creada exitosamente! Redirigiendo al setup de admin...");

        // Redirect to admin setup page after successful signup
        setTimeout(() => {
          router.push("/en/admin-setup");
        }, 2000);
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("¡Sesión iniciada exitosamente! Redirigiendo...");

        // Redirect to admin setup or dashboard
        setTimeout(() => {
          router.push("/en/admin-setup");
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      let userFriendlyMessage = errorMessage;

      // Translate common Firebase errors to Spanish
      if (errorMessage.includes("auth/email-already-in-use")) {
        userFriendlyMessage = "Este email ya está registrado. Intenta iniciar sesión.";
      } else if (errorMessage.includes("auth/weak-password")) {
        userFriendlyMessage = "La contraseña es muy débil. Debe tener al menos 6 caracteres.";
      } else if (errorMessage.includes("auth/invalid-email")) {
        userFriendlyMessage = "El formato del email no es válido.";
      } else if (errorMessage.includes("auth/user-not-found")) {
        userFriendlyMessage = "No existe una cuenta con este email.";
      } else if (errorMessage.includes("auth/wrong-password")) {
        userFriendlyMessage = "Contraseña incorrecta.";
      }

      setMessage(userFriendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}</h1>
          <p className="text-gray-600">{isSignUp ? "Crea tu cuenta de administrador para Blat Vodka" : "Accede a tu cuenta de administrador"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500" placeholder="tu-email@ejemplo.com" />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Repite la contraseña"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
          >
            {loading ? (isSignUp ? "Creando cuenta..." : "Iniciando sesión...") : isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">
            {isSignUp ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Créala aquí"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${message.includes("exitosamente") || message.includes("Redirigiendo") ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">Proceso completo:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Crea tu cuenta aquí</li>
            <li>Serás redirigido al setup de admin</li>
            <li>Haz clic en &quot;Setup as Admin&quot;</li>
            <li>¡Listo! Ya puedes gestionar eventos</li>
          </ol>
        </div>

        <div className="mt-4 text-center">
          <Link href="/en" className="text-gray-500 hover:text-gray-700 text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
