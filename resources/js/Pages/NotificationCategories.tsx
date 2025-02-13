import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { NotificationCategory } from '@/types';
import Modal from '@/Components/Modal';

export default function NotificationCategories({ 
  categories,
}: PageProps<{ 
  categories:  {
    data: NotificationCategory[];
    current_page: number;
    last_page: number;
    total: number;
  }
}>) {
  const [isEditing, setIsEditing] = useState<NotificationCategory | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState<NotificationCategory | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    id: null as number | null,
    name: '',
    color: '#000000',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      put(route('notification-categories.update', { notification_category: data.id }), {
        onSuccess: () => {
          reset();
          setIsEditing(null);
        }
      });
    } else {
      post(route('notification-categories.store'), {
        onSuccess: () => {
          reset();
        }
      });
    }
  };

  const startEditing = (category: NotificationCategory) => {
    setIsEditing(category);
    setData({
      id: Number(category.id),
      name: category.name,
      color: category.color,
      description: category.description || '',
    });

    if (formRef.current) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } 
  };

  const handleDelete = (category: NotificationCategory) => {
    setIsDeletingCategory(category);
  };

  const confirmDelete = () => {
    if (isDeletingCategory) {
      destroy(`notification-categories/${isDeletingCategory.id}`, {
        onSuccess: () => {
          setIsDeletingCategory(null);
        }
      });
    }
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Категории уведомлений</h2>}
    >
      <Head title="Категории уведомлений" />
      
      <Modal 
        show={!!isDeletingCategory} 
        onClose={() => setIsDeletingCategory(null)}
        maxWidth="md"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">
            Подтвердите удаление
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Вы уверены, что хотите удалить категорию "{isDeletingCategory?.name}"?
            Это действие нельзя отменить.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsDeletingCategory(null)}
              className="bg-gray-500 hover:bg-gray-700 
                text-white font-bold py-2 px-4 rounded 
                dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              Отмена
            </button>
            <button
              onClick={confirmDelete}
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
            onSubmit={handleSubmit}
            className="mb-6 bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8"
            ref={formRef}
          >
            <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Название
              </label>
              <input
                type="text"
                id="name"
                value={data.name}
                maxLength={255}
                onChange={(e) => setData('name', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 dark:text-gray-200 
                  bg-white dark:bg-gray-700 
                  border-gray-300 dark:border-gray-600 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label 
                htmlFor="color" 
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >
                Цвет
              </label>
              <input
                type="color"
                id="color"
                value={data.color}
                onChange={(e) => setData('color', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                  shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                  focus:ring-opacity-50 dark:bg-gray-900"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Описание (не обязательно)
              </label>
              <input
                type="text"
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 
                  text-gray-700 dark:text-gray-200 
                  bg-white dark:bg-gray-700 
                  border-gray-300 dark:border-gray-600 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                {isEditing ? 'Обновить' : 'Создать'}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setIsEditing(null);
                  }}
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
              {categories.data.map((category) => (
                <div 
                  key={category.id} 
                  className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-start space-x-4"
                >
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-6 h-6 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="text-gray-600 dark:text-gray-400 break-words max-h-24 overflow-auto">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                      onClick={() => startEditing(category)}
                      className="bg-yellow-500 hover:bg-yellow-700 
                      text-white font-bold py-2 px-4 rounded 
                      dark:bg-yellow-600 dark:hover:bg-yellow-700
                      w-full sm:w-auto text-sm"
                    >
                      Изменить
                    </button>
                    <button 
                      onClick={() => handleDelete(category)}
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
                Показано {categories.data.length} из {categories.total} уведомлений
              </div>
              <div className="flex space-x-2">
                {categories.current_page > 1 && (
                  <Link
                    href={route('notifications.index', { page: categories.current_page - 1 })}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                      bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                      rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Предыдущая
                  </Link>
                )}

                {categories.current_page < categories.last_page && (
                  <Link
                    href={route('notifications.index', { page: categories.current_page + 1 })}
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