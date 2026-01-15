# NBT Nazorat Bot - Production Deployment Guide

Ushbu qo'llanma NBT Nazorat botini production serverga (VPS/Ubuntu) to'liq joylashtirish bo'yicha batafsil ko'rsatmalarni o'z ichiga oladi.

---

## � Talablar

- **Node.js**: v18 yoki yuqori
- **NPM**: v9 yoki yuqori  
- **Database**: PostgreSQL (production uchun tavsiya etiladi)
- **Process Manager**: PM2 (serverda uzluksiz ishlashi uchun)
- **OS**: Ubuntu 20.04+ (tavsiya etiladi)

---

## 🚀 Production Serverga O'rnatish (Ubuntu VPS)

### 1️⃣ Serverni tayyorlash

```bash
# Sistemani yangilash
sudo apt update && sudo apt upgrade -y

# Node.js va NPM o'rnatish (NodeSource orqali)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Git o'rnatish (agar yo'q bo'lsa)
sudo apt install -y git

# PostgreSQL o'rnatish
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL ni ishga tushirish
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2️⃣ PostgreSQL bazasini sozlash

```bash
# PostgreSQL ga kirish
sudo -u postgres psql

# Bazani yaratish (psql ichida)
CREATE DATABASE nbt_aloqa;
CREATE USER nbt_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE nbt_aloqa TO nbt_user;
\q
```

### 3️⃣ Loyihani serverga yuklab olish

```bash
# Uy papkasiga o'tish
cd ~

# Loyihani klonlash
git clone <repository-url> NBt_nazorat
cd NBt_nazorat

# Yoki fayllarni SCP/SFTP orqali yuklang
```

### 4️⃣ Environment o'zgaruvchilarini sozlash

```bash
# .env faylini yaratish
cp .env.example .env
nano .env
```

**.env faylini to'ldiring:**

```bash
PORT=3000
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz  # BotFather dan olingan token
DB_TYPE=postgres
DB_USER=nbt_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432
DB_BAZE=nbt_aloqa
ADMIN_ID=  # Ixtiyoriy: Admin Telegram ID
```

> **⚠️ Muhim:** `.env` faylini hech qachon Git ga commit qilmang!

### 5️⃣ Kutubxonalarni o'rnatish

```bash
npm install
```

### 6️⃣ Loyihani build qilish

```bash
npm run build
```

Build natijasi `dist/` papkasida saqlanadi.

### 7️⃣ Ma'lumotlar bazasini to'ldirish

```bash
# Bo'limlarni yaratish (Departments seed)
node dist/src/seed.js

# Adminlarni yaratish/yangilash
node dist/src/create-admin.js
```

> **Eslatma:** Bu buyruqlar har safar yangi serverga o'tganda yoki baza qayta yaratilganda ishlatiladi.

### 8️⃣ PM2 ni o'rnatish va sozlash

```bash
# PM2 ni global o'rnatish
sudo npm install -g pm2

# Botni PM2 ecosystem config bilan ishga tushirish
pm2 start ecosystem.config.js

# PM2 statusini tekshirish
pm2 status

# Loglarni ko'rish
pm2 logs nbt-bot --lines 50

# Server restart bo'lganda avtomatik ishga tushishi uchun
pm2 startup
# Yuqoridagi buyruq sizga sudo buyruq beradi, uni bajaring
pm2 save
```

**PM2 Ecosystem Config (`ecosystem.config.js`)** loyihada mavjud va quyidagi sozlamalarni o'z ichiga oladi:
- Avtomatik restart
- Log fayllar (`logs/pm2-error.log`, `logs/pm2-out.log`)
- Memory limit (500MB)
- Restart delay va max restarts

---

## 🔄 Loyihani yangilash (Update)

Kod o'zgarganda quyidagi buyruqlarni bajaring:

```bash
cd ~/NBt_nazorat

# Yangi kodni olish
git pull origin main

# Kutubxonalarni yangilash
npm install

# Qayta build qilish
npm run build

# PM2 ni restart qilish
pm2 restart nbt-bot

