import React, { useEffect, useCallback } from 'react';
import { type To, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { navigate as openmrsNavigate, refetchCurrentUser, useConfig, useSession } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import { Loading } from '@carbon/react';
import axios from 'axios';

export interface LoginReferrer {
  referrer?: string;
}

const Login: React.FC = () => {
  const config = useConfig();
  const { provider: loginProvider, links: loginLinks } = useConfig<ConfigSchema>();
  const { t } = useTranslation();
  const { user } = useSession();
  const location = useLocation() as unknown as Omit<Location, 'state'> & {
    state: LoginReferrer;
  };
  const rawNavigate = useNavigate();
  const navigate = useCallback(
    (to: To) => {
      rawNavigate(to, { state: location.state });
    },
    [rawNavigate, location.state],
  );
  const [searchParams] = useSearchParams();
  const encodedCredentials = searchParams.get('accessToken');

  // Get user ID from token cache
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Remove any quotes and decode URI component
        const cleanToken = token.replace(/^["']|["']$/g, '');
        const decodedToken = decodeURIComponent(cleanToken);

        // Split the JWT token into its parts
        const [header, payload, signature] = decodedToken.split('.');

        // Decode the payload
        const decodedPayload = atob(payload);
        const payloadData = JSON.parse(decodedPayload);

        return payloadData.userId;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID from token:', error);
      return null;
    }
  };

  // Check KYC verification status
  const checkKYCStatus = async (userId: number) => {
    try {
      const response = await axios.get(`https://dev-api.lafialink-dev.com/api/v1/user/findUserById/${userId}`);
      if (response.data.status === 'SUCCESS' && response.data.data) {
        return response.data.data.kycComplete;
      }
      return false;
    } catch (error) {
      console.error('Error checking KYC status:', error);
      return false;
    }
  };

  const redirectToLoginFailure = () => {
    window.location.href = config.links.loginFailure;
  };

  const handleLogin = useCallback(async () => {
    try {
      // Get user ID from token cache
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('User ID not found in token');
      }

      // Check KYC status
      const isKYCVerified = await checkKYCStatus(userId);
      if (!isKYCVerified) {
        redirectToLoginFailure();
      }

      const decodedCredentials = atob(encodedCredentials);
      const [username, password] = decodedCredentials.split(':');

      const sessionStore = await refetchCurrentUser(username, password);
      const session = sessionStore.session;
      const authenticated = sessionStore?.session?.authenticated;
      if (authenticated) {
        if (session.sessionLocation) {
          let to = loginLinks?.loginSuccess || '/home';
          if (location?.state?.referrer) {
            if (location.state.referrer.startsWith('/')) {
              to = `\${openmrsSpaBase}${location.state.referrer}`;
            } else {
              to = location.state.referrer;
            }
          }
          openmrsNavigate({ to });
        } else {
          navigate('/login/location');
        }
      } else {
        throw new Error(t('invalidCredentials', 'Invalid username or password'));
      }
      return true;
    } catch (error: unknown) {
      redirectToLoginFailure();
    }
  }, []);
  useEffect(() => {
    const initiateLogin = async () => {
      await handleLogin();
    };
    initiateLogin();
  }, [user, loginProvider, handleLogin, encodedCredentials]);

  return <Loading />;
};

export default Login;
