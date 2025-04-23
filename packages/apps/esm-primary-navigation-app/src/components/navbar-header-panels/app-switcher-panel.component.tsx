import React, { useCallback, useEffect } from 'react';

import { appSwitcherLinks } from './helper/constants';
import AppswitchArrow from '../../../public/svg/appSwitchArrow';
import styles from './app-switcher-panel.scss';
import { navigate , useOnClickOutside } from '@openmrs/esm-framework';

interface AppSwitcherProps {
  menuOpen: boolean;
  hidePanel: () => void;
}

function AppSwitcherPanel({ menuOpen, hidePanel }: AppSwitcherProps) {
  const appSwitcherRef = useOnClickOutside<HTMLDivElement>(hidePanel, menuOpen);

  useEffect(() => {
    window.addEventListener('popstate', hidePanel);
    return () => window.removeEventListener('popstate', hidePanel);
  }, [hidePanel]);

  const handleLinkClick = useCallback((href: string) => {
    navigate({ to: href });
  }, []);

  return (
    <div ref={appSwitcherRef}>
      {' '}
      {menuOpen && (
        <div className={styles.menu}>
          <p className={styles.menu_item_title}>My Apps</p>
          {appSwitcherLinks.map(({ name, href, Icon }, index) => (
            <div
              key={name}
              className={styles.menu_container}
              onClick={() => handleLinkClick(href)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.menu_container2}>
                <Icon />
                <p className={styles.menu_item}>{name}</p>
              </div>
              {index == 1 && <AppswitchArrow />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppSwitcherPanel;
