import React, { useState } from 'react';
import styles from './styled.module.css';

interface InputProps {
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  register: any;
}

const Input: React.FC<InputProps> = ({ label, error, type = 'text', placeholder, register }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        className={`${styles.input} ${error ? styles.inputError : isFocused ? styles.inputFocus : ''}`}
        type={type}
        placeholder={placeholder}
        {...register}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;
