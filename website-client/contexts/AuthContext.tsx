import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getProfile } from '../services/api';

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // Restore user from localStorage
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setIsLoggedIn(true);

                    // Optionally fetch fresh user data from backend
                    try {
                        const response = await getProfile();
                        setUser(response.data);
                        localStorage.setItem('user', JSON.stringify(response.data));
                    } catch (error) {
                        // If profile fetch fails, use cached user data
                        console.error('Failed to fetch profile:', error);
                    }
                } catch (error) {
                    // If parsing fails, clear invalid data
                    console.error('Failed to parse user data:', error);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
