# AI Assistant Requirements

## Tujuan

Tambahkan AI assistant berbasis Groq yang hanya menjawab hal seputar About Campus ID, terutama fitur website, layanan, alur order, dan navigasi halaman.

## Scope Jawaban

AI boleh menjawab:

- Informasi umum website About Campus ID
- Layanan aktif dan coming soon
- Perbedaan `FREE` dan `PAID` partnership
- Alur order, pembayaran, dan upload bukti
- Penjelasan halaman seperti `partnership`, `research`, `store`, `order`, dan `links`
- Navigasi cepat ke halaman tertentu
- Bantuan memakai menu command seperti `/menu` dan `/layanan`

AI tidak boleh menjawab di luar konteks website dan layanan, misalnya topik umum yang tidak terkait bisnis/halaman.

## Command Yang Didukung

Minimal command yang harus dikenali:

- `/menu`
- `/layanan`
- `/partnership`
- `/free`
- `/paid`
- `/research`
- `/store`
- `/kontak`

Command harus diproses secara deterministik sebelum fallback ke Groq.

## Penempatan UI

- Tombol WhatsApp di header diganti menjadi tombol AI assistant.
- Floating button kanan bawah dipakai untuk membuka chat assistant.
- Jika perlu, tombol WhatsApp manual tetap tersedia di footer atau area kontak.

## Alur Interaksi

1. User klik floating assistant.
2. Panel chat terbuka.
3. User kirim pertanyaan atau command.
4. Frontend mengirim request ke API route internal.
5. Server memproses command atau meneruskan ke Groq.
6. Assistant menampilkan jawaban singkat, ringkas, dan actionable.
7. Jika perlu, assistant memberi tombol/link cepat ke halaman terkait.

## Data Knowledge Dasar

Sumber pengetahuan assistant harus berasal dari data internal yang stabil, misalnya:

- Nama layanan
- Deskripsi layanan
- Alur order FREE/PAID
- Informasi kontak
- Halaman yang tersedia
- FAQ singkat website

Knowledge ini sebaiknya disimpan di file helper terpisah agar mudah diperbarui.

## API / Backend

Sediakan endpoint server-side, misalnya:

- `POST /api/assistant`

Endpoint ini bertugas:

- Menerima pesan user
- Mengecek command
- Menyusun prompt ke Groq
- Mengembalikan jawaban chat

Penting:

- API key Groq harus disimpan di server-side env
- Jangan expose API key ke client
- Sertakan validasi input

## Environment Variables

Tambahkan minimal:

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `NEXT_PUBLIC_SITE_URL`

## Style Jawaban

- Bahasa utama: Indonesia
- Nada: singkat, informatif, dan ramah
- Jawaban harus langsung ke inti
- Bila user minta menu, assistant harus menampilkan daftar opsi jelas
- Jika pertanyaan di luar scope, arahkan ke WhatsApp admin atau menu yang relevan

## Non-Goals

- Tidak perlu menggantikan seluruh flow WhatsApp manual
- Tidak perlu suara, upload file, atau login user
- Tidak perlu memory panjang percakapan di tahap awal
- Tidak perlu RAG kompleks sebelum kebutuhan dasar stabil

## Acceptance Criteria

Implementasi dianggap selesai jika:

- Assistant bisa dibuka dari floating button
- Header sudah memakai tombol AI assistant atau pengganti yang disepakati
- Command `/menu` dan `/layanan` menghasilkan jawaban menu yang konsisten
- Assistant hanya menjawab konteks About Campus ID
- Groq key aman di server-side
- UI tetap responsif di desktop dan mobile

## Catatan Implementasi Bertahap

Prioritas fase pertama:

1. UI chat widget
2. Command handler
3. API route Groq
4. Prompt sistem dan knowledge dasar
5. Penyesuaian header dan tombol WhatsApp manual
