// Umumiy xabarlar
export const MESSAGES = {
  WELCOME: `👋 Xush kelibsiz!\n\nBu bot orqali siz:\n• Vazifalarni boshqarishingiz\n• Hisobotlar yuborishingiz\n• Statistikani ko'rishingiz\n• Maosh ma'lumotlarini olishingiz mumkin`,

  CHOOSE_ACTION: "Kerakli bo'limni tanlang:",

  BACK_TO_MAIN: 'Bosh menyuga qaytdingiz',

  OPERATION_CANCELLED: '❌ Operatsiya bekor qilindi',

  INVALID_INPUT: "⚠️ Noto'g'ri ma'lumot kiritildi. Qaytadan urinib ko'ring.",

  ERROR: "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",

  SUCCESS: '✅ Muvaffaqiyatli bajarildi!',

  NO_PERMISSION: "🚫 Sizda bu amal uchun ruxsat yo'q",
};

// Vazifalar xabarlari
export const TASK_MESSAGES = {
  CREATE_TITLE: '📝 Vazifa nomini kiriting:',

  CREATE_DESCRIPTION: '📄 Vazifa tavsifini kiriting:',

  CREATE_DEADLINE: '📅 Tugash muddatini kiriting (format: DD.MM.YYYY HH:MM):',

  CREATE_PRIORITY: '🎯 Vazifa muhimligini tanlang:',

  SELECT_EMPLOYEE: '👤 Xodimni tanlang:',

  ATTACH_FILES: '📎 Fayllarni yuboring yoki "Davom etish" tugmasini bosing:',

  TASK_CREATED: (taskId: string) =>
    `✅ Vazifa muvaffaqiyatli yaratildi!\n\nVazifa ID: ${taskId}`,

  TASK_ASSIGNED: (title: string, deadline: string) =>
    `📋 Sizga yangi vazifa tayinlandi!\n\n` +
    `📝 Vazifa: ${title}\n` +
    `📅 Muddat: ${deadline}`,

  TASK_DETAILS: (task: any) =>
    `📋 Vazifa tafsilotlari\n\n` +
    `📝 Nomi: ${task.title}\n` +
    `📄 Tavsif: ${task.description}\n` +
    `🎯 Muhimlik: ${getPriorityText(task.priority)}\n` +
    `📅 Muddat: ${formatDate(task.deadline)}\n` +
    `📊 Status: ${getStatusText(task.status)}\n` +
    `👤 Mas'ul: ${task.assigned_to}\n` +
    `📅 Yaratilgan: ${formatDate(task.created_at)}`,

  NO_TASKS: '📭 Vazifalar topilmadi',

  TASK_COMPLETED: '✅ Vazifa bajarildi deb belgilandi!',

  TASK_UPDATED: '✅ Vazifa yangilandi!',

  TASK_DELETED: "🗑 Vazifa o'chirildi",

  OVERDUE_WARNING: (count: number) =>
    `⚠️ Diqqat! Sizda ${count} ta muddati o'tgan vazifa bor!`,
};

// Hisobotlar xabarlari
export const REPORT_MESSAGES = {
  SELECT_TASK: "📋 Qaysi vazifa bo'yicha hisobot yubormoqchisiz?",

  ENTER_REPORT: '📝 Hisobot matnini kiriting:',

  ATTACH_FILES:
    '📎 Hujjatlarni yuboring (rasmlar, videolar, fayllar).\n\n"Yuborish" tugmasini bosing:',

  COMPLETION_PERCENTAGE: '📊 Bajarilish foizini kiriting (0-100):',

  REPORT_SUBMITTED:
    "✅ Hisobot muvaffaqiyatli yuborildi!\n\nRahbar ko'rib chiqishini kuting.",

  NEW_REPORT: (employeeName: string, taskTitle: string) =>
    `📝 Yangi hisobot keldi!\n\n` +
    `👤 Xodim: ${employeeName}\n` +
    `📋 Vazifa: ${taskTitle}`,

  REPORT_APPROVED: '✅ Sizning hisobotingiz tasdiqlandi!',

  REPORT_REJECTED: (reason: string) =>
    `❌ Sizning hisobotingiz rad etildi.\n\n` +
    `Sabab: ${reason}\n\n` +
    `Iltimos, qaytadan hisobot yuboring.`,

  REPORT_NEEDS_REVISION: (comment: string) =>
    `🔄 Hisobotingizni qayta ko'rib chiqing.\n\n` + `Izoh: ${comment}`,

  REPORT_DETAILS: (report: any) =>
    `📝 Hisobot tafsilotlari\n\n` +
    `📋 Vazifa ID: ${report.task_id}\n` +
    `📄 Hisobot: ${report.report_text}\n` +
    `📊 Bajarilish: ${report.completion_percentage}%\n` +
    `📅 Yuborilgan: ${formatDate(report.submitted_at)}\n` +
    `📊 Status: ${getReportStatusText(report.status)}`,

  NO_REPORTS: '📭 Hisobotlar topilmadi',

  ENTER_REJECTION_REASON: '📝 Rad etish sababini kiriting:',

  ENTER_COMMENT: '💬 Izoh kiriting:',
};

