import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/core/entity/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  // Yangi xabar yaratish
  async createMessage(data: Partial<Message>): Promise<Message> {
    const message = this.messageRepository.create({
      ...data,
      sent_at: new Date(),
      is_read: false,
    });
    return await this.messageRepository.save(message);
  }

  // Xabarni ID bo'yicha topish
  async findById(id: string): Promise<Message> {
    return await this.messageRepository.findOne({ where: { id } });
  }

  // Ikki foydalanuvchi o'rtasidagi xabarlar
  async getConversation(user1: string, user2: string): Promise<Message[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where(
        '(message.from_user = :user1 AND message.to_user = :user2) OR (message.from_user = :user2 AND message.to_user = :user1)',
        { user1, user2 },
      )
      .orderBy('message.sent_at', 'ASC')
      .getMany();
  }

  // Foydalanuvchining barcha xabarlari
  async getUserMessages(telegram_id: string): Promise<Message[]> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where(
        'message.from_user = :telegram_id OR message.to_user = :telegram_id',
        { telegram_id },
      )
      .orderBy('message.sent_at', 'DESC')
      .getMany();
  }

  // O'qilmagan xabarlar
  async getUnreadMessages(telegram_id: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { to_user: telegram_id, is_read: false },
      order: { sent_at: 'ASC' },
    });
  }

  // Xabarni o'qilgan deb belgilash
  async markAsRead(id: string): Promise<Message> {
    await this.messageRepository.update(id, {
      is_read: true,
      read_at: new Date(),
    });
    return await this.findById(id);
  }

  // Barcha xabarlarni o'qilgan deb belgilash
  async markAllAsRead(telegram_id: string, from_user: string): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ is_read: true, read_at: new Date() })
      .where(
        'to_user = :telegram_id AND from_user = :from_user AND is_read = false',
        {
          telegram_id,
          from_user,
        },
      )
      .execute();
  }

  // Vazifa bilan bog'liq xabarlar
  async getTaskMessages(task_id: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { task_id },
      order: { sent_at: 'ASC' },
    });
  }

  // Hisobot bilan bog'liq xabarlar
  async getReportMessages(report_id: string): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { report_id },
      order: { sent_at: 'ASC' },
    });
  }

  // Xabarni o'chirish
  async deleteMessage(id: string): Promise<void> {
    await this.messageRepository.delete(id);
  }

  // O'qilmagan xabarlar soni
  async getUnreadCount(telegram_id: string): Promise<number> {
    return await this.messageRepository.count({
      where: { to_user: telegram_id, is_read: false },
    });
  }

  // Oxirgi xabar
  async getLastMessage(user1: string, user2: string): Promise<Message> {
    return await this.messageRepository
      .createQueryBuilder('message')
      .where(
        '(message.from_user = :user1 AND message.to_user = :user2) OR (message.from_user = :user2 AND message.to_user = :user1)',
        { user1, user2 },
      )
      .orderBy('message.sent_at', 'DESC')
      .getOne();
  }

  // Suhbatdoshlar ro'yxati
  async getConversationsList(telegram_id: string): Promise<
    Array<{
      user_id: string;
      last_message: Message;
      unread_count: number;
    }>
  > {
    const messages = await this.getUserMessages(telegram_id);
    const conversationsMap = new Map<
      string,
      { last_message: Message; unread_count: number }
    >();

    for (const message of messages) {
      const otherUser =
        message.from_user === telegram_id ? message.to_user : message.from_user;

      if (!conversationsMap.has(otherUser)) {
        const unreadCount = await this.messageRepository.count({
          where: {
            from_user: otherUser,
            to_user: telegram_id,
            is_read: false,
          },
        });

        conversationsMap.set(otherUser, {
          last_message: message,
          unread_count: unreadCount,
        });
      }
    }

    return Array.from(conversationsMap.entries()).map(([user_id, data]) => ({
      user_id,
      ...data,
    }));
  }
}
