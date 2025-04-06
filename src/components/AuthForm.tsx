import React, { useState, ChangeEvent, FormEvent } from "react";
import { useApi } from "../utils/hooks";
import TextInput from "../components/TextInput";
import { Link, useNavigate } from "react-router-dom";

interface AuthFormProps {
  title: string;
  endpoint: string;
  fields: { label: string; id: string; type?: string }[];
  buttonText: string;
  children?: React.ReactNode; // Ajout de children ici
}

const AuthForm: React.FC<AuthFormProps> = ({ title, endpoint, fields, buttonText, children }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  const { post, loading, error } = useApi();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await post<{ message: string }>(endpoint, formData);
      setMessage(response.message);
      navigate("/");
    } catch (err) {
      console.error("Erreur lors de la requête", err);
    }
  };

  return (
    <main className="w-full min-h-dvh flex justify-center items-center p-2">
      <div className="w-full max-w-130 bg-neutral-50 p-10 rounded-md flex flex-col items-center gap-3">
        <h1 className="font-bold text-3xl">{title}</h1>
        {error && (
          <div className="bg-red-200 p-3 w-full rounded-md">
            <p className="font-bold text-red-900">{error.message}</p>
            {error.details && (
              <ul className="mt-2 text-red-900">
                {Object.entries(error.details).map(([field, message]) => (
                  <li key={field}>
                    <strong>{field} :</strong> {message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {message && (
          <div className="bg-green-200 p-3 w-full rounded-md">
            <p className="font-bold text-green-900">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {fields.map(({ label, id, type = "text" }) => (
            <TextInput key={id} label={label} id={id} type={type} value={formData[id] || ""} onChange={handleChange} />
          ))}
          <div className="flex flex-col gap-3 relative">
            <label htmlFor="password" className="font-medium text-lg">
              Mot de passe
            </label>
            <input type={showPassword ? "text" : "password"} name="password" id="password" value={formData.password || ""} onChange={handleChange} className="shadow-sm border border-neutral-300 rounded-md p-3 pr-10 text-lg" />
            <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-14.5 text-sm text-gray-600">
              {showPassword ? <i className="pi pi-eye-slash text-xl" /> : <i className="pi pi-eye text-xl" />}
            </button>
          </div>
          <button type="submit" disabled={loading} className="bg-indigo-500 p-3 text-white font-bold tracking-widest uppercase rounded-md mt-4">
            {loading ? "Chargement..." : buttonText}
          </button>
        </form>
        {children && children}
      </div>
    </main>
  );
};

export const Register = () => (
  <AuthForm
    title="Créer un compte"
    endpoint="/register"
    fields={[
      { label: "Pseudo", id: "pseudo" },
      { label: "Email", id: "email", type: "email" },
    ]}
    buttonText="Créer">
    <div className="mt-4 text-center">
      <Link to="/" className="text-indigo-500 hover:underline">
        Retour
      </Link>
    </div>
  </AuthForm>
);

export const Login = () => (
  <AuthForm title="Connexion" endpoint="/login" fields={[{ label: "Email", id: "email", type: "email" }]} buttonText="Se connecter">
    <div className="mt-4 text-center">
      <p className="text-sm">
        Pas de compte ?{" "}
        <Link to="/register" className="text-indigo-500 hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  </AuthForm>
);

export default AuthForm;