# Loglarni tekshirish
pm2 logs nbt-bot --lines 30
```

---

## ☁️ Bulutli Platformalar (Render / Railway / Heroku)

Loyiha `Procfile` va to'g'ri `package.json` scripts ga ega.

### Render.com uchun:

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm run start:prod`
3. **Environment Variables**: `.env` dagi barcha o'zgaruvchilarni kiriting

### Railway.app uchun:

1. GitHub repository ni ulang
2. Environment variables ni sozlang
3. Deploy avtomatik boshlanadi

---

## 🛠 Troubleshooting (Muammolarni hal qilish)

### ❌ Port 3000 band (EADDRINUSE)

**Muammo:** `Error: listen EADDRINUSE: address already in use :::3000`

**Yechim:**
```bash
# Port 3000 da ishlab turgan jarayonni topish
sudo lsof -i :3000

# Yoki PM2 ni to'xtatish
pm2 stop nbt-bot

# Keyin qayta ishga tushirish
pm2 restart nbt-bot
```

### ❌ Bot ishga tushmayapti (MODULE_NOT_FOUND)

**Muammo:** `Error: Cannot find module '/path/to/dist/main'`

**Yechim:**
```bash
# package.json da start:prod to'g'riligini tekshiring
# "start:prod": "node dist/src/main" bo'lishi kerak

# Qayta build qiling
npm run build

# PM2 ni restart qiling
pm2 restart nbt-bot
```

### ❌ Database ulanish xatosi

**Muammo:** `Connection refused` yoki `Authentication failed`

**Yechim:**
```bash
# PostgreSQL ishlab turganini tekshiring
sudo systemctl status postgresql

# .env faylini tekshiring (DB_HOST, DB_USER, DB_PASSWORD)
cat .env

# PostgreSQL user va baza mavjudligini tekshiring
sudo -u postgres psql -c "\l"  # Bazalar ro'yxati
sudo -u postgres psql -c "\du" # Userlar ro'yxati
```

### ❌ PM2 loglarida xatolar

```bash
# Xato loglarini ko'rish
pm2 logs nbt-bot --err --lines 100

# Barcha loglarni tozalash
pm2 flush

# PM2 ni to'liq restart qilish
pm2 delete nbt-bot
pm2 start ecosystem.config.js
```

---

## 📊 PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Status ko'rish
pm2 status

# Loglarni kuzatish
pm2 logs nbt-bot

# Restart statistikasi
pm2 info nbt-bot
```

---

## 🔒 Xavfsizlik Tavsiyalari

1. ✅ `.env` faylini hech qachon Git ga commit qilmang
2. ✅ PostgreSQL parolini kuchli qiling
3. ✅ Firewall sozlang (faqat kerakli portlar ochiq bo'lsin)
4. ✅ SSL sertifikat ishlating (agar webhook ishlatilsa)
5. ✅ `synchronize: false` qiling production da (TypeORM)
6. ✅ Log fayllarini muntazam tozalang

---

## ✅ Deployment Checklist

- [ ] Node.js va NPM o'rnatilgan
- [ ] PostgreSQL o'rnatilgan va sozlangan
- [ ] `.env` fayli to'ldirilgan va to'g'ri
- [ ] `npm install` bajarilgan
- [ ] `npm run build` muvaffaqiyatli
- [ ] `node dist/src/seed.js` bajarilgan
- [ ] `node dist/src/create-admin.js` bajarilgan
- [ ] PM2 o'rnatilgan
- [ ] `pm2 start ecosystem.config.js` ishga tushgan
- [ ] `pm2 save` va `pm2 startup` bajarilgan
- [ ] Bot Telegram da javob berayapti
- [ ] Loglar xatosiz

---

## 📞 Qo'shimcha Yordam

Muammolar yuzaga kelsa:
1. `pm2 logs nbt-bot` ni tekshiring
2. `.env` faylini qayta ko'rib chiqing
3. PostgreSQL ulanishini test qiling
4. `npm run build` qayta bajaring

**Bot muvaffaqiyatli ishga tushganda quyidagi xabar ko'rinadi:**
```
✅ BOT ULANDI: @nbt_nazoratchi_bot (ID: 8442771458)
```
