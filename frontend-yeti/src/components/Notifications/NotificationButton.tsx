import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNotificationSystem } from '../../hooks/useNotifications';
import FilterButton from '../Buttons/FilterButton';

const NotificationButton: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  } = useNotificationSystem();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'atraso': return '⚠️';
      case 'vencimento': return '⏰';
      case 'novo_livro': return '📖';
      case 'sistema': return '🔧';
      default: return '📢';
    }
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <StyledWrapper ref={dropdownRef}>
      <button
        className="inbox-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg viewBox="0 0 512 512" height={16} xmlns="http://www.w3.org/2000/svg">
          <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
        </svg>
        {unreadCount > 0 && (
          <span className="msg-count">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="dropdown-header bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-gray-900 dark:text-gray-100">Notificações</h3>
            {unreadCount > 0 && (
              <FilterButton
                variant="primary"
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </FilterButton>
            )}
          </div>

          <div className="notifications-list">
            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">⏳</div>
                <p>Carregando notificações...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''} border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-content">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-text">
                      <h4 className="text-gray-900 dark:text-gray-100">{notification.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{notification.message}</p>
                      <span className="notification-time text-gray-500 dark:text-gray-400">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="dropdown-footer bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-center p-6">
              <FilterButton
                variant="primary"
                onClick={() => setIsOpen(false)}
              >
                Fechar
              </FilterButton>
            </div>
          )}
        </div>
      )}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  display: inline-block;

  .inbox-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.082);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: #3b82f6; /* Azul padrão */
    cursor: pointer;
    transition: all 0.3s;
  }

  .inbox-btn svg path {
    fill: white;
  }

  .inbox-btn svg {
    height: 17px;
    transition: all 0.3s;
  }

  .msg-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ef4444;
    border-radius: 50%;
    font-size: 0.7em;
    color: white;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border: 2px solid white;
  }

  .inbox-btn:hover {
    transform: scale(1.1);
    background-color: #2563eb; /* Azul mais escuro no hover */
  }

  .notification-dropdown {
    position: absolute;
    top: 60px;
    right: 0;
    width: 360px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    z-index: 1000;
    max-height: 450px;
    overflow: hidden;
  }

  /* Dark mode support */
  .dark .notification-dropdown {
    background: #111827 !important;
    border-color: #374151 !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }

  .dropdown-header {
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
  }

  /* Dark mode support */
  .dark .dropdown-header {
    background: #0b1220 !important;
    border-bottom-color: #374151 !important;
  }

  .dropdown-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
  }

  /* Dark mode support */
  .dark .dropdown-header h3 {
    color: #e5e7eb !important;
  }

  .mark-all-read {
    background: none;
    border: none;
    color: #3b82f6;
    font-size: 12px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .mark-all-read:hover {
    background-color: #eff6ff;
  }

  /* Dark mode support */
  .dark .mark-all-read {
    color: #cbd5e1 !important;
  }

  .dark .mark-all-read:hover {
    background-color: #374151 !important;
  }

  .notifications-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .notification-item {
    padding: 16px 20px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s;
  }

  /* Dark mode support */
  .dark .notification-item {
    border-bottom-color: #374151 !important;
  }

  .notification-item.unread {
    background-color:#3b82f6;
    border-left: 3px solid rgb(6, 0, 29);
  }

  /* Dark mode support */
  .dark .notification-item.unread {
    background-color: #451a03 !important;
    border-left-color: #f59e0b !important;
  }

  .notification-item:last-child {
    border-bottom: none;
  }

  /* Hover styles movidos para classes Tailwind no JSX */

  .notification-content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .notification-icon {
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .notification-text {
    flex: 1;
    min-width: 0;
  }

  .notification-text h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
  }

  .notification-text p {
    margin: 0 0 8px 0;
    font-size: 13px;
    font-weight: 500;

    color:rgb(18, 18, 19);
    line-height: 1.4;
  }

  .notification-time {
    font-size: 11px;
    color: #111827;
  }

  /* Dark mode support */
  .dark .notification-text h4 {
    color: #e5e7eb !important;
  }

  .dark .notification-text p {
    color: #cbd5e1 !important;
  }

  .dark .notification-time {
    color: #e5e7eb !important;
  }

  .unread-dot {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 8px;
    height: 8px;
    background-color: #3b82f6;
    border-radius: 50%;
  }

  .empty-state {
    padding: 40px 20px;
    text-align: center;
    color: #6b7280;
  }

  /* Dark mode support */
  .dark .empty-state {
    color: #e5e7eb !important;
  }

  .empty-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .dropdown-footer {
    /* Estilos movidos para classes Tailwind no JSX */
  }

  .view-all {
    width: 100%;
    background: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  /* Scrollbar personalizada */
  .notifications-list::-webkit-scrollbar {
    width: 4px;
  }

  .notifications-list::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  .notifications-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }

  .notifications-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  .dark .notifications-list::-webkit-scrollbar-track {
    background: #374151;
  }

  .dark .notifications-list::-webkit-scrollbar-thumb {
    background: #6b7280;
  }

  .dark .notifications-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

export default NotificationButton;