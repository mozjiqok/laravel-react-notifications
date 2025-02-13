import React, { FormEvent, useRef, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { NotificationCategory, NotificationRecord, PageProps } from '@/types';
import Modal from '@/Components/Modal';

interface NotificationsPageProps extends PageProps {
  notifications: {
    data: NotificationRecord[];
    current_page: number;
    last_page: number;
    total: number;
  };
  categories: NotificationCategory[]
}

export default function Notifications({ 
  notifications,
  categories
}: NotificationsPageProps) {
  const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
    id: null as number | null,
    title: '',
    text: '',
    category_id: null as number | null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [deletingNotification, setDeletingNotification] = useState<NotificationRecord | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (isEditing && data.id) {
      put(`/notifications/${data.id}`, {
        onSuccess: () => {
          setIsEditing(false);
          resetForm();
        }
      });
    } else {
      post('/notifications', {
        onSuccess: () => {
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setData({
      id: null,
      title: '',
      text: '',
      category_id: null
    });
    setIsEditing(false);
  };

  const handleEdit = (notification: NotificationRecord) => {
    setIsEditing(true);
    setData({
      id: notification.id,
      title: notification.title,
      text: notification.text,
      category_id: notification.category_id
    });
    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const confirmDelete = (notification: NotificationRecord) => {
    setDeletingNotification(notification);
  };

  const handleDelete = () => {
    if (deletingNotification) {
      destroy(`/notifications/${deletingNotification.id}`, {
        onSuccess: () => {
          setDeletingNotification(null);
        }
      });
    }
  };

  const cancelDelete = () => {
    setDeletingNotification(null);
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Уведомления</h2>}
    >
      <Head title="Уведомления" />

      <Modal 
        show={!!deletingNotification} 
        onClose={cancelDelete}
        maxWidth="md"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
            Подтвердите удаление
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Вы уверены, что хотите удалить уведомление "{deletingNotification?.title}"?
            Это действие нельзя отменить.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={cancelDelete}
              className="bg-gray-500 hover:bg-gray-700 
                text-white font-bold py-2 px-4 rounded 
                dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 
                text-white font-bold py-2 px-4 rounded 
                dark:bg-red-600 dark:hover:bg-red-700"
            >
              Удалить
            </button>
          </div>
        </div>
      </Modal>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="mb-6 bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8"
          >
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Заголовок
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
                maxLength={240}
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 dark:text-gray-200 
                  bg-white dark:bg-gray-700 
                  border-gray-300 dark:border-gray-600 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Текст
              </label>
              <textarea
                value={data.text}
                onChange={(e) => setData('text', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 dark:text-gray-200 
                  bg-white dark:bg-gray-700 
                  border-gray-300 dark:border-gray-600 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Категория
              </label>
              <select
                value={data.category_id ?? ''}
                onChange={(e) => setData('category_id', Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 dark:text-gray-200 
                  bg-white dark:bg-gray-700 
                  border-gray-300 dark:border-gray-600 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option 
                    key={category.id} 
                    value={category.id}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                type="submit" 
                disabled={processing}
                className="bg-blue-500 hover:bg-blue-700 
                  text-white font-bold py-2 px-4 rounded 
                  dark:bg-blue-600 dark:hover:bg-blue-700 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Изменить' : 'Создать'} уведомление
              </button>
              
              {isEditing && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-700 
                    text-white font-bold py-2 px-4 rounded 
                    dark:bg-gray-600 dark:hover:bg-gray-700"
                >
                  Отмена
                </button>
              )}
            </div>
          </form>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {notifications.data.map((notification) => (
              <div 
                  key={notification.id} 
                  className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-start space-x-4"
              >
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 truncate">
                        {notification.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 break-words max-h-24 overflow-auto">
                        {notification.text}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-500 block mt-2 flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                        style={{ 
                          backgroundColor: notification.category.color
                        }}
                      />
                      Категория: {notification.category.name} |
                      Просмотры: {notification.view_counter}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                        onClick={() => handleEdit(notification)}
                        className="bg-yellow-500 hover:bg-yellow-700 
                        text-white font-bold py-2 px-4 rounded 
                        dark:bg-yellow-600 dark:hover:bg-yellow-700
                        w-full sm:w-auto text-sm"
                      >
                        Изменить
                      </button>
                      <button 
                        onClick={() => confirmDelete(notification)}
                        className="bg-red-500 hover:bg-red-700 
                        text-white font-bold py-2 px-4 rounded 
                        dark:bg-red-600 dark:hover:bg-red-700
                        w-full sm:w-auto text-sm"
                      >
                        Удалить
                      </button>
                  </div>
              </div>
              ))}
            </div>
            
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Показано {notifications.data.length} из {notifications.total} уведомлений
              </div>
              <div className="flex space-x-2">
                {notifications.current_page > 1 && (
                  <Link
                    href={route('notifications.index', { page: notifications.current_page - 1 })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                      bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                      rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Предыдущая
                  </Link>
                )}

                {notifications.current_page < notifications.last_page && (
                  <Link
                    href={route('notifications.index', { page: notifications.current_page + 1 })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                      bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                      rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Следующая
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}