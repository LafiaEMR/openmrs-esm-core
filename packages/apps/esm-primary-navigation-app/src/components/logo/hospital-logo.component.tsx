import React from 'react';
import styles from './logo.scss';

const HospitalLogo: React.FC = () => {
  // TODO: Implement a api call to get logged in hospital logo
  const hospitalLogo = {
    src: 'https://static.vecteezy.com/system/resources/thumbnails/017/177/954/small/round-medical-cross-symbol-on-transparent-background-free-png.png',
    alt: 'Hospital logo',
  };

  return (
    <div className={styles.hospitalLogo}>
      <img src={hospitalLogo.src} alt={hospitalLogo.alt} className={styles.logo} />
    </div>
  );
};

export default HospitalLogo;
