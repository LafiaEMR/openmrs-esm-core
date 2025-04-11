import React, { useEffect } from 'react';

import { appSwitcherLinks } from './helper/constants';
import AppswitchArrow from '../../../public/svg/appSwitchArrow';
import styles from './app-switcher-panel.scss';
import { Link } from 'react-router-dom';
import { useOnClickOutside } from '@openmrs/esm-framework';

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

  return (
    <div ref={appSwitcherRef}>
      {' '}
      {menuOpen && (
        <div className={styles.menu}>
          <p className={styles.menu_item_title}>My Apps</p>
          {appSwitcherLinks.map(({ name, href, Icon }, index) => (
            <Link key={name} to={href}>
              <div className={styles.menu_container}>
                <div className={styles.menu_container2}>
                  <Icon />
                  <p className={styles.menu_item}>{name}</p>
                </div>
                {index == 1 && <AppswitchArrow />}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppSwitcherPanel;
