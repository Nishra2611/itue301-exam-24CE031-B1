# FitZone Backend

## Run
1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. `npm install`
3. Optional demo data: `node seed.js`
4. `npm run dev`

## API
- `POST /api/v1/auth/login`
- `GET /api/v1/trainers`
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/my`
- `PATCH /api/v1/bookings/:id/status`

Use `Authorization: Bearer <token>` for protected booking endpoints.
