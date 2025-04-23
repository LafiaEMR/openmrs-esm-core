import React, { useEffect } from 'react';
import { isDesktop, LeftNavMenu, useLayoutType, useLeftNavStore, useOnClickOutside } from '@openmrs/esm-framework';
import { createPortal } from 'react-dom';

interface SideMenuPanelProps {
  expanded: boolean;
  hidePanel: Parameters<typeof useOnClickOutside>[0];
}

/**
 * This component renders the left navigation menu.
 */
const SideMenuPanel: React.FC<SideMenuPanelProps> = ({ expanded, hidePanel }) => {
  const menuRef = useOnClickOutside(hidePanel, expanded);

  useEffect(() => {
    window.addEventListener('popstate', hidePanel);
    return () => window.removeEventListener('popstate', hidePanel);
  }, [hidePanel]);
  const layout = useLayoutType();
  const { mode } = useLeftNavStore();

  const leftNavContainer = window.document.getElementById('omrs-left-nav-container-root');
  return <>{leftNavContainer && createPortal(<LeftNavMenu ref={menuRef} isChildOfHeader />, leftNavContainer)}</>;
};

export default SideMenuPanel;
