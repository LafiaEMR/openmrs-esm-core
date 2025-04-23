import { Button, Stack, Switcher } from '@carbon/react';
import { ArrowRight, Logout } from '@carbon/react/icons';
import { useTranslation } from 'react-i18next';
import { CloseIcon, useSession, navigate, ExtensionSlot } from '@openmrs/esm-framework';
import React, { useCallback, useState, useMemo } from 'react';
import { convertToLowerCase, getFirstTwoInitials, truncateText } from '../../helpers/utils';
import styles from './sideNavFooter.module.scss';
import ReactDOM from 'react-dom';

const SideNavFooter = () => {
  const session = useSession();
  const [activeHeaderPane, setActiveHeaderPane] = useState<string | null>(null);

  const isActivePane = useCallback((panelName: string) => activeHeaderPane === panelName, [activeHeaderPane]);

  const togglePane = useCallback((panelName: string) => {
    setActiveHeaderPane((prev) => (prev === panelName ? null : panelName));
  }, []);

  const hidePane = useCallback(
    (panelName: string) => () => {
      setActiveHeaderPane((prev) => (prev === panelName ? null : prev));
    },
    [],
  );

  const { t } = useTranslation();

  const user = session?.user;

  const logout = useCallback(() => {
    navigate({ to: 'https://auth.lafialink-dev.com/logout' });
  }, []);

  const name = user?.person?.display;

  const handleBackdropClick = (event: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not its children
    if (event.target === event.currentTarget) {
      setActiveHeaderPane(null);
    }
  };

  const renderPanel = () => {
    if (!isActivePane('userMenu')) return null;

    return ReactDOM.createPortal(
      <div className={styles.nav_footer_panel_backdrop} onClick={handleBackdropClick}>
        <div className={styles.nav_footer_panel}>
          <Switcher aria-label="Switcher Container">
            <ExtensionSlot className={styles.fullWidth} name="nav-footer-panel-slot" />
          </Switcher>
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <Stack gap={4} className={styles.side_nav_footer_container}>
      <div className={styles.side_nav_profile_container} role="link" tabIndex={0} data-testId="profile-link">
        <div className={styles.side_nav_profile}>
          <span>{getFirstTwoInitials(name || '')}</span>

          <div>
            <h3 title={name}>{truncateText(name || '', 8)}</h3>
            <p>{convertToLowerCase(user?.roles[0]?.display || '')}</p>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: '50%',
            background: '#FAFAFA',
            cursor: 'pointer',
          }}
          onClick={() => togglePane('userMenu')}
          data-testid="toggle-user-menu"
        >
          {isActivePane('userMenu') ? <CloseIcon size={20} /> : <ArrowRight size={20} />}
        </div>
      </div>

      {renderPanel()}

      <Button
        size="md"
        style={{
          width: '100%',
          background: '#FAFAFA',
          color: '#DA1E28',
          fontWeight: 'bold',
          position: 'relative',
        }}
        onClick={logout}
        data-testId="logout-btn"
      >
        Logout
        <Logout style={{ position: 'absolute', right: '1rem' }} />
      </Button>
    </Stack>
  );
};

export default SideNavFooter;
