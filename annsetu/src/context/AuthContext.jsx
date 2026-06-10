import { createContext, useContext, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMe, logoutUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // On first load, check with backend if we have a valid cookie session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getMe();
        if (data.success) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (token, newUser) => {
    // We ignore 'token' because the backend sets it as an HttpOnly cookie
    // but we support the existing function signature.
    const userToSet = newUser || token; 
    setUser(userToSet);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
      queryClient.clear();
      // Clear legacy local storage tokens just in case
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this anywhere in the app
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
