import React, { useEffect, useCallback } from 'react';
import { type To, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { navigate as openmrsNavigate, refetchCurrentUser, useConfig, useSession } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import Cookies from 'js-cookie';
import Logo from '../logo.component';
import styles from './login.scss';
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
  const redirectToLoginFailure = () => {
    window.location.href = config.links.loginFailure;
  };
  const handleLogin = useCallback(async () => {
    try {
      const token = JSON.parse(Cookies.get('token') || '');
      const bearerToken = `Bearer ${token}`;

      const authResponse = await axios.get(config.provider.authApiUrl, {
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
      });

      if (!authResponse.data.data) {
        throw new Error('Failed to fetch authentication data from LafiaAuth API');
      }
      // const authData = await authResponse.json();
      // Ensure the data field exists in the response
      // if (!authResponse.data) {
      //   throw new Error('Invalid response format from LafiaAuth API');
      // }
      // Step 2: Use the retrieved data field as the Authorization header
      const encodedCredentials = authResponse.data.data;
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
      // On success store tenant Id
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('tenantId', decodedToken.tenantId);
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
  }, [user, loginProvider, handleLogin]);
  return (
    <div className={styles.center}>
      <Logo t={t} />
    </div>
  );
};
export default Login;
