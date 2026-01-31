'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, onboardingAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Check onboarding status
                const { data } = await onboardingAPI.getStatus();
                setOnboardingComplete(data.is_complete);
                setUser({ token });
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const { data } = await authAPI.login({ email, password });
            localStorage.setItem('token', data.access_token);

            // Check onboarding
            const onboardingStatus = await onboardingAPI.getStatus();
            setOnboardingComplete(onboardingStatus.data.is_complete);

            setUser({ token: data.access_token });

            if (!onboardingStatus.data.is_complete) {
                router.push('/onboarding');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            throw error;
        }
    };

    const signup = async (fullName, email, password) => {
        try {
            const { data } = await authAPI.signup({
                full_name: fullName,
                email,
                password,
            });
            localStorage.setItem('token', data.access_token);
            setUser({ token: data.access_token });
            setOnboardingComplete(false);
            router.push('/onboarding');
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setOnboardingComplete(false);
        router.push('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                onboardingComplete,
                setOnboardingComplete,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
