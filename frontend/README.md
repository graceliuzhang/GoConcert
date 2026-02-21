# React + Vite
# GoConcert – React App

## File Structure

```
goconcert/
├── main.jsx              # Entry point (React 18 / Vite)
├── App.jsx               # Root: manages page routing state & modal
├── styles.css            # All CSS (converted from inline <style>)
├── data.js               # Static mock data (events, groups)
│
├── Nav.jsx               # Shared sticky navigation bar
├── CreateGroupModal.jsx  # Shared modal for creating a group
│
├── LoginPage.jsx         # /login
├── HomePage.jsx          # /home – hero section
├── EventsPage.jsx        # /events – searchable event list
├── EventDetailPage.jsx   # /event-detail – groups at a show
├── GroupsPage.jsx        # /groups – sidebar + group detail panel
├── UserProfilePage.jsx   # /user-profile – member card view
└── ProfilePage.jsx       # /profile – account settings
```

## Getting Started (Vite)

```bash
npm create vite@latest goconcert -- --template react
cd goconcert
# Replace src/ contents with these files
npm install
npm run dev
```

## Notes

- Routing is handled via simple `useState` in `App.jsx` (no React Router dependency).
- `data.js` holds all mock data. Swap with real API calls as needed.
- CSS custom properties (design tokens) are defined at `:root` in `styles.css`.