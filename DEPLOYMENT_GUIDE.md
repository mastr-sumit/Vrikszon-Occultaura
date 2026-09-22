# Deployment Guide — Vrikszon Occultaura

This guide explains how to deploy the **Vrikszon Occultaura** Next.js application on any Linux VPS, Cloud Server (Ubuntu/Debian/CentOS), Docker, or cPanel Node.js Selector.

---

## 1. Prerequisites

- **Node.js**: v18.18+ or v20.x (Recommended: Node 20 LTS)
- **npm**: v9+ or v10+
- **Database**: PostgreSQL 14+ (e.g., Supabase, Neon, AWS RDS, or local PostgreSQL instance)

---

## 2. Extraction

Extract the archive into your target directory:

```bash
# For .tar.gz:
tar -xzf vrikszon-occultaura-deploy.tar.gz -C /path/to/destination

# For .zip:
unzip vrikszon-occultaura-deploy.zip -d /path/to/destination

cd /path/to/destination
```

---

## 3. Environment Configuration

1. Copy the sample environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual production credentials:
   ```bash
   nano .env
   ```

### Key Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection URL | `postgresql://user:password@host:5432/dbname?sslmode=require` |
| `AUTH_SECRET` | 32-char random secret for NextAuth | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Fallback auth secret | Same as `AUTH_SECRET` |
| `NEXTAUTH_URL` | Canonical website URL | `https://yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | Public frontend URL | `https://yourdomain.com` |
| `AUTH_TRUST_HOST` | Trust proxy host headers | `"true"` |
| `SEED_ADMIN_EMAIL` | Admin login email | `admin@yourdomain.com` |
| `SEED_ADMIN_PASSWORD` | Admin initial password | `YourSecurePassword123!` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_live_...` or `rzp_test_...` |
| `RAZORPAY_KEY_SECRET`| Razorpay Key Secret | Secret from Razorpay Dashboard |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public Razorpay key | Same as `RAZORPAY_KEY_ID` |
| `RESEND_API_KEY` | Resend email API key | `re_...` |
| `ADMIN_NOTIFICATION_EMAIL` | Receives booking/contact emails | `contact@yourdomain.com` |
| `EMAIL_FROM` | Verified sender email | `no-reply@yourdomain.com` |

---

## 4. Installation & Database Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Deploy database migrations to PostgreSQL**:
   ```bash
   npx prisma migrate deploy
   ```
   *(Or run `npx prisma db push` if initializing without migration tracking)*

4. **Seed initial admin account and services catalogue**:
   ```bash
   npm run seed:admin
   npm run seed:catalogue
   ```

---

## 5. Build for Production

Run the Next.js production build:
```bash
npm run build
```

This compiles TypeScript, optimizes routes, and generates production assets.

---

## 6. Starting the Server

### Option A: Using PM2 (Recommended for VPS / Cloud Servers)

1. Install PM2 globally if not installed:
   ```bash
   npm install -g pm2
   ```

2. Start the application using `app.js`:
   ```bash
   pm2 start app.js --name "vrikszon" --node-args="--max-old-space-size=2048"
   ```

3. Save PM2 state to automatically restart on reboot:
   ```bash
   pm2 save
   pm2 startup
   ```

### Option B: Using cPanel / Plesk Node.js Selector

1. In cPanel, go to **Setup Node.js App**.
2. Select **Node.js version 20.x**.
3. **Application root**: directory where you uploaded the files (e.g. `public_html` or `app`).
4. **Application startup file**: `app.js`
5. Click **Create** / **Run NPM Install**.
6. Set the Environment Variables in the cPanel interface or upload your `.env` file.
7. Run `npm run build` in the cPanel terminal or SSH.
8. Click **Restart** in the Node.js selector.

### Option C: Using npm start

```bash
PORT=3000 npm start
```

---

## 7. Reverse Proxy Configuration (Nginx)

If hosting on a Linux VPS behind Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 365d;
        proxy_buffering off;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

---

## 8. File Uploads Directory Permissions

If using local file uploads (via the admin dashboard for courses, services, and products), make sure `public/images/` is writable:

```bash
chmod -R 755 public/images
```

---

## 9. Verification & Health Check

After launching, verify:
1. Public website: `https://yourdomain.com`
2. Admin login: `https://yourdomain.com/admin/login` (login with your configured `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`)
3. Diagnostic check (development/staging): `https://yourdomain.com/api/admin-check`
