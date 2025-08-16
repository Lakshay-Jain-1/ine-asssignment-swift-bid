# Stage 1: Build frontend
FROM node:20 AS frontend-build

# These lines accept the variables from Render's build environment
ARG VITE_SUPABASEURL
ARG VITE_SUPABASE_PASSWORD
ARG VITE_BACKEND_URL
ENV VITE_SUPABASEURL=$VITE_SUPABASEURL
ENV VITE_SUPABASE_PASSWORD=$VITE_SUPABASE_PASSWORD
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Setup backend and serve frontend
FROM node:20

WORKDIR /app

# install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# copy backend code
COPY backend/ ./

# copy frontend build output into backend/public (served by Express)
COPY --from=frontend-build /app/frontend/dist ./public

# expose the backend port
EXPOSE 3000

# start backend server
CMD ["node", "index.js"]