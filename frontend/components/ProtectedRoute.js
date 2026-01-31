'use client';

import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, requireOnboarding = false }) {
    const { user, loading, onboardingComplete } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (requireOnboarding && !onboardingComplete) {
                router.push('/onboarding');
            }
        }
    }, [user, loading, onboardingComplete, requireOnboarding, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user || (requireOnboarding && !onboardingComplete)) {
        return null;
    }

    return children;
}
