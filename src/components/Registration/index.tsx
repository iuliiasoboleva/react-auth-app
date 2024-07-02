import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Input from '../../custom/Input';
import Button from '../../custom/Button';
import Alert from '../../custom/Alert';
import styles from './styled.module.css';

interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
}

const Registration: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<IFormInput>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    setLoading(true);
    const { email, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      setLoading(false);
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/login');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('email', {
          type: 'manual',
          message: 'Email already in use'
        });
        setAlertMessage('Пользователь с таким email уже зарегистрирован');
      } else if (error.code === 'auth/weak-password') {
        setError('password', {
          type: 'manual',
          message: 'Password should be at least 6 characters'
        });
      } else {
        console.error('Error creating user:', error);
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          error={errors.email?.message}
          register={register("email", { required: 'Email is required' })}
        />
        <Input
          label="Password"
          error={errors.password?.message}
          type="password"
          register={register("password", { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } })}
        />
        <Input
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          type="password"
          register={register("confirmPassword", { required: 'Confirm Password is required' })}
        />
        <Button text="Register" loading={loading} />
      </form>
      <p>
        Уже зарегистрированы? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default Registration;
