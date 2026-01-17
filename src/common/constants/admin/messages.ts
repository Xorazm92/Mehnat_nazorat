export const mainMessageAdmin = `Kerakli bo'limni tanlang ☟`;

export const waitingUsersMessage = `Ro'yxatdan o'tishni kutayotganlar soni: `;

export const allUsersMessage = `Botga ulangan jamoa a'zolari soni: `;

export const organizationsSummaryMessage = (payload: {
  total: number;
  active: number;
  withoutInspector: number;
}) => `
🏢 Tashkilotlar statistikasi:
- Jami: ${payload.total}
- Faol: ${payload.active}
- Inspektorsiz: ${payload.withoutInspector}
`;

export const reportsSummaryMessage = (payload: {
  pending: number;
  approved: number;
  rejected: number;
  overdue: number;
}) => `
📝 Hisobotlar holati:
- Kutilayotgan: ${payload.pending}
- Tasdiqlangan: ${payload.approved}
- Rad etilgan: ${payload.rejected}
- Kechikkan: ${payload.overdue}
`;

export const deadlinesSummaryMessage = (payload: {
  upcoming: number;
  overdue: number;
  completed: number;
}) => `
⏳ Deadline'lar:
- Yaqin 30 kunda: ${payload.upcoming}
- Kechikkan: ${payload.overdue}
- Bajarilgan: ${payload.completed}
`;

export const notificationsSummaryMessage = (payload: {
  unread: number;
  total: number;
}) => `
🔔 Bildirishnomalar:
- O'qilmagan: ${payload.unread}
- Jami: ${payload.total}
`;
