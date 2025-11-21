# aistudio1 Backend

This repository contains a Node.js + Express backend for the admin panel. It provides admin authentication (JWT), user management, admin profile, and a shared business gallery.

Quick start

1. Copy `.env.example` to `.env` and update `MONGODB_URI` and `JWT_SECRET`.

2. Install dependencies:

```bash
npm install
```

3. Seed admin users (creates 10 admins `admin1@example.com`..`admin10@example.com` with password `Admin@123`):

```bash
npm run seed
```

4. Start server:

```bash
npm run dev
```

APIs

- `POST /api/admin-auth` : body `{ email, password }` returns `{ token, admin, users }`.
- `GET /api/users` : fetch all users (requires `Authorization: Bearer <token>`).
- `POST /api/users` : create user.
- `PUT /api/users/:id` : update user.
- `DELETE /api/users/:id` : delete user.
- `GET /api/admin-profile` : get current admin profile.
- `PUT /api/admin-profile` : update admin profile (email uniqueness validated).
- `GET /api/business-gallery` : fetch gallery images.
- `POST /api/business-gallery` : upload image (multipart `image` field).
- `PUT /api/business-gallery/:id` : update image metadata.
- `DELETE /api/business-gallery/:id` : delete image.

Notes

- Passwords are stored hashed using `bcrypt`.
- JWT expires in 24 hours.
- Uploaded images stored in `uploads/gallery/` and served at `/uploads/gallery/...`.
# aistudio1