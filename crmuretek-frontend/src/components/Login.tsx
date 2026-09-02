interface LoginProps {
  loginUsername: string;
  setLoginUsername: (value: string) => void;
  loginPassword: string;
  setLoginPassword: (value: string) => void;
  loginError: string;
  handleLogin: () => void;
}

export const Login = ({
  loginUsername,
  setLoginUsername,
  loginPassword,
  setLoginPassword,
  loginError,
  handleLogin,
}: LoginProps) => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <h1 className="text-2xl font-black text-orange-500 mb-6">URETEK CRM</h1>

        <input
          type="text"
          placeholder="Usuario"
          className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 mb-3"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 mb-3"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        {loginError && (
          <p className="text-red-500 text-sm mb-3">{loginError}</p>
        )}
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold"
        >
          Ingresar
        </button>
      </div>
    </div>
  );
};
