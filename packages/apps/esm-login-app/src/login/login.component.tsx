import React, { useEffect, useCallback } from 'react';
import { type To, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { navigate as openmrsNavigate, refetchCurrentUser, useConfig, useSession } from '@openmrs/esm-framework';
import { type ConfigSchema } from '../config-schema';
import { Loading } from '@carbon/react';
import Cookies from 'js-cookie';

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

  const encodedCredentials = Cookies.get('cred') || '';

  const redirectToLoginFailure = () => {
    window.location.href = config.links.loginFailure;
  };

  const handleLogin = useCallback(async () => {
    try {
      const decodedCredentials = atob(encodedCredentials);
      const [username, password] = decodedCredentials.split(':');

      const sessionStore = await refetchCurrentUser(username, password);
      const session = sessionStore.session;
      const authenticated = sessionStore?.session?.authenticated;
      if (authenticated) {
        Cookies.remove('cred'); // remove the credentials from the cookies
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
