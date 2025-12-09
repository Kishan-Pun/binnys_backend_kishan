# Binnys Movies – MERN Stack Movie App (RBAC + Queue + Redis)

A full-stack MERN movie application inspired by IMDb’s Top 250, with:

- JWT authentication
- Role-based access control (RBAC)
- Admin & Superadmin dashboards
- BullMQ + Redis for lazy movie insertion
- Fully responsive UI built with Material UI

---

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Zod for request validation
- JWT for auth
- BullMQ + Redis for async movie processing

cd movie-backend
npm install

# Make sure MongoDB Atlas URI & Redis URL are set in .env

npm run dev
# Also run worker in another terminal if using BullMQ
npm run worker


**Infrastructure**
- MongoDB Atlas
- Redis (Docker)
- Deployed Backend: _[e.g. Render / Railway / Heroku]_  
- Deployed Frontend: _[e.g. Vercel / Netlify]_

**For Docker**
docker run --name movie-redis -p 6379:6379 -d redis
