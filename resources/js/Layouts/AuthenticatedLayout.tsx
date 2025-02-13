import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { router, usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import NotificationToast from '@/Components/NotificationToast';
import { NotificationRecord } from '@/types';

interface AuthenticatedPageProps extends PageProps {
  unreadNotifications: NotificationRecord[]
}

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const { auth: { user }, unreadNotifications: initialUnreadNotifications } = usePage<AuthenticatedPageProps>().props;
  const [unreadNotifications, setUnreadNotifications] = useState<NotificationRecord[]>(initialUnreadNotifications || []);
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  const handleNotificationDismiss = (notificationId: number) => {
    router.post(`/notifications/${notificationId}/read`, {}, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page) => {
        const updatedUnreadNotifications = page.props.unreadNotifications || [];
        setUnreadNotifications(updatedUnreadNotifications);
      }
    });
  };

  useEffect(() => {
    setUnreadNotifications(initialUnreadNotifications)
  }, [initialUnreadNotifications]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
              </div>

              <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <NavLink
                  href={route('notifications.index')}
                  active={route().current('notifications.index')}
                >
                  Уведомления
                </NavLink>
                <NavLink
                  href={route('notification-categories.index')}
                  active={route().current('notification-categories.index')}
                >
                  Категории уведомлений
                </NavLink>
              </div>
            </div>

            <div className="hidden sm:ms-6 sm:flex sm:items-center">
              <div className="relative ms-3">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        {user.name}

                        <svg
                          className="-me-0.5 ms-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link
                      href={route('profile.edit')}
                    >
                      Профиль
                    </Dropdown.Link>
                    <Dropdown.Link
                      href={route('logout')}
                      method="post"
                      as="button"
                    >
                      Выйти
                    </Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>

            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() =>
                  setShowingNavigationDropdown(
                    (previousState) => !previousState,
                  )
                }
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={
                      !showingNavigationDropdown
                        ? 'inline-flex'
                        : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={
                      showingNavigationDropdown
                        ? 'inline-flex'
                        : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          className={
            (showingNavigationDropdown ? 'block' : 'hidden') +
            ' sm:hidden'
          }
        >

          <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
            <div className="px-4">
              <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                {user.name}
              </div>
              <div className="text-sm font-medium text-gray-500">
                {user.email}
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink href={route('profile.edit')}>
                Профиль
              </ResponsiveNavLink>
              <ResponsiveNavLink
                method="post"
                href={route('logout')}
                as="button"
              >
                Выйти
              </ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>

      {header && (
        <header className="bg-white shadow dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      {unreadNotifications.length > 0 && (
        <NotificationToast
          notification={unreadNotifications[0]}
          onDismiss={handleNotificationDismiss}
          color={unreadNotifications[0].category.color}
        />
      )}
      <main>{children}</main>
    </div>
  );
}
