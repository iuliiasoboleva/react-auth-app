# Проект React с регистрацией, авторизацией и профилем пользователя

Это приложение на React, которое позволяет пользователям регистрироваться, авторизовываться и обновлять свои данные в профиле. Приложение использует Firebase для аутентификации и хранения данных пользователей, React Hook Form для управления формами, Redux для управления состоянием и React Router для маршрутизации.

## Доступные скрипты

1. Клонирование репозитория:
git clone https://github.com/iuliiasoboleva/react-auth-app.git

2. Установка зависимостей
npm install

3. Настройка Firebase

Создайте проект в Firebase Console, включите Email/Password аутентификацию и настройте базу данных (Realtime Database).

Скопируйте конфигурацию Firebase и добавьте её в файл .env в корне проекта:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

4. Запуск приложения
npm start

### Основные компоненты

1. Регистрация
Компонент Registration позволяет пользователям регистрироваться в приложении. Если email уже используется, выводится соответствующее сообщение об ошибке.

2. Авторизация
Компонент Login позволяет пользователям авторизовываться в приложении. При ошибке (неверный пароль или несуществующий пользователь) выводится соответствующее сообщение.

3. Профиль
Компонент Profile позволяет пользователям обновлять свои данные (email и пароль). Также предоставляет возможность выйти из аккаунта.

4. Кастомные компоненты
Input - кастомный компонент для ввода данных с поддержкой состояний (default, focus, error).
Button - кастомный компонент кнопки с поддержкой состояний (default, loading, hover, focus).
Alert - кастомный компонент для вывода сообщений.
Используемые библиотеки
React
Redux
React Router
React Hook Form
Firebase
axios

#### Контакты
Для вопросов и предложений вы можете связаться со мной по email: soboleva.iua@gmail.com
