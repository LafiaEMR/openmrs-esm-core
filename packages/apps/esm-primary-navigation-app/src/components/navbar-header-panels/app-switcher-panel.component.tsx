import React from 'react';

import { appSwitcherLinks } from './helper/constants';
import AppswitchArrow from '../../../public/svg/appSwitchArrow';
import styles from './app-switcher-panel.scss';
import { Link } from 'react-router-dom';

function AppSwitcherPanel({ menuOpen }: { menuOpen: boolean }) {
  return (
    <div>
      {' '}
      {menuOpen && (
        <div className={styles.menu}>
          <p className={styles.menu_item_title}>My Apps</p>
          {appSwitcherLinks.map(({ name, href, Icon }, index) => (
            <Link to={href}>
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
