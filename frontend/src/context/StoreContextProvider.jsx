import { StoreContext } from './StoreContext.js'
// import data from '../Dummy/DummyData.json'
import { useEffect, useRef, useState, useCallback } from 'react'
import axiosInstance from '../components/utils/axiosInstance.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const StoreContextProvider = ({ children }) => {
    // const hotels = structuredClone(data)
    const [hotels, setHotels] = useState([]);
    console.log("hotels: ", hotels);
    const navigate = useNavigate()

    // Auth state
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [loader, setLoader] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [user, setUser] = useState(null)


    // Refs
    const userData = useRef({
        destination: "",
        checkIn: "",
        checkOut: "",
        adult: 0,
        children: 0,
        infant: 0
    })

    const bookingDetails = useRef({
        ...userData.current,
        cost: 0,
        tax: 0,
        totalcost: 0,
        cancleBy: ""
    })

    // Error message helper
    const getErrorMessage = (error) => {
        return (
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.response?.data?.non_field_errors?.[0] ||
            (error?.response?.data && typeof error.response.data === "object"
                ? Object.values(error.response.data).flat().join(" ")
                : null) ||
            error?.message ||
            "Something went wrong. Please try again."
        );
    };

    // Token management
    const updateTokens = useCallback((access, refresh) => {
        setAccessToken(access);
        setRefreshToken(refresh);
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
    }, []);

    const signup = useCallback(async (formData) => {
        if (formData.password !== formData.confirmPassword) {
            setAuthError("Passwords don't match");
            return;
        }

        if (formData.password.length < 8) {
            setAuthError("Password must be at least 8 characters");
            return;
        }

        const credential = {
            username: formData.firstName,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword
        }

        try {
            setLoader(true);
            setAuthError(null);
            let res = await axiosInstance.post('/api/auth/register/', credential);
            setLoader(false);
            toast.success("Registration Successful!");
            console.log(res.data);
        } catch (error) {
            setLoader(false);
            const errMsg = getErrorMessage(error);
            setAuthError(errMsg);
            toast.error("Registration failed");
            console.log("Signup error: ", errMsg);
        }
    }, []);

    const login = useCallback(async (formData) => {
        const credential = {
            email: formData.email,
            password: formData.password
        }

        try {
            setLoader(true);
            setAuthError(null);
            let res = await axiosInstance.post("/api/auth/login/", credential);
            const { access, refresh } = res.data;

            updateTokens(access, refresh);
            setLoader(false);
            toast.success("Login Successful!");
            navigate("/")
            console.log("Login successful:", res.data);

        } catch (error) {
            setLoader(false);
            const errMsg = getErrorMessage(error);
            setAuthError(errMsg);
            toast.error("Login failed");
            console.log("Login error: ", errMsg);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateTokens]);

    const logout = useCallback(() => {
        setAccessToken("");
        setRefreshToken("");
        setUser({});
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        toast.success("Logged out successfully");
        console.log("User logged out");
    }, []);

    const fetchHotels = async () => {
        try {
            let res = await axiosInstance.get("/api/listings/")
            console.log("res: ", res.data.results);
            setHotels(res.data.results)
        } catch (error) {
            const errMsg = getErrorMessage(error);
            setAuthError(errMsg);
        }
    }

    // Combined initialization effect
    useEffect(() => {
        // Load from localStorage
        fetchHotels()
        const storedAccess = localStorage.getItem("access");
        const storedRefresh = localStorage.getItem("refresh");
        const savedUserData = localStorage.getItem("userData");
        const savedBookingDetails = localStorage.getItem("bookingDetails");

        if (storedAccess) setAccessToken(storedAccess);
        if (storedRefresh) setRefreshToken(storedRefresh);

        if (savedUserData && savedUserData !== "undefined" && savedUserData !== "null") {
            try {
                userData.current = JSON.parse(savedUserData);
            } catch (e) {
                console.error("Failed to parse userData:", e);
                localStorage.removeItem("userData");
            }
        }

        if (savedBookingDetails && savedBookingDetails !== "undefined" && savedBookingDetails !== "null") {
            try {
                bookingDetails.current = JSON.parse(savedBookingDetails);
            } catch (e) {
                console.error("Failed to parse bookingDetails:", e);
                localStorage.removeItem("bookingDetails");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // User data effect with proper authentication
    useEffect(() => {
        if (!accessToken) {
            setUser({});
            return;
        }

        const abortController = new AbortController();

        (async () => {
            try {
                const response = await axiosInstance.get("/api/auth/me/", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    signal: abortController.signal
                });
                setUser(response.data);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching user:", error);
                    if (error.response?.status === 401) {
                        logout();
                    }
                }
            }
        })();

        return () => abortController.abort();
    }, [accessToken, logout]);

    // Update functions
    const updateUserData = useCallback((newData) => {
        userData.current = newData;
        localStorage.setItem("userData", JSON.stringify(newData));
    }, []);

    const updateBookingdetails = useCallback((newData) => {
        bookingDetails.current = newData;
        localStorage.setItem("bookingDetails", JSON.stringify(newData));
    }, []);

    const value = {
        hotels,
        userData,
        updateUserData,
        bookingDetails,
        updateBookingdetails,
        accessToken,
        refreshToken,
        login,
        signup,
        logout,
        loader,
        authError,
        setAuthError,
        user
    }

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider