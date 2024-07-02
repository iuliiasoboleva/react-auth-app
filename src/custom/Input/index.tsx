import React, { useState, useEffect } from 'react';
import styles from './styled.module.css';

interface InputProps {
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  register: any;
  defaultValue?: string;
}

const Input: React.FC<InputProps> = ({ label, error, type = 'text', placeholder, register, defaultValue }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!defaultValue);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(event.target.value !== '');
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <label className={`${styles.label} ${isFocused || hasValue ? styles.labelFocused : ''}`}>{label}</label>
        <input
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          type={type}
          placeholder={placeholder}
          {...register}
          onFocus={handleFocus}
          onBlur={handleBlur}
          defaultValue={defaultValue}
        />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Input;
