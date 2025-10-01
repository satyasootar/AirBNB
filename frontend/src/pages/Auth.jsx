
import { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import Loader from '../components/utils/Loader';
import { ToastContainer } from 'react-toastify';


const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup, loader, authError, setAuthError } = useContext(StoreContext)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (authError) setAuthError(null)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin == true) {
            login(formData)
        } else {
            signup(formData)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-10">
            <ToastContainer />
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-black mb-2">
                        {isLogin ? 'Log in' : 'Sign up'}
                    </h1>
                    <p className="text-gray-3 text-sm">
                        {isLogin ? 'Welcome back to Airbnb' : 'Join Airbnb and discover unique places to stay'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name fields for signup */}
                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
                                    First name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent transition-all"
                                    placeholder="First name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
                                    Last name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent transition-all"
                                    placeholder="Last name"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Email field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${authError ? "border-red-600" : "border-gray-2"} rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent transition-all`}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${authError ? "border-red-600" : "border-gray-2"} rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent transition-all`}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className='text-red-600 text-xs'>{authError}</div>

                    {/* Confirm Password field for signup */}
                    {!isLogin && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-airbnb focus:border-transparent transition-all"
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-airbnb text-white py-4 rounded-lg font-semibold hover:bg-airbnb-dark transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-airbnb focus:ring-offset-2"
                    >
                        {loader ? (
                            <Loader size={20} />
                        ) : isLogin ? (
                            "Log In"
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                {/* Toggle between login/signup */}
                <div className="text-center mt-6">
                    <p className="text-gray-3 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-airbnb font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-airbnb rounded px-1"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>

                {/* Footer text */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-3">
                        By continuing, you agree to Airbnb's{' '}
                        <a href="#" className="text-black underline">Terms of Service</a>{' '}
                        and acknowledge you've read our{' '}
                        <a href="#" className="text-black underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;