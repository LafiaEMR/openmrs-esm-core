import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, SwitcherItem } from '@carbon/react';
import { UserAvatarIcon, navigate } from '@openmrs/esm-framework';
import styles from './nav-footer-profile.scss';

const FooterNavProfile: React.FC = () => {
  const { t } = useTranslation();
  const viewProfile = () => {
    navigate({ to: 'https://admin.lafialink-dev.com/profile' });
  };

  return (
    <SwitcherItem
      className={styles.panelItemContainer}
      aria-label={t('changeLanguage', 'Change language')}
      onClick={viewProfile}
    >
      <div>
        <UserAvatarIcon size={20} />
        <p>{t('myProfile', 'My Profile')}</p>
      </div>
      <Button kind="ghost" onClick={viewProfile}>
        {t('view', 'View')}
      </Button>
    </SwitcherItem>
  );
};

export default FooterNavProfile;
