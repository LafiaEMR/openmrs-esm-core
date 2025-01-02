import React from 'react';
import styles from './logo.scss';

const HospitalLogo: React.FC = () => {
  // TODO: Implement a api call to get logged in hospital logo
  const hospitalLogo = { src: 'https://www.svgrepo.com/show/9275/atom.svg', alt: 'Hospital Logo' };

  return (
    <div className={styles.hospitalLogo}>
      <img src={hospitalLogo.src} alt={hospitalLogo.alt} className={styles.logo} />
    </div>
  );
};

export default HospitalLogo;
