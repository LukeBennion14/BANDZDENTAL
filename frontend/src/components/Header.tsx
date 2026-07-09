import { useState } from 'react';
import { Bell, MessageSquare, AlertTriangle, CheckCircle, Info, X, Search } from 'lucide-react';
import { mockNotifications } from '../data/mockData';

interface HeaderProps {
  title: string;
}

const HEADER_ICON_BTN: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(245,245,247,0.72)',
  cursor: 'pointer',
  transition: 'background-color 120ms ease, color 120ms ease',
  padding: 0,
};

export default function Header({ title }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotifIcon = ({ type }: { type: string }) => {
    if (type === 'warning') return <AlertTriangle size={14} style={{ color: '#facc15' }} />;
    if (type === 'success') return <CheckCircle size={14} style={{ color: '#4ade80' }} />;
    return <Info size={14} style={{ color: '#60a5fa' }} />;
  };

  return (
    <header
      style={{
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontFamily: 'inherit',
          fontSize: '24px',
          fontWeight: 600,
          letterSpacing: '-0.005em',
          color: '#f5f5f7',
          margin: 0,
        }}
      >
        {title}
      </h1>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 14px',
            width: '220px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Search size={15} style={{ color: 'rgba(245,245,247,0.5)' }} />
          <input
            type="text"
            placeholder="Search"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f5f5f7',
              fontSize: '14px',
              width: '100%',
              fontFamily: 'inherit',
              letterSpacing: '-0.012em',
            }}
          />
        </div>

        {/* Messages */}
        <button
          style={HEADER_ICON_BTN}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.color = '#f5f5f7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.color = 'rgba(245,245,247,0.72)';
          }}
        >
          <MessageSquare size={17} />
        </button>

        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(v => !v)}
            style={HEADER_ICON_BTN}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#f5f5f7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = 'rgba(245,245,247,0.72)';
            }}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '18px',
                  height: '18px',
                  background: '#4ade80',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#000000',
                  padding: '0 5px',
                  border: '2px solid #000000',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                onClick={() => setShowNotifications(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  zIndex: 50,
                  width: '360px',
                  background: '#0b0b0d',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
                }}
              >
                {/* Panel header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f5f5f7', margin: 0, letterSpacing: '-0.005em' }}>
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span
                        style={{
                          background: '#4ade80',
                          color: '#000000',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        fontSize: '12px',
                        color: '#4ade80',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: 'inherit',
                        fontWeight: 500,
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications list */}
                <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', color: 'rgba(245,245,247,0.5)' }}>
                      <Bell size={28} style={{ marginBottom: '12px', opacity: 0.4 }} />
                      <p style={{ fontSize: '14px', margin: 0 }}>No notifications</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '16px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                          background: !n.read ? 'rgba(255,255,255,0.02)' : 'transparent',
                        }}
                      >
                        <div style={{ marginTop: '2px', flexShrink: 0 }}>
                          <NotifIcon type={n.type} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: '13px',
                              lineHeight: 1.45,
                              color: n.read ? 'rgba(245,245,247,0.72)' : '#f5f5f7',
                              fontWeight: n.read ? 400 : 500,
                              margin: 0,
                            }}
                          >
                            {n.message}
                          </p>
                          <p style={{ fontSize: '11px', color: 'rgba(245,245,247,0.5)', marginTop: '4px' }}>{n.time}</p>
                        </div>
                        {!n.read && (
                          <div style={{ width: '6px', height: '6px', borderRadius: '999px', background: '#4ade80', marginTop: '6px', flexShrink: 0 }} />
                        )}
                        <button
                          onClick={() => dismiss(n.id)}
                          style={{
                            color: 'rgba(245,245,247,0.5)',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            marginTop: '2px',
                            flexShrink: 0,
                          }}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            marginLeft: '4px',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
            alt="Dr. Edwin Bennion"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </header>
  );
}
