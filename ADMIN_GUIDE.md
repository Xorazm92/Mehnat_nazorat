# NBT Aloqa Bot - Admin Qo'llanma

## Admin Yaratish

### 1. O'zingizning Telegram ID ni Topish

Telegram ID ni topish uchun:
1. Telegram'da `@userinfobot` ga `/start` yuboring
2. Bot sizga ID ni yuboradi (masalan: `123456789`)

### 2. Admin Yaratish

`src/create-admin.ts` faylini oching va `TELEGRAM_ID_NI_KIRITING` o'rniga o'z ID ingizni yozing:

```typescript
telegram_id: '123456789', // O'z ID ingizni kiriting
```

Keyin terminalda:
```bash
npx ts-node -r tsconfig-paths/register src/create-admin.ts
```

## Admin Panelini Ishlatish

### Admin Paneliga Kirish

Botga `/admin` buyrug'ini yuboring. Sizga admin menyu ochiladi:

```
Kerakli bo'limni tanlang ☟

📋 Xodimlarni boshqarish
📁 Bo'limlarni boshqarish  
📨 Murojaatlarni boshqarish
```

## 1. Xodimlarni Boshqarish

### Ro'yxatdan O'tish So'rovlari
- **Tugma**: "Ro'yxatdan o'tish so'rovlari"
- **Vazifa**: Yangi xodimlarni tasdiqlash yoki rad etish
- **Qanday ishlaydi**:
  1. Ro'yxatdan o'tishni kutayotgan xodimlar ro'yxati ko'rsatiladi
  2. Xodimni tanlang
  3. Uning ma'lumotlarini ko'ring (ism, telefon, bo'lim)
  4. "Tasdiqlash" yoki "Bekor qilish" tugmasini bosing

### Barcha Xodimlarni Ko'rish
- **Tugma**: "Barcha xodimlar"
- **Vazifa**: Tizimda ro'yxatdan o'tgan xodimlarni ko'rish va boshqarish
- **Qanday ishlaydi**:
  1. Bo'limni tanlang (Mehnat muhofazasi / Sanoat xavfsizligi)
  2. Xodimlar ro'yxati ko'rsatiladi
  3. Xodimni tanlang
  4. Kerakli amallarni bajaring:
     - **O'chirish**: Xodimni tizimdan o'chirish
     - **Tahrirlash**: Ma'lumotlarni o'zgartirish
       - Telefon raqamini o'zgartirish
       - Bo'limni o'zgartirish
       - Lavozimni o'zgartirish (Bo'lim boshlig'i qilish)

## 2. Bo'limlarni Boshqarish

### Yangi Bo'lim Qo'shish
- **Tugma**: "Bo'lim qo'shish"
- **Vazifa**: Yangi bo'lim yaratish
- **Qanday ishlaydi**:
  1. Bo'lim nomini kiriting
  2. Tasdiqlang

### Ichki Bo'lim Qo'shish
- **Tugma**: "Ichki bo'lim qo'shish"
- **Vazifa**: Mavjud bo'limga ichki bo'lim qo'shish
- **Qanday ishlaydi**:
  1. Asosiy bo'limni tanlang
  2. Ichki bo'lim nomini kiriting
  3. Tasdiqlang

### Bo'limlarni Ko'rish
- **Tugma**: "Bo'limlarni ko'rish"
- **Vazifa**: Barcha bo'limlarni ko'rish va boshqarish

## 3. Murojaatlarni Boshqarish

### Murojaat Yuborish
- **Tugma**: "Murojaat yuborish"
- **Vazifa**: Xodimlarga murojaat yuborish
- **Qanday ishlaydi**:
  1. Murojaat turini tanlang:
     - Matn murojaat
     - Fayl bilan murojaat
  2. Murojaat matnini yozing
  3. Kimga yuborishni tanlang:
     - Bo'lim bo'yicha
     - Lavozim bo'yicha (Bo'lim boshliqlari / Oddiy xodimlar)
  4. Yuborish

### Murojaatlarni Ko'rish
- **Tugma**: "Murojaatlarni ko'rish"
- **Vazifa**: Kelgan murojaatlarni ko'rish
- **Qanday ishlaydi**:
  1. Murojaatlar ro'yxati ko'rsatildi
  2. Murojaatni tanlang
  3. O'qilgan deb belgilash

## Tez-tez So'raladigan Savollar

### Q: Admin qanday aniqlanadi?
**A**: Foydalanuvchining `role` maydoni `MANAGER` bo'lsa, u admin hisoblanadi.

### Q: Bir nechta admin bo'lishi mumkinmi?
**A**: Ha, istalgancha xodimni admin (bo'lim boshlig'i) qilish mumkin.

### Q: Admin oddiy xodimga aylanishi mumkinmi?
**A**: Ha, admin panelida xodimning lavozimini o'zgartirish mumkin.

### Q: Admin o'zini o'zi o'chira oladimi?
**A**: Ha, lekin bu tavsiya etilmaydi. Kamida bitta admin bo'lishi kerak.

## Xavfsizlik

- Admin paneli faqat `MANAGER` roliga ega foydalanuvchilar uchun
- Oddiy xodimlar `/admin` buyrug'ini yuborsalar, hech narsa bo'lmaydi
- Barcha amallar loglanadi

## Yordam

Muammo bo'lsa:
1. Botni qayta ishga tushiring: `npm run start:dev`
2. Database ni tekshiring: `nbt_aloqa.sqlite`
3. Loglarni ko'ring: terminaldagi xabarlar
