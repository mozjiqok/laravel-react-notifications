# laravel-react-notifications

## Стэк
- [Laravel](https://laravel.com/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Inertia](https://inertiajs.com/)
- [Ziggy](https://tightenco.com/ziggy/)
- [Vite](https://vitejs.dev/)

## Установка
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate 
npm install && npm run build
composer run dev
```

## Функционал
- Регистрация и авторизация
- Создание и управление котагориями уведомлений
- Создание и управление уведомлениями
- Отображение уведомлений
- Счетчик просмотров уведомлений
- Отписка от категории уведомлений