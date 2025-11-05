import { StoreContext } from "./StoreContext"
import axiosInstance, { saveTokens, clearTokens, getTokens } from "../components/utils/axiosInstance"
import { useEffect, useState } from "react";

export const StoreContextProvider = ({ children }) => {
    const [users, setUsers] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [totalUser, setTotalUser] = useState(0)
    const [userLoading, setUserLoading] = useState(false)
    const [loginError, setLoginError] = useState()

    // User infinite scroll states
    const [userNextPage, setUserNextPage] = useState(null);
    const [isLoadingMoreUsers, setIsLoadingMoreUsers] = useState(false);
    const [hasMoreUsers, setHasMoreUsers] = useState(true);

    const [listings, setListings] = useState([])
    const [totalListings, setTotalListings] = useState(0)

    // Listing infinite scroll states
    const [nextPage, setNextPage] = useState(null);
    const [isLoadingMoreListings, setIsLoadingMoreListings] = useState(false);
    const [hasMoreListings, setHasMoreListings] = useState(true);

    //Bookings
    const [bookings, setBookings] = useState()

    const login = async (email, password) => {
        try {
            setLoginError(null);
            const response = await axiosInstance.post("api/auth/login/", {
                email,
                password
            });

            if (response.data && response.data.access) {
                saveTokens({
                    access: response.data.access,
                    refresh: response.data.refresh
                });
                setIsLoggedIn(true)
                return true;

            }
        } catch (error) {
            console.error("Login error: ", error);
            setLoginError(error.message || "Login failed");
            return false;
        }
    }

    const logout = () => {
        clearTokens();
        setIsLoggedIn(false)
        window.location.reload();
    }

    const isAuthenticated = () => {
        const tokens = getTokens();
        if (tokens) {
            setIsLoggedIn(true)
            return !!(tokens && tokens.access);
        }
        setIsLoggedIn(false)
        return !!(tokens && tokens.access);
    }

    const fetchUsers = async () => {
        try {
            setUserLoading(true)
            let res = await axiosInstance.get("/api/admin/users/?limit=10&offset=0")
            if (!res.data.results) {
                setUserLoading(false)
                throw new Error("Users data not found");
            }
            setUsers(res.data.results)
            setTotalUser(res.data.count)
            setUserNextPage(res.data.next);
            setHasMoreUsers(!!res.data.next);
            setUserLoading(false)
        } catch (error) {
            console.log("error: ", error);
            setUserLoading(false)
        }
    }

    const fetchMoreUsers = async () => {
        if (!userNextPage || isLoadingMoreUsers || !hasMoreUsers) return;

        try {
            setIsLoadingMoreUsers(true);
            let res = await axiosInstance.get(userNextPage);

            setUsers(prev => [...prev, ...res.data.results]);
            setUserNextPage(res.data.next);
            setHasMoreUsers(!!res.data.next);
        } catch (error) {
            console.log("error fetching more users: ", error);
        } finally {
            setIsLoadingMoreUsers(false);
        }
    }

    const deleteUser = async (userId) => {
        try {
            await axiosInstance.delete(`/api/admin/users/${userId}`)
        } catch (error) {
            console.log("error deleting user: ", error);
        }
    }

    const fetchListings = async () => {
        try {
            setIsLoadingMoreListings(true);
            let res = await axiosInstance.get('/api/admin/listings/?&limit=10&offset=0');
            setTotalListings(res.data.count)
            setListings(res.data.results);
            setNextPage(res.data.next);
            setHasMoreListings(!!res.data.next);
        } catch (error) {
            console.log("error: ", error);
        } finally {
            setIsLoadingMoreListings(false);
        }
    }

    const fetchMoreListings = async () => {
        if (!nextPage || isLoadingMoreListings || !hasMoreListings) return;

        try {
            setIsLoadingMoreListings(true);
            let res = await axiosInstance.get(nextPage);

            setListings(prev => [...prev, ...res.data.results]);
            setNextPage(res.data.next);
            setHasMoreListings(!!res.data.next);
        } catch (error) {
            console.log("error fetching more: ", error);
        } finally {
            setIsLoadingMoreListings(false);
        }
    }

    const deleteListing = async (id) => {
        try {
            await axiosInstance.delete(`/api/admin/listings/${id}`)
        } catch (error) {
            console.log("error: ", error);
        }
    }

    const fetchAllBookings = async () => {
        try {
            let res = await axiosInstance.get('/api/admin/booking/')
            setBookings(res.data.results)
        } catch (error) {
            console.log("error: ", error);

        }
    }



    useEffect(() => {
        if (isAuthenticated()) {
            fetchUsers()
            fetchListings()
            fetchAllBookings()
        }
        console.log("isAuthenticated(): ", isAuthenticated());
        console.log("isLoggedIn: ", isLoggedIn);
    }, [isLoggedIn])

    const value = {
        login,
        logout,
        isLoggedIn,
        loginError,
        users,
        setUsers,
        userLoading,
        deleteUser,
        totalUser,

        // User infinite scroll
        fetchMoreUsers,
        hasMoreUsers,
        isLoadingMoreUsers,

        // Listings
        listings,
        setListings,
        setTotalListings,
        totalListings,
        deleteListing,

        // Listing infinite scroll
        fetchMoreListings,
        hasMoreListings,
        isLoadingMoreListings,


        //
        bookings
    }
    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    )
}