// App.jsx — root component, manages routing state
import React, { useState } from 'react';
import './styles.css';

import LoginPage from './LoginPage.jsx';
import HomePage from './HomePage.jsx';
import EventsPage from './EventsPage.jsx';
import EventDetailPage from './EventDetailPage.jsx';
import GroupsPage from './GroupsPage.jsx';
import UserProfilePage from './UserProfilePage.jsx';
import ProfilePage from './ProfilePage.jsx';
import CreateGroupModal from './CreateGroupModal.jsx';

export default function App() {
  const [page, setPage] = useState('login');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const goTo = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const handleSelectEvent = (ev) => {
    setSelectedEvent(ev);
    goTo('event-detail');
  };

  const handleCreateGroupConfirm = () => {
    setModalOpen(false);
    goTo('groups');
  };

  return (
    <>
      {page === 'login' && <LoginPage goTo={goTo} />}
      {page === 'home' && <HomePage goTo={goTo} />}
      {page === 'events' && <EventsPage goTo={goTo} onSelectEvent={handleSelectEvent} />}
      {page === 'event-detail' && (
        <EventDetailPage
          goTo={goTo}
          event={selectedEvent}
          onOpenCreateGroup={() => setModalOpen(true)}
        />
      )}
      {page === 'groups' && (
        <GroupsPage goTo={goTo} onOpenCreateGroup={() => setModalOpen(true)} />
      )}
      {page === 'user-profile' && <UserProfilePage goTo={goTo} />}
      {page === 'profile' && <ProfilePage goTo={goTo} />}

      <CreateGroupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCreateGroupConfirm}
      />
    </>
  );
}