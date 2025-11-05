import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, loginError } = useContext(StoreContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const res = await login(email, password)
        console.log(" login res: ", res);
        if (!res) {
            alert("Invalid credentials")
            setLoading(false)
            return
        }
        navigate('/')
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-red-50 to-white px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
                    <div>
                        <h1 className="text-2xl font-semibold">Admin Sign in</h1>
                        <p className="text-sm text-gray-500">Sign in to manage users & listings</p>
                    </div>
                </div>

                {loginError && (
                    <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-100 p-3 rounded">{loginError}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="you@example.com"
                            className="mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Your secure password"
                            className="mt-1 block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"

                        />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={true}
                                readOnly
                                className="w-4 h-4"
                            />
                            <label htmlFor="remember" className="text-gray-600">Credentials will be saved</label>
                        </div>
                        <button type="button" className="text-sm text-gray-500 hover:underline" onClick={() => { setEmail('rroxx460@gmail.com'); setPassword('zebra@qwerty'); }}>Use demo</button>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"

                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    By signing in you agree to the admin policy. <br />If you have trouble, contact the developer.
                </div>
            </div>
        </div>
    );
}
