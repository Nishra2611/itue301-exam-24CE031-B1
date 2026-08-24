# FitZone Gym & Class Booking System

ITUE301 Open-Book Practical Examination, Set B, 24/08/2026.

## Structure
- `frontend/` React + Vite application
- `backend/` Express + Mongoose REST API
- `report/` submission report

## Requirements
- Node.js 18+
- MongoDB

## Backend setup
```bash
cd backend
copy .env.example .env
npm install
node seed.js
npm run dev
```

On macOS/Linux use `cp .env.example .env` instead of `copy`.

## Frontend setup
```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## Demo login
- Email: `member@fitzone.com`

The seed script creates the demo member and trainers. Login intentionally uses the registered member email because the exam entity specification does not include a password field.

## API protection
`POST /api/v1/auth/login` and `GET /api/v1/trainers` are public. Booking endpoints use the custom `authGuard` middleware. `requestLogger` is global and logs the final response status with `res.on('finish')`.

## Validation
Mongoose validation errors are mapped into a clean JSON array by the global error handler. A duplicate trainer/date/time slot is also rejected with HTTP 400.

## Roll-number submission naming
Rename the repository to `itue301-exam-[roll-number]-[batch]` before publishing the public GitHub repository.

The report filename should be `[RollNo]_SetB_Report.pdf`.
