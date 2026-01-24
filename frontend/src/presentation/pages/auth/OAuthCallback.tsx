import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { storageService } from '../../../infrastructure/services/StorageService'; // Adjust path
import { useAuth } from '../../contexts/AuthContext'; // Adjust path

export const OAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth(); // We might need a different method in AuthContext to just "set user" from token, 
    // but login() typically takes credentials. 
    // Actually, if we have a token, we can just save it and reload/fetch profile?
    // Let's check AuthContext. It has 'login' but maybe we just need 'setUser'.
    // We'll update AuthContext if needed, or just reload the page/trigger a check.

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            console.log('OAuthCallback: Token received', token);

            // Save token
            storageService.setAccessToken(token);

            // Decode token to get user info (optional, or just fetch profile)
            // Ideally, we should fetch user profile from backend using the token.
            // But for now, let's assume successful login triggers a reload or we manually update state.

            // Since AuthContext checks storage on mount, a simple reload might work, 
            // or we can just navigate to dashboard and let the app state catch up (though it might need a trigger).

            // Force reload to ensure AuthContext picks up the new token
            window.location.href = '/dashboard';

        } else {
            console.error('OAuthCallback: No token found');
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h2>Logging you in...</h2>
            {/* GLOBAL LOADING SPINNER HERE IF AVAILABLE */}
        </div>
    );
};
