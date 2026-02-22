# GoConcert

The GoConcert website is designed for concert enthusiasts who want to meet other fans to go to the same event. 

## Feature/Function
- Login is required to acess the website and will first pop up. 
- Home page is to get started with the website. 
- Home page will direct users to the event search page. 
- Events page will make the API call, which pull data using Ticket Master API and save it into MongoDB Atlas cluster. 
- Search Bar in the Events page help users find specific event. 
- In each event, users can create a group or join a group. 
- Under each event, users can see any group that is already created and can click the join button to join the specific group. 
- Group Status will be updated below the event whether how many people in the group and if the group is full. 
- Under each event, users can choose to create a new group by specify the name, number of people, and optional discription. 
- Group will be created and public available to be seen by other users. 
- The Manage Group page collect and display all the group a user joined and/or created. 
- Users can view members in the group: emails of users will listed below events so users can contact each other for going to the event together. 
- Users can also manage the groups they create or joined in the Manage Group page. By clicking the "leave" button, user will be removed from the group list and contact information will no longer be public by other people. 
- The Profile page display the user login email and log out button. 

## Tech Stack
- React/Vite
- Docker 
- FastAPI
- Ticket Master Discovery API
- MongoDB Atlas


## Demo
<img width="947" height="473" alt="thumbnail " src="https://github.com/user-attachments/assets/7a0578c9-b949-4fb2-9099-da8c780a0270" />
Home Page
<img width="947" height="475" alt="Screenshot 2026-02-22 104805" src="https://github.com/user-attachments/assets/ed1b3d44-b6fd-4be5-846c-bc16e2f07f81" />
Event Page

## How to Run Locally?
- Clone the repository locally.
- Open Docker Desktop
- Command ```docker compose up --build``` to build the docker for the first time
- Command ```docker compose up --build -d``` to rebuild the docker for refresh
- Command ```docker ps``` to check which container is running, look for goconcert-frontend and goconcert-backedn in the ports list
- Command ```cd frontend```
- Command ```npm install``` for dowloading the dependencies fro the first time
- Command ```npm run dev``` for running the frontend
