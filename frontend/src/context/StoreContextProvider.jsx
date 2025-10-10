import { StoreContext } from './StoreContext.js'
// import data from '../Dummy/DummyData.json'
import { useEffect, useRef, useState, useCallback } from 'react'
import axiosInstance from '../components/utils/axiosInstance.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { createSearchItemsFromHotels } from '../components/utils/createSearchItemsFromHotels.jsx'

const StoreContextProvider = ({ children }) => {
    // const hotels = structuredClone(data)
    const [hotels, setHotels] = useState([]);
    const[trips, setTrips] = useState()
    console.log("hotels: ", hotels);
    const [searchItems, setSearchItems] = useState([
        {
            id: 11,
            destination: "Bhubaneshwar",
            text: "Capital city with ancient temples and modern luxury",
            image: "/assets/citysearch.png"
        },
        {
            id: 12,
            destination: "Mumbai",
            text: "City of dreams with beaches and Bollywood glamour",
            image: "/assets/citysearch.png"
        },
        {
            id: 13,
            destination: "Bengaluru",
            text: "Garden city and India's Silicon Valley",
            image: "/assets/citysearch.png"
        },
        {
            id: 14,
            destination: "Goa",
            text: "Coastal paradise of sun-kissed beaches, bohemian nightlife, and Portuguese charm",
            image: "/assets/beachsearch.png"
        },
        {
            id: 15,
            destination: "Kolkata",
            text: "India’s Cultural Capital – poetry, history, food, and the ‘City of Joy’ spirit",
            image: "/assets/citysearch.png"
        },
        {
            id: 16,
            destination: "Manali",
            text: "Himalayan haven of snow-clad valleys, adventure, and serene mountain vibes",
            image: "/assets/mountainsearch.png"
        }

    ])
    const navigate = useNavigate()

    // Auth state
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [loader, setLoader] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [user, setUser] = useState(null)
    console.log("user: ", user);

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
        cancelBy: "",
        hotelId: 0,
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

            let res = await axiosInstance.get("/api/listings/hotels")

            if (res && res.data) {

                setHotels(res.data);
                const dynamicSearchItems = createSearchItemsFromHotels(res.data);
                setSearchItems(dynamicSearchItems);

            } else {
                console.warn(" No results in response");
                setHotels([]);
            }
        } catch (error) {
            console.error("Error fetching hotels:", error);
            toast.error("Failed to load hotels");
        } finally {
            console.log("Hotels fetch completed");
        }
    }

    const bookings = async () => {
        console.log("Test Started");

        const payload = {
            "listing": bookingDetails.current.hotelId,
            "check_in": bookingDetails.current.checkIn,
            "check_out": bookingDetails.current.checkOut,
            "adult": bookingDetails.current.adult,
            "children": bookingDetails.current.children,
            "infant": bookingDetails.current.infant,
            "total_price": bookingDetails.current.cost
        }

        const PaymentPayload = {
            "payment": {
                "status": "paid",
                "payment_method": bookingDetails.current.PaymentMethod,
                "provider_payment_id": ""
            }
        }

        try {
            console.log("payload: ", PaymentPayload);
            const res = await axiosInstance.post("/api/bookings/", payload)
            await new Promise(resolve => setTimeout(resolve, 2000));
            await axiosInstance.patch(`/api/bookings/${res.data.id}`, PaymentPayload)
            return true;
        } catch (error) {
            console.log("error: ", error);
            return false;
        }
    }

    const myBookings = async () => {
        try {
            const res = await axiosInstance.get("/api/bookings");
            const bookings = res.data?.results;
            if (bookings && bookings.length > 0) {
                return bookings; 
            } else {
                return "There are no trips"; 
            }

        } catch (error) {
            // Comprehensive error handling based on Axios documentation
            if (error.response) {
                // Server responded with error status (4xx, 5xx)
                console.error("Server Error:", error.response.status, error.response.data);
                throw new Error(`Request failed: ${error.response.status} - ${error.response.data?.message || 'Server error'}`);
            } else if (error.request) {
                // Request made but no response received
                console.error("Network Error:", error.request);
                throw new Error("Network error - unable to reach server");
            } else {
                // Something else happened while setting up the request
                console.error("Request Setup Error:", error.message);
                throw new Error(`Request failed: ${error.message}`);
            }
        }
    };

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

    }, []);

    const refreshUser = useCallback(async (signal = null) => {
        if (!accessToken) {
            setUser({});
            return;
        }

        try {
            const config = {
                headers: { Authorization: `AIRBNB ${accessToken}` }
            };
            if (signal) {
                config.signal = signal;
            }
            const response = await axiosInstance.get("/api/auth/me/", config);
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            if (signal?.aborted) {
                return;
            }
            console.error("Error refreshing user:", error);
            if (error.response?.status === 401) {
                logout();
            }
        }
    }, [accessToken, logout]);


    useEffect(() => {
        const abortController = new AbortController();
        refreshUser(abortController.signal);

        return () => abortController.abort();
    }, [refreshUser]);

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
        trips,
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
        user,
        refreshUser,
        searchItems,
        bookings,
        myBookings
    }

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider