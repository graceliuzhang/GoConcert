// App.jsx — root component, manages routing state
import React, { useEffect, useState } from 'react';
import './styles.css';

import LoginPage from './LoginPage.jsx';
import HomePage from './HomePage.jsx';
import EventsPage from './EventsPage.jsx';
import EventDetailPage from './EventDetailPage.jsx';
import GroupsPage from './GroupsPage.jsx';
import UserProfilePage from './UserProfilePage.jsx';
import ProfilePage from './ProfilePage.jsx';
import CreateGroupModal from './Creategroupmodal.jsx';
import { clearToken, getMe, getToken, setToken } from './api.js';

export default function App() {
  const [page, setPage] = useState('login');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = getToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const meResponse = await getMe();
        if (!meResponse.ok) {
          clearToken();
          setAuthLoading(false);
          return;
        }

        const me = await meResponse.json();
        setAuthToken(token);
        setCurrentUser(me);
        setPage('home');
      } catch {
        clearToken();
      } finally {
        setAuthLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const goTo = (p) => {
    if (!authToken && p !== 'login') {
      setPage('login');
      return;
    }

    setPage(p);
    window.scrollTo(0, 0);
  };

  const handleSelectEvent = (ev) => {
    setSelectedEvent(ev);
    setRefreshKey(prev => prev + 1); // Force refresh when navigating to event detail
    goTo('event-detail');
  };

  const handleCreateGroupConfirm = async () => {
    setModalOpen(false);
    // Increment refreshKey to trigger data refresh in EventDetailPage
    setRefreshKey(prev => prev + 1);
  };

  const handleAuthSuccess = (token, user) => {
    setToken(token);
    setAuthToken(token);
    setCurrentUser(user);
    setPage('home');
    window.scrollTo(0, 0);
  };

  const handleSignOut = () => {
    clearToken();
    setAuthToken('');
    setCurrentUser(null);
    setSelectedEvent(null);
    setModalOpen(false);
    setPage('login');
  };

  if (authLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className="section-sub">Checking session…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!authToken && <LoginPage onAuthSuccess={handleAuthSuccess} />}
      {authToken && page === 'home' && <HomePage goTo={goTo} />}
      {authToken && page === 'events' && <EventsPage goTo={goTo} onSelectEvent={handleSelectEvent} />}
      {authToken && page === 'event-detail' && (
        <EventDetailPage
          goTo={goTo}
          event={selectedEvent}
          authToken={authToken}
          refreshKey={refreshKey}
          onOpenCreateGroup={() => setModalOpen(true)}
        />
      )}
          
      {authToken && page === 'groups' && (
        <GroupsPage goTo={goTo} authToken={authToken} onOpenCreateGroup={() => setModalOpen(true)} />
      )}
      {authToken && page === 'user-profile' && <UserProfilePage goTo={goTo} />}
      {authToken && page === 'profile' && <ProfilePage goTo={goTo} currentUser={currentUser} onSignOut={handleSignOut} />}

      {authToken && (
        <CreateGroupModal
          isOpen={modalOpen}
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
          onConfirm={handleCreateGroupConfirm}
        />
      )}
    </>
  );
}