# NBT Aloqa Bot - Vazifalar va Hisobotlar Tizimi

## Loyiha Maqsadi
Xodimlar va rahbar o'rtasida vertikal nazorat tizimini yaratish:
- ✅ Rahbar vazifalar beradi
- ✅ Xodimlar vazifalarni bajaradi va hisobotlar yuboradi
- ✅ Faqat hujjatlar bilan ishlash (yozishma yo'q)
- ✅ Haftalik/Oylik statistika
- ✅ Maosh hisobiga bog'lash imkoniyati

## 1. Ma'lumotlar Bazasi Tuzilmasi

### 1.1 Yangi Entity'lar

#### Task (Vazifa)
```typescript
- id: string (UUID)
- title: string (Vazifa nomi)
- description: string (Tavsif)
- assigned_by: string (Vazifa beruvchi telegram_id)
- assigned_to: string (Vazifa oluvchi telegram_id)
- department: string (Bo'lim)
- priority: enum (LOW, MEDIUM, HIGH, URGENT)
- status: enum (PENDING, IN_PROGRESS, COMPLETED, REJECTED)
- deadline: Date (Tugash muddati)
- created_at: Date
- updated_at: Date
- completed_at: Date (nullable)
- files: string[] (Vazifa fayllari)
```

#### Report (Hisobot)
```typescript
- id: string (UUID)
- task_id: string (Vazifa ID)
- submitted_by: string (Yuboruvchi telegram_id)
- report_text: string (Hisobot matni)
- files: string[] (Hujjatlar)
- status: enum (PENDING, APPROVED, REJECTED)
- submitted_at: Date
- reviewed_at: Date (nullable)
- reviewer_comment: string (nullable)
- completion_percentage: number (0-100)
```

#### Salary (Maosh)
```typescript
- id: string (UUID)
- user_id: string (telegram_id)
- month: string (YYYY-MM)
- base_salary: number (Asosiy maosh)
- bonus: number (Bonus)
- penalty: number (Jarima)
- total: number (Jami)
- tasks_completed: number (Bajarilgan vazifalar soni)
- tasks_total: number (Jami vazifalar soni)
- completion_rate: number (Bajarilish foizi)
- calculated_at: Date
```

#### Statistics (Statistika)
```typescript
- id: string (UUID)
- user_id: string (telegram_id)
- period_type: enum (DAILY, WEEKLY, MONTHLY)
- period_start: Date
- period_end: Date
- tasks_assigned: number
- tasks_completed: number
- tasks_pending: number
- tasks_rejected: number
- average_completion_time: number (soatlarda)
- performance_score: number (0-100)
```

## 2. Bot Funksiyalari

### 2.1 Rahbar (MANAGER) Funksiyalari

#### Vazifalar Boshqaruvi
- ✅ Yangi vazifa yaratish
  - Xodimni tanlash
  - Vazifa tavsifi
  - Fayllar yuklash
  - Muddat belgilash
  - Muhimlik darajasi
  
- ✅ Vazifalarni ko'rish
  - Barcha vazifalar
  - Bo'lim bo'yicha
  - Xodim bo'yicha
  - Status bo'yicha
  
- ✅ Vazifalarni tahrirlash
  - Muddatni uzaytirish
  - Tavsifni o'zgartirish
  - Xodimni almashtirish
  
- ✅ Vazifalarni o'chirish

#### Hisobotlarni Ko'rish va Baholash
- ✅ Kelgan hisobotlar
- ✅ Hisobotni tasdiqlash
- ✅ Hisobotni rad etish (izoh bilan)
- ✅ Qo'shimcha hujjat so'rash

#### Statistika va Hisobotlar
- ✅ Kunlik statistika
- ✅ Haftalik hisobot
- ✅ Oylik hisobot
- ✅ Xodimlar reytingi
- ✅ Bo'limlar bo'yicha tahlil

#### Maosh Boshqaruvi
- ✅ Oylik maosh hisoblash
- ✅ Bonus berish
- ✅ Jarima qo'yish
- ✅ Maosh tarixi

### 2.2 Xodim (MEMBER) Funksiyalari

#### Vazifalar
- ✅ Mening vazifalarim
  - Faol vazifalar
  - Tugallangan vazifalar
  - Muddati o'tgan vazifalar
  
- ✅ Vazifa tafsilotlari
  - Vazifa ma'lumotlari
  - Fayllarni ko'rish
  - Muddat

#### Hisobotlar Yuborish
- ✅ Vazifa bo'yicha hisobot
  - Hisobot matni
  - Hujjatlar yuklash
  - Bajarilish foizi
  
- ✅ Yuborilgan hisobotlar
- ✅ Hisobot holati

#### Shaxsiy Statistika
- ✅ Mening statistikam
  - Bajarilgan vazifalar
  - Kutilayotgan vazifalar
  - Bajarilish foizi
  - Oylik natijalar

#### Maosh Ma'lumotlari
- ✅ Joriy oy maoshi
- ✅ Maosh tarixi
- ✅ Bonus va jarimalar

## 3. Klaviatura Tuzilmasi

### 3.1 Rahbar Menyu
```
📋 Vazifalar
├── ➕ Yangi vazifa
├── 📊 Barcha vazifalar
├── 🔍 Vazifalarni qidirish
└── 📈 Vazifalar statistikasi

📝 Hisobotlar
├── 📥 Kelgan hisobotlar
├── ✅ Tasdiqlangan
├── ❌ Rad etilgan
└── ⏳ Kutilayotgan

📊 Statistika
├── 📅 Kunlik
├── 📆 Haftalik
├── 📈 Oylik
└── 🏆 Reytinglar

💰 Maosh
├── 💵 Maosh hisoblash
├── 🎁 Bonus berish
├── ⚠️ Jarima qo'yish
└── 📜 Maosh tarixi

👥 Xodimlar (mavjud)
📁 Bo'limlar (mavjud)
```

### 3.2 Xodim Menyu
```
📋 Mening vazifalarim
├── ⏳ Faol vazifalar
├── ✅ Tugallangan
└── ⚠️ Muddati o'tgan

📝 Hisobot yuborish
├── 📤 Yangi hisobot
└── 📊 Yuborilgan hisobotlar

📊 Mening statistikam
├── 📈 Oylik natijalar
├── 🎯 Bajarilish foizi
└── 🏆 Mening reytingim

💰 Maosh ma'lumotlari
├── 💵 Joriy oy
├── 📜 Maosh tarixi
└── 🎁 Bonus va jarimalar
```

## 4. Xususiyatlar

### 4.1 Bildirishnomalar
- ✅ Yangi vazifa tayinlanganda
- ✅ Muddat yaqinlashganda (1 kun oldin)
- ✅ Muddat o'tganda
- ✅ Hisobot tasdiqlanganida
- ✅ Hisobot rad etilganida
- ✅ Maosh hisoblanganida

### 4.2 Fayllar Bilan Ishlash
- ✅ Hujjatlar yuklash (PDF, DOCX, XLSX, JPG, PNG)
- ✅ Fayllarni saqlash
- ✅ Fayllarni yuklash
- ✅ Fayl hajmi cheklovi (20MB)

### 4.3 Maosh Hisoblash Formulasi
```
Asosiy maosh = Belgilangan maosh
Bonus = (Bajarilgan vazifalar / Jami vazifalar) * 100 * Bonus koeffitsienti
Jarima = Muddati o'tgan vazifalar soni * Jarima summasi
Jami = Asosiy maosh + Bonus - Jarima
```

### 4.4 Performance Score (Samaradorlik Balli)
```
Score = (
  Bajarilgan vazifalar * 40 +
  O'z vaqtida bajarilgan * 30 +
  Sifat (hisobot tasdiqlangan) * 20 +
  Tezlik (o'rtacha bajarilish vaqti) * 10
) / 100
```

## 5. Texnik Talablar

### 5.1 Yangi Paketlar
```json
{
  "node-cron": "^3.0.3",  // Avtomatik hisobotlar uchun
  "exceljs": "^4.4.0",     // Excel hisobotlar uchun
  "pdfkit": "^0.15.0",     // PDF hisobotlar uchun
  "moment": "^2.30.1"      // Sana bilan ishlash uchun
}
```

### 5.2 Fayl Saqlash
- Fayllar `uploads/` papkasida saqlanadi
- Struktura: `uploads/{year}/{month}/{telegram_id}/{filename}`
- Har bir fayl unique ID bilan saqlanadi

### 5.3 Cron Jobs
- Har kuni 09:00 - Bugungi vazifalar haqida eslatma
- Har kuni 18:00 - Muddati o'tayotgan vazifalar haqida ogohlantirish
- Har dushanba 09:00 - Haftalik hisobot
- Har oyning 1-kuni - Oylik maosh hisoblash

## 6. Xavfsizlik

### 6.1 Ruxsatlar
- Faqat MANAGER vazifa bera oladi
- Faqat vazifa egasi hisobot yubora oladi
- Faqat vazifa beruvchi hisobotni baholashi mumkin
- Faqat MANAGER maosh ma'lumotlarini ko'ra oladi

### 6.2 Validatsiya
- Barcha kiritilgan ma'lumotlar tekshiriladi
- Fayllar virusga tekshiriladi (opsional)
- Hajm cheklovi qo'llaniladi

## 7. Joriy Etish Ketma-ketligi

### Phase 1: Ma'lumotlar Bazasi (1-2 kun)
1. ✅ Yangi entity'lar yaratish
2. ✅ Migration'lar yozish
3. ✅ Repository'lar yaratish
4. ✅ Service'lar yaratish

### Phase 2: Vazifalar Tizimi (2-3 kun)
1. ✅ Vazifa yaratish funksiyasi
2. ✅ Vazifalarni ko'rish
3. ✅ Vazifalarni tahrirlash
4. ✅ Vazifalarni o'chirish

### Phase 3: Hisobotlar Tizimi (2-3 kun)
1. ✅ Hisobot yuborish
2. ✅ Hisobotlarni ko'rish
3. ✅ Hisobotlarni baholash
4. ✅ Fayllar bilan ishlash

### Phase 4: Statistika (1-2 kun)
1. ✅ Kunlik statistika
2. ✅ Haftalik hisobot
3. ✅ Oylik hisobot
4. ✅ Reytinglar

### Phase 5: Maosh Tizimi (1-2 kun)
1. ✅ Maosh hisoblash
2. ✅ Bonus va jarimalar
3. ✅ Maosh tarixi

### Phase 6: Bildirishnomalar va Cron (1 kun)
1. ✅ Bildirishnomalar tizimi
2. ✅ Cron jobs sozlash
3. ✅ Avtomatik hisobotlar

### Phase 7: Test va Deploy (1 kun)
1. ✅ Barcha funksiyalarni test qilish
2. ✅ Bug'larni tuzatish
3. ✅ Production'ga deploy

**Jami: 9-14 kun**

## 8. Qo'shimcha Imkoniyatlar (Kelajakda)

- 📊 Grafik va diagrammalar
- 📱 Web admin panel
- 🔔 Email bildirishnomalar
- 📸 Rasm tanib olish (OCR)
- 🤖 AI yordamchi (vazifalarni tahlil qilish)
- 📈 Prognoz va tahlil
- 🌐 Ko'p tilli interfeys
- 📱 Mobile app

## 9. Texnik Stack

- **Backend**: NestJS + TypeScript
- **Database**: SQLite (yoki PostgreSQL)
- **Bot Framework**: Telegraf
- **ORM**: TypeORM
- **Cron**: node-cron
- **File Storage**: Local filesystem
- **Reports**: ExcelJS, PDFKit

## 10. Foydalanish Ssenariysi

### Ssenariy 1: Vazifa Berish va Bajarish
1. Rahbar `/admin` → Vazifalar → Yangi vazifa
2. Xodimni tanlaydi
3. Vazifa tavsifini yozadi
4. Fayllarni yuklaydi
5. Muddatni belgilaydi
6. Xodimga bildirishnoma keladi
7. Xodim vazifani ko'radi
8. Vazifani bajaradi
9. Hisobot yuboradi (hujjatlar bilan)
10. Rahbar hisobotni ko'radi
11. Tasdiqlaydi yoki rad etadi
12. Xodimga natija haqida xabar keladi

### Ssenariy 2: Oylik Maosh Hisoblash
1. Har oyning 1-kuni avtomatik
2. Tizim har bir xodim uchun:
   - O'tgan oy vazifalarini sanaydi
   - Bajarilgan vazifalarni hisoblaydi
   - Bonus va jarimalarni qo'shadi
   - Jami maoshni hisoblaydi
3. Rahbar maosh hisobotini ko'radi
4. Tasdiqlaydi
5. Xodimlarga bildirishnoma yuboriladi

## 11. Xulosa

Bu tizim to'liq vertikal nazoratni ta'minlaydi:
- ✅ Rahbar nazorati
- ✅ Xodimlar javobgarligi
- ✅ Shaffoflik
- ✅ Avtomatlashtirish
- ✅ Samaradorlikni oshirish
- ✅ Maosh bilan bog'lash

Tizim ishga tushgandan keyin barcha jarayonlar avtomatlashtiriladi va rahbar real vaqtda xodimlar faoliyatini kuzatib borishi mumkin.
