// Rahbar klaviaturalari
export const MANAGER_MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '📋 Vazifalar' }, { text: '📝 Hisobotlar' }],
      [{ text: '📊 Statistika' }, { text: '💰 Maosh' }],
      [{ text: '💬 Xabarlar' }, { text: '👥 Xodimlar' }],
      [{ text: '📁 Bolimlar' }, { text: '⚙️ Sozlamalar' }],
      [{ text: '🏠 Bosh menyu' }, { text: '🛠 Admin panel' }],
    ],
    resize_keyboard: true,
  },
};

export const TASKS_MENU_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '➕ Yangi vazifa' }, { text: '🔍 Qidirish' }],
      [{ text: '⏳ Faol vazifalar' }, { text: '✅ Tugallangan' }],
      [{ text: '⚠️ Muddati otgan' }, { text: '🔥 Shoshilinch' }],
      [{ text: '📊 Barcha vazifalar' }, { text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

export const REPORTS_MENU_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '📥 Yangi hisobotlar' }, { text: '📊 Barcha hisobotlar' }],
      [{ text: '✅ Tasdiqlangan' }, { text: '❌ Rad etilgan' }],
      [{ text: '⏳ Kutilayotgan' }, { text: '🔄 Qayta ishlash' }],
      [{ text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

export const STATISTICS_MENU_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '📅 Kunlik' }, { text: '📆 Haftalik' }],
      [{ text: '📈 Oylik' }, { text: '📊 Yillik' }],
      [{ text: '🏆 Reytinglar' }, { text: '📉 Tahlil' }],
      [{ text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

export const SALARY_MENU_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '💵 Maosh hisoblash' }, { text: '📊 Statistika' }],
      [{ text: '🎁 Bonus berish' }, { text: '⚠️ Jarima qoyish' }],
      [{ text: '📜 Maosh tarixi' }, { text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

// Xodim klaviaturalari
export const EMPLOYEE_MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '📋 Mening vazifalarim' }, { text: '📝 Hisobot yuborish' }],
      [{ text: '📊 Statistikam' }, { text: '💰 Maoshim' }],
      [{ text: '💬 Xabarlar' }, { text: '⚙️ Sozlamalar' }],
      [{ text: '🏠 Bosh menyu' }],
    ],
    resize_keyboard: true,
  },
};

export const EMPLOYEE_TASKS_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '⏳ Faol vazifalar' }, { text: '📅 Bugungi' }],
      [{ text: '✅ Tugallangan' }, { text: '⚠️ Muddati otgan' }],
      [{ text: '🔥 Shoshilinch' }, { text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

export const EMPLOYEE_REPORTS_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '📤 Yangi hisobot' }, { text: '📊 Yuborilgan hisobotlar' }],
      [{ text: '✅ Tasdiqlangan' }, { text: '❌ Rad etilgan' }],
      [{ text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

export const EMPLOYEE_STATS_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '📈 Oylik natijalar' }, { text: '📊 Tarix' }],
      [{ text: '🎯 Bajarilish foizi' }, { text: '🏆 Mening reytingim' }],
      [{ text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

export const EMPLOYEE_SALARY_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '💵 Joriy oy' }, { text: '📜 Maosh tarixi' }],
      [{ text: '🎁 Bonus va jarimalar' }, { text: '🔙 Orqaga' }],
    ],
    resize_keyboard: true,
  },
};

// Umumiy klaviaturalar
export const PRIORITY_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🟢 Past', callback_data: 'priority_low' },
        { text: '🟡 Orta', callback_data: 'priority_medium' },
      ],
      [
        { text: '🟠 Yuqori', callback_data: 'priority_high' },
        { text: '🔴 Shoshilinch', callback_data: 'priority_urgent' },
      ],
    ],
  },
};

export const CONFIRM_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '✅ Tasdiqlash', callback_data: 'confirm_yes' },
        { text: '❌ Bekor qilish', callback_data: 'confirm_no' },
      ],
    ],
  },
};

export const REPORT_ACTION_KEYBOARD = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '✅ Tasdiqlash', callback_data: 'report_approve' },
        { text: '❌ Rad etish', callback_data: 'report_reject' },
      ],
      [
        { text: '🔄 Qayta ishlash', callback_data: 'report_revision' },
        { text: '💬 Izoh qoldirish', callback_data: 'report_comment' },
      ],
    ],
  },
};

export const BACK_KEYBOARD = {
  reply_markup: {
    keyboard: [[{ text: '🔙 Orqaga' }]],
    resize_keyboard: true,
  },
};

export const CANCEL_KEYBOARD = {
  reply_markup: {
    keyboard: [[{ text: '❌ Bekor qilish' }]],
    resize_keyboard: true,
  },
};

// Inline klaviaturalar
export function createTaskActionsKeyboard(taskId: string) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Bajarildi', callback_data: `task_complete_${taskId}` },
          { text: '📝 Hisobot', callback_data: `task_report_${taskId}` },
        ],
        [
          { text: '📋 Tafsilotlar', callback_data: `task_details_${taskId}` },
          { text: '💬 Xabar', callback_data: `task_message_${taskId}` },
        ],
      ],
    },
  };
}

export function createReportActionsKeyboard(reportId: string) {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '✅ Tasdiqlash',
            callback_data: `report_approve_${reportId}`,
          },
          { text: '❌ Rad etish', callback_data: `report_reject_${reportId}` },
        ],
        [
          {
            text: '🔄 Qayta ishlash',
            callback_data: `report_revision_${reportId}`,
          },
          { text: '👁 Korish', callback_data: `report_view_${reportId}` },
        ],
      ],
    },
  };
}

export function createPaginationKeyboard(
  page: number,
  totalPages: number,
  prefix: string,
) {
  const buttons = [];

  if (page > 1) {
    buttons.push({
      text: '⬅️ Orqaga',
      callback_data: `${prefix}_page_${page - 1}`,
    });
  }

  buttons.push({ text: `${page}/${totalPages}`, callback_data: 'noop' });

  if (page < totalPages) {
    buttons.push({
      text: 'Keyingi ➡️',
      callback_data: `${prefix}_page_${page + 1}`,
    });
  }

  return {
    reply_markup: {
      inline_keyboard: [buttons],
    },
  };
}
