import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
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
                message: 'Пароли не совпадают'
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
                    message: 'Такой email уже занят'
                });
                setAlertMessage('Пользователь с таким email уже зарегистрирован');
            } else if (error.code === 'auth/weak-password') {
                setError('password', {
                    type: 'manual',
                    message: 'Пароль должен содержать не менее 6 символов'
                });
            } else {
                console.error('Error creating user:', error);
            }
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Регистрация</h3>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <Input
                    label="Email"
                    error={errors.email?.message}
                    register={register("email", { required: 'Необходимо ввести email' })}
                />
                <Input
                    label="Придумайте пароль"
                    error={errors.password?.message}
                    type="password"
                    register={register("password", { required: 'Необходимо ввести пароль', minLength: { value: 6, message: 'Пароль должен содержать не менее 6 символов' } })}
                />
                <Input
                    label="Повторите пароль"
                    error={errors.confirmPassword?.message}
                    type="password"
                    register={register("confirmPassword", { required: 'Необходимо подтверждение пароля' })}
                />
                <Button text="Зарегистрироваться" loading={loading} />
            </form>
            <p className={styles.text}>
                Уже зарегистрированы? <Link to="/login">Войти</Link>
            </p>
            {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage(null)} />}
        </div>
    );
};

export default Registration;
