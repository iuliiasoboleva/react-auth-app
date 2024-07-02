import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Input from '../../custom/Input';
import Button from '../../custom/Button';
import Alert from '../../custom/Alert';
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
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const onSubmit: SubmitHandler<IFormInput> = async data => {
        setLoading(true);
        const { email, password } = data;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            dispatch(setUser(email));
            navigate('/profile');
        } catch (error: any) {
            handleAuthErrors(error);
            setLoading(false);
        }
    };

    const handleAuthErrors = (error: any) => {
        switch (error.code) {
            case 'auth/wrong-password':
                setError('password', {
                    type: 'manual',
                    message: 'Неверный пароль. Пароль должен содержать не менее 6 символов.'
                });
                break;
            case 'auth/user-not-found':
                setError('email', {
                    type: 'manual',
                    message: 'Пользователь не найден'
                });
                break;
            case 'auth/invalid-credential':
                setError('email', {
                    type: 'manual',
                    message: 'Неверные данные. Проверьте email или пароль.'
                });
                break;
            case 'auth/too-many-requests':
                setAlertMessage('Слишком много попыток входа. Попробуйте позже.');
                break;
            default:
                setAlertMessage('Ошибка. Попробуйте позже.');
                break;
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Авторизация</h3>
            {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Input
                    label="Email"
                    error={errors.email?.message}
                    register={register("email", { required: 'Необходимо ввести email' })}
                />
                <Input
                    label="Пароль"
                    error={errors.password?.message}
                    type="password"
                    register={register("password", { required: 'Необходимо ввести пароль', minLength: { value: 6, message: 'Пароль должен содержать не менее 6 символов' } })}
                />
                <Button text="Авторизоваться" loading={loading} />
            </form>
            <p className={styles.text}>
                Ещё не зарегистрированы? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default Login;
