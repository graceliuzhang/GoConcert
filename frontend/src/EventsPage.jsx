// EventsPage.jsx
import React, { useEffect, useState } from 'react';
import Nav from './Nav.jsx';


export default function EventsPage({ goTo, onSelectEvent }) {
 const [search, setSearch] = useState('');
 const [events, setEvents] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [distance, setDistance] = useState('any');
 const [userLocation, setUserLocation] = useState(null);


 useEffect(() => {
   const fetchEvents = async () => {
     setLoading(true);
     setError('');


     try {
       const response = await fetch('/api/events?city=Raleigh&size=20');
       if (!response.ok) {
         throw new Error('Could not fetch events');
       }


       const payload = await response.json();
       // debug: log returned events so we can see lat/lng fields
       console.debug('fetched events payload', payload);
       setEvents(payload.events || []);
     } catch {
       setError('Unable to load events right now. Please try again.');
     } finally {
       setLoading(false);
     }
   };


   fetchEvents();
 }, []);


 // request browser geolocation once on mount
 useEffect(() => {
   if (!navigator.geolocation) return;
   navigator.geolocation.getCurrentPosition(
     (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
     (err) => {
       // user denied or unavailable — keep userLocation null
       console.warn('Geolocation unavailable:', err.message);
     },
     { enableHighAccuracy: false, timeout: 10000 }
   );
 }, []);


 const getEventDistance = (e) => {
   // prefer already-computed numeric distance; otherwise, compute from lat/lng when userLocation exists
   if (typeof e.distance === 'number') return e.distance;
   if ((e.distanceMiles ?? e.distance_miles) && !isNaN(Number(e.distanceMiles ?? e.distance_miles))) {
     return Number(e.distanceMiles ?? e.distance_miles);
   }
   if (userLocation && e.lat != null && e.lng != null) {
     const elat = Number(e.lat);
     const elng = Number(e.lng);
     if (!isFinite(elat) || !isFinite(elng)) return Infinity;
     const toRad = (v) => (v * Math.PI) / 180;
     const R = 3958.8; // miles
     const dLat = toRad(elat - userLocation.lat);
     const dLon = toRad(elng - userLocation.lng);
     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(elat)) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
     return R * c;
   }
   return Infinity;
 };


 const filtered = events.filter(e =>
   e.title.toLowerCase().includes(search.toLowerCase()) &&
   (distance === 'any' || getEventDistance(e) <= Number(distance))
 );


 return (
   <div className="page">
     <Nav currentPage="events" goTo={goTo} />
     <div className="container">
       <div className="section-title">Events</div>
       <div className="section-sub">Find concerts and connect with fans going to the same show</div>


       <div className="search-bar">
         <input
           type="text"
           placeholder="🔍  Search artist or tour name…"
           value={search}
           onChange={e => setSearch(e.target.value)}
         />
         <select value={distance} onChange={e => setDistance(e.target.value)}>
           <option value="25">Within 25 mi</option>
           <option value="50">Within 50 mi</option>
           <option value="100">Within 100 mi</option>
           <option value="any">Any distance</option>
         </select>
       </div>


       <div className="event-list-view">
         {loading && <div className="section-sub">Loading events…</div>}
         {error && <div className="section-sub">{error}</div>}
         {filtered.map((ev, i) => (
           <div
             key={ev.id || i}
             className="event-row"
             onClick={() => onSelectEvent(ev)}
           >
             <div className="event-row-emoji" style={ev.emojiStyle || {}}>
               {ev.emoji || '🎵'}
             </div>
             <div className="event-row-info">
               <div className="event-row-title">{ev.title}</div>
               <div className="event-row-meta">{ev.venue} · {ev.meta}</div>
             </div>
             <div className="event-row-right">
               <span className="pill" style={{ fontSize: '.75rem' }}>
                 {ev.groups ?? 0} groups
               </span>
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
 );
}
