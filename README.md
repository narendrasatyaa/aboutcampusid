# About Campus ID (Next.js Migration)

Project ini sudah dimigrasikan dari static HTML/CSS/JS ke Next.js (App Router) dalam folder yang sama, dengan prioritas:

- Order masuk lewat web
- Notifikasi ke WhatsApp admin saat ada order baru
- Admin memproses order lewat dashboard web

## Stack

- Next.js 16
- React 19
- Prisma ORM
- PostgreSQL (disarankan: Vercel Postgres / Neon)
- Zod untuk validasi input

## Struktur Penting

- `app/page.js` landing + form order + floating WA button
- `app/admin/orders/page.js` dashboard admin order
- `app/api/orders/route.js` endpoint create order + trigger WA
- `app/api/admin/orders/route.js` endpoint list/update order
- `prisma/schema.prisma` skema database
- `.env.example` contoh environment variable
- `index.html`, `css/`, `js/` versi lama tetap disimpan sebagai backup migrasi

## Setup Lokal

1. Install dependency

```bash
npm install
```

2. Copy env

```bash
cp .env.example .env
```

3. Isi `.env` minimal:

- `DATABASE_URL`
- `ADMIN_DASHBOARD_KEY`
- `NEXT_PUBLIC_SITE_URL`

Untuk notif WhatsApp otomatis, isi juga:

- `WHATSAPP_API_URL`
- `WHATSAPP_API_TOKEN`
- `WHATSAPP_ADMIN_PHONE`

4. Jalankan migration database

```bash
npx prisma migrate dev --name init
```

5. Jalankan aplikasi

```bash
npm run dev
```

## Alur Fitur Order

1. User submit order di homepage
2. API `/api/orders` validasi data dan simpan ke tabel `Order`
3. API kirim notif WhatsApp ke admin
4. Admin buka `/admin/orders`
5. Admin update status: `NEW`, `PROCESSING`, `DONE`, `CANCELED`

## Catatan Integrasi WhatsApp

Link `wa.me` hanya membuka chat manual. Untuk notif otomatis dari server ke admin, pakai provider WhatsApp API.

Contoh payload yang dipakai project ini (POST JSON):

```json
{
	"target": "62852xxxx",
	"message": "Order baru masuk ..."
}
```

Header auth:

```http
Authorization: Bearer <WHATSAPP_API_TOKEN>
Content-Type: application/json
```

Jika format provider kamu berbeda, cukup sesuaikan di `lib/whatsapp.js`.

## Deploy Vercel + Domain IDWebhost

1. Push repo ke GitHub
2. Import project ke Vercel
3. Tambahkan environment variable di Vercel (sama seperti `.env`)
4. Buat database Vercel Postgres, update `DATABASE_URL`
5. Redeploy
6. Tambahkan domain di Vercel
7. Di DNS IDWebhost, arahkan record sesuai instruksi Vercel
8. SSL otomatis dari Vercel (tidak perlu beli SSL terpisah di registrar)

## Script

```bash
npm run dev
npm run build
npm run start
```
