import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateUser, clearUser } from '../../store/userSlice';
import { auth } from '../../firebaseConfig';
import { updateEmail, updatePassword } from 'firebase/auth';
import Input from '../../custom/Input';
import Button from '../../custom/Button';
import Alert from '../../custom/Alert';
import styles from './styled.module.css';

interface IFormInput {
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<IFormInput>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    reset({
      email: user.email,
    });
  }, [user, reset]);

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    setLoading(true);
    const { email, password } = data;
    try {
      if (auth.currentUser) {
        if (email !== user.email) {
          await updateEmail(auth.currentUser, email);
          dispatch(updateUser(email));
        }
        if (password) {
          await updatePassword(auth.currentUser, password);
        }
      }
      setAlertMessage('Profile updated successfully');
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
        console.error('Error updating profile:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    dispatch(clearUser());
    navigate('/login');
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
          placeholder="Leave blank to keep the same"
          register={register("password", { minLength: { value: 6, message: 'Password must be at least 6 characters long' } })}
        />
        <Button text="Save" loading={loading} />
      </form>
      <p className={styles.logout} onClick={handleLogout}>Выйти</p>
    </div>
  );
};

export default Profile;