// Statistika xabarlari
export const STATS_MESSAGES = {
  DAILY_STATS: (stats: any) =>
    `📅 Kunlik statistika\n\n` +
    `📊 Jami vazifalar: ${stats.tasks_assigned}\n` +
    `✅ Bajarilgan: ${stats.tasks_completed}\n` +
    `⏳ Kutilayotgan: ${stats.tasks_pending}\n` +
    `⚠️ Muddati o'tgan: ${stats.tasks_overdue}\n` +
    `🎯 Samaradorlik: ${stats.performance_score.toFixed(1)}%`,

  WEEKLY_STATS: (stats: any) =>
    `📆 Haftalik statistika\n\n` +
    `📊 Jami vazifalar: ${stats.tasks_assigned}\n` +
    `✅ Bajarilgan: ${stats.tasks_completed}\n` +
    `⏳ Kutilayotgan: ${stats.tasks_pending}\n` +
    `⚠️ Muddati o'tgan: ${stats.tasks_overdue}\n` +
    `⏱ O'rtacha vaqt: ${stats.average_completion_time.toFixed(1)} soat\n` +
    `🎯 Samaradorlik: ${stats.performance_score.toFixed(1)}%`,

  MONTHLY_STATS: (stats: any) =>
    `📈 Oylik statistika\n\n` +
    `📊 Jami vazifalar: ${stats.tasks_assigned}\n` +
    `✅ Bajarilgan: ${stats.tasks_completed}\n` +
    `⏳ Kutilayotgan: ${stats.tasks_pending}\n` +
    `❌ Rad etilgan: ${stats.tasks_rejected}\n` +
    `⚠️ Muddati o'tgan: ${stats.tasks_overdue}\n` +
    `⏱ O'rtacha vaqt: ${stats.average_completion_time.toFixed(1)} soat\n` +
    `🎯 Samaradorlik: ${stats.performance_score.toFixed(1)}%`,

  TOP_PERFORMERS: (performers: any[]) => {
    let message = '🏆 Eng yaxshi xodimlar\n\n';
    performers.forEach((p, index) => {
      message += `${index + 1}. ${p.user_id} - ${p.performance_score.toFixed(1)}%\n`;
    });
    return message;
  },
};

// Maosh xabarlari
export const SALARY_MESSAGES = {
  SELECT_MONTH: '📅 Oyni tanlang (format: YYYY-MM):',

  SELECT_EMPLOYEE_FOR_SALARY: '👤 Xodimni tanlang:',

  ENTER_BONUS: '🎁 Bonus miqdorini kiriting:',

  ENTER_PENALTY: '⚠️ Jarima miqdorini kiriting:',

  ENTER_NOTES: '📝 Izoh kiriting (ixtiyoriy):',

  SALARY_CALCULATED: '✅ Maosh hisoblandi!',

  BONUS_ADDED: (amount: number) => `🎁 ${amount} so'm bonus qo'shildi!`,

  PENALTY_ADDED: (amount: number) => `⚠️ ${amount} so'm jarima qo'yildi`,

  SALARY_DETAILS: (salary: any) =>
    `💰 Maosh ma'lumotlari\n\n` +
    `📅 Oy: ${salary.month}\n` +
    `💵 Asosiy maosh: ${formatMoney(salary.base_salary)}\n` +
    `🎁 Bonus: ${formatMoney(salary.bonus)}\n` +
    `⚠️ Jarima: ${formatMoney(salary.penalty)}\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💰 Jami: ${formatMoney(salary.total)}\n\n` +
    `📊 Bajarilgan vazifalar: ${salary.tasks_completed}/${salary.tasks_total}\n` +
    `🎯 Bajarilish: ${salary.completion_rate.toFixed(1)}%`,

  NO_SALARY_DATA: "📭 Maosh ma'lumotlari topilmadi",

  SALARY_NOTIFICATION: (salary: any) =>
    `💰 Oylik maoshingiz hisoblandi!\n\n` +
    `📅 Oy: ${salary.month}\n` +
    `💵 Jami: ${formatMoney(salary.total)}\n\n` +
    `Tafsilotlarni ko'rish uchun "Maoshim" bo'limiga o'ting.`,
};

// Xabarlar bo'limi
export const MESSAGING = {
  SELECT_RECIPIENT: '👤 Kimga xabar yubormoqchisiz?',

  ENTER_MESSAGE: '💬 Xabar matnini kiriting:',

  MESSAGE_SENT: '✅ Xabar yuborildi!',

  NEW_MESSAGE: (from: string) => `💬 Yangi xabar ${from} dan`,

  NO_MESSAGES: "📭 Xabarlar yo'q",

  CONVERSATION_WITH: (name: string) => `💬 ${name} bilan suhbat`,
};

// Yordamchi funksiyalar
function getPriorityText(priority: string): string {
  const priorities = {
    low: '🟢 Past',
    medium: "🟡 O'rta",
    high: '🟠 Yuqori',
    urgent: '🔴 Shoshilinch',
  };
  return priorities[priority] || priority;
}

function getStatusText(status: string): string {
  const statuses = {
    pending: '⏳ Kutilmoqda',
    in_progress: '🔄 Jarayonda',
    completed: '✅ Bajarilgan',
    rejected: '❌ Rad etilgan',
    overdue: "⚠️ Muddati o'tgan",
  };
  return statuses[status] || status;
}

function getReportStatusText(status: string): string {
  const statuses = {
    pending: '⏳ Kutilmoqda',
    approved: '✅ Tasdiqlangan',
    rejected: '❌ Rad etilgan',
    needs_revision: '🔄 Qayta ishlash kerak',
  };
  return statuses[status] || status;
}

function formatDate(date: any): string {
  if (!date) return '-';
  const d = new Date(typeof date === 'number' ? date : date);
  return d.toLocaleString('uz-UZ');
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
  }).format(amount);
}
