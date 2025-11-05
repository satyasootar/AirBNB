import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { Home } from '../pages/Home';
import Login from '../components/auth/login';
import { StoreContext } from '../context/StoreContext';

export const Routing = () => {
    const { isLoggedIn } = useContext(StoreContext);
    console.log("isLoggedIn: ", isLoggedIn);

    return (
        <Routes>
            <Route
                path="/login"
                element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
                path="/"
                element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
        </Routes>
    );
};