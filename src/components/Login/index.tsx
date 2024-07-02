import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Input from '../../custom/Input';
import Button from '../../custom/Button';
import styles from './styled.module.css';

interface IFormInput {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<IFormInput>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    setLoading(true);
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser(email));
      navigate('/profile');
    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        setError('password', {
          type: 'manual',
          message: 'Incorrect password. Make sure it contains at least 6 characters.'
        });
      } else if (error.code === 'auth/user-not-found') {
        setError('email', {
          type: 'manual',
          message: 'User not found'
        });
      } else {
        console.error('Error signing in user:', error);
      }
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
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
        <Button text="Login" loading={loading} />
      </form>
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default Login;
