// // // // // 'use client'
// // // // // import { productsDummyData, userDummyData } from "@/assets/assets";
// // // // // import { useUser,useAuth } from "@clerk/nextjs";


// // // // // import axios from "axios";
// // // // // // import { headers } from "next/headers";
// // // // // import { useRouter } from "next/navigation";
// // // // // import { createContext, useContext, useEffect, useState } from "react";
// // // // // import toast from "react-hot-toast";

// // // // // export const AppContext = createContext();

// // // // // export const useAppContext = () => {
// // // // //     return useContext(AppContext)
// // // // // }

// // // // // export const AppContextProvider = (props) => {

// // // // //     const currency = process.env.NEXT_PUBLIC_CURRENCY
// // // // //     const router = useRouter()
// // // // //     const { user }=useUser()
// // // // //     const {getToken}=useAuth()

// // // // //     const [products, setProducts] = useState([])
// // // // //     const [userData, setUserData] = useState(false)
// // // // //     const [isSeller, setIsSeller] = useState(false)
// // // // //     const [cartItems, setCartItems] = useState({})

// // // // //     const fetchProductData = async () => {
// // // // //         setProducts(productsDummyData)
// // // // //     }

// // // // //     const fetchUserData = async () => {
// // // // //         try {
// // // // //             if(user.publicMetadata.role==="seller") {
// // // // //                 setIsSeller(true)
// // // // //             }
// // // // //             const token= await getToken()
// // // // //             const {data}=await axios.get("/api/user/data",{ headers: {Authorization: `Bearer ${token}`}})
// // // // //             if(user.success){
// // // // //                 setUserData(data.user)
// // // // //                 setCartItems(data.user.cartItems)
// // // // //             }
// // // // //             else {
// // // // //                 toast.error(data.message)
// // // // //             }
     
// // // // //         }
// // // // //         catch(error) {
// // // // //             toast.error(error.message)
// // // // //         }
 
// // // // //     }

// // // // //     const addToCart = async (itemId) => {

// // // // //         let cartData = structuredClone(cartItems);
// // // // //         if (cartData[itemId]) {
// // // // //             cartData[itemId] += 1;
// // // // //         }
// // // // //         else {
// // // // //             cartData[itemId] = 1;
// // // // //         }
// // // // //         setCartItems(cartData);

// // // // //     }

// // // // //     const updateCartQuantity = async (itemId, quantity) => {

// // // // //         let cartData = structuredClone(cartItems);
// // // // //         if (quantity === 0) {
// // // // //             delete cartData[itemId];
// // // // //         } else {
// // // // //             cartData[itemId] = quantity;
// // // // //         }
// // // // //         setCartItems(cartData)

// // // // //     }

// // // // //     const getCartCount = () => {
// // // // //         let totalCount = 0;
// // // // //         for (const items in cartItems) {
// // // // //             if (cartItems[items] > 0) {
// // // // //                 totalCount += cartItems[items];
// // // // //             }
// // // // //         }
// // // // //         return totalCount;
// // // // //     }

// // // // //     const getCartAmount = () => {
// // // // //         let totalAmount = 0;
// // // // //         for (const items in cartItems) {
// // // // //             let itemInfo = products.find((product) => product._id === items);
// // // // //             if (cartItems[items] > 0) {
// // // // //                 totalAmount += itemInfo.offerPrice * cartItems[items];
// // // // //             }
// // // // //         }
// // // // //         return Math.floor(totalAmount * 100) / 100;
// // // // //     }

// // // // //     useEffect(() => {
// // // // //         fetchProductData()
// // // // //     }, [])

// // // // //     useEffect(() => {
// // // // //         fetchUserData()
// // // // //     }, [])

// // // // //     const value = {
// // // // //         user,getToken,
// // // // //         currency, router,
// // // // //         isSeller, setIsSeller,
// // // // //         userData, fetchUserData,
// // // // //         products, fetchProductData,
// // // // //         cartItems, setCartItems,
// // // // //         addToCart, updateCartQuantity,
// // // // //         getCartCount, getCartAmount
// // // // //     }

// // // // //     return (
// // // // //         <AppContext.Provider value={value}>
// // // // //             {props.children}
// // // // //         </AppContext.Provider>
// // // // //   )
// // // // // }



 'use client'

 import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY;
    const router = useRouter();
    const { isLoaded, user } = useUser();
    const { getToken } = useAuth();

    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [cartItems, setCartItems] = useState({});

    const fetchProductData = async () => {
        setProducts(productsDummyData);
    };

    const fetchUserData = async () => {

        try {
            if (!isLoaded || !user) return;
            
            if (user.publicMetadata?.role === "seller") {
                setIsSeller(true);
            }
            
            const token = await getToken();
            const { data } = await axios.get("/api/user/data", {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (data?.success) {
                setUserData(data.user);
                setCartItems(data.user?.cartItems || {});
            } else {
                toast.error(data?.message || "Failed to fetch user data");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // 1. Define addToCart function properly
    const addToCart = async (itemId) => {
        const newCartItems = { ...cartItems };
        newCartItems[itemId] = (newCartItems[itemId] || 0) + 1;
        setCartItems(newCartItems);
        
        try {
            const token = await getToken();
            await axios.post("/api/cart/add", { itemId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            toast.error("Failed to update cart");
            // Revert on error
            setCartItems(cartItems);
        }
    };

    
    // 2. Define updateCartQuantity function
    const updateCartQuantity = async (itemId, quantity) => {
        const newCartItems = { ...cartItems };
        if (quantity <= 0) {
            delete newCartItems[itemId];
        } else {
            newCartItems[itemId] = quantity;
        }
        setCartItems(newCartItems);
        
        try {
            const token = await getToken();
            await axios.put("/api/cart/update", { itemId, quantity }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            toast.error("Failed to update cart quantity");
            setCartItems(cartItems);
        }
    };

    // 3. Define getCartCount function
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, qty) => total + qty, 0);
    };

    // 4. Define getCartAmount function
    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, qty]) => {
            const product = products.find(p => p._id === itemId);
            return total + (product?.offerPrice || 0) * qty;
        }, 0);
    };

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            fetchUserData();
        }
    }, [isLoaded, user]);

    // 5. Make sure all functions are included in the context value
    const value = {
        user,
        getToken,
        currency,
        router,
        isSeller,
        setIsSeller,
        userData,
        fetchUserData,
        products,
        cartItems,
        setCartItems,
        addToCart,       // Now properly included
        updateCartQuantity,  // Included
        getCartCount,    // Included
        getCartAmount    // Included
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
