import React from 'react';
import styles from './styled.module.css';

interface ButtonProps {
  text: string;
  loading?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, loading = false, onClick }) => {
  return (
    <button
      className={`${styles.button} ${loading ? styles.loading : ''}`}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <div className={styles.loader}></div>
      ) : (
        text
      )}
    </button>
  );
};

export default Button;
