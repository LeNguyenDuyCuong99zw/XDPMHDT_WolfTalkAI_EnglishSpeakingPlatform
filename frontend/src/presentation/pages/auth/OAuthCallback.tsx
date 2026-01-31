import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { storageService } from '../../../infrastructure/services/StorageService'; // Adjust path


export const OAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // AuthContext state will be updated on page reload since it checks storage on mount

    useEffect(() => {
        const token = searchParams.get('token');
        const isNewUser = searchParams.get('isNewUser') === 'true';

        if (token) {
            console.log('OAuthCallback: Token received', token);

            // Save token
            storageService.setAccessToken(token);

            // Set flags for UX (consistent with LoginPage)
            if (isNewUser) {
                sessionStorage.setItem("isFirstLogin", "true");
            } else {
                sessionStorage.setItem("isWelcomeBack", "true");
            }

            // Force reload to ensure AuthContext picks up the new token
            // Redirect to dashboard (RequirePlacementTest will handle redirection if needed)
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
