import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { NotificationRecord } from '@/types';
import { router } from '@inertiajs/react';

interface NotificationToastProps {
  notification: NotificationRecord;
  onDismiss: (notificationId: number) => void;
  color: string;
}

export default function NotificationToast({ 
  notification, 
  onDismiss, 
  color
}: NotificationToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => {
      clearTimeout(timeOut);
      setShow(true);
    }
  }, [notification]);

  const handleHideCategory = () => {
    router.post('/notifications/preferences/toggle-category', 
      { category_id: notification.category_id },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setShow(false);
        }
      }
    );
  };

  const handleOnLeave = () => {
    setShow(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <Transition
        show={show}
        appear={true}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 translate-x-full"
        enterTo="opacity-100 translate-x-0"
        leave="transition-all duration-300 ease-in"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-full"
        afterLeave={() => onDismiss(notification.id)}
      >
        <div 
          className={`
            relative w-80 h-36 bg-white dark:bg-gray-800 
            shadow-lg rounded-lg p-4 border-l-4 
            flex flex-col
            transition-all duration-200
            overflow-hidden
          `}
          style={{borderColor: color}}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200 truncate w-full pr-6">
              {notification.title}
            </h3><div className="absolute top-2 right-2 flex space-x-2">
              <button 
                onClick={handleHideCategory}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title={`Не показывать такие уведомления (${notification.category_id})`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
              <button 
                onClick={handleOnLeave}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Закрыть уведомление"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
              {notification.text}
            </p>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
            {notification.category_id}
          </div>
        </div>
      </Transition>
    </div>
  );
}