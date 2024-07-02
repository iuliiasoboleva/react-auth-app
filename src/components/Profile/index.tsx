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
            setAlertMessage('Успешно изменено');
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setError('email', {
                    type: 'manual',
                    message: 'Такой email уже занят'
                });
                setAlertMessage('Пользователь с таким email уже зарегистрирован');
            } else if (error.code === 'auth/weak-password') {
                setError('password', {
                    type: 'manual',
                    message: 'Пароль должен содержать не менее 6 символов'
                });
            } else if (error.code === 'auth/requires-recent-login') {
                setAlertMessage('Вам необходимо повторно войти в систему, чтобы изменить данные.');
            } else {
                console.error('Error updating profile:', error);
                setAlertMessage('Произошла ошибка при обновлении профиля. Попробуйте еще раз.');
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
            <h3 className={styles.title}>Изменение данных</h3>
            {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Input
                    label="Email"
                    error={errors.email?.message}
                    register={register("email", { required: 'Необходимо ввести email' })}
                    defaultValue={user.email} // Предзаполнение email
                />
                <Input
                    label="Пароль"
                    error={errors.password?.message}
                    type="password"
                    register={register("password", { minLength: { value: 6, message: 'Пароль должен содержать не менее 6 символов' } })}
                />
                <Button text="Сохранить" loading={loading} />
            </form>
            <p className={styles.logout} onClick={handleLogout}>Выйти</p>
        </div>
    );
};

export default Profile;
