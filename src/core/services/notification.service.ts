import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entity/notification.entity';

type SendNotificationPayload = {
  user_id: string;
  title: string;
  message: string;
  category: 'report' | 'deadline' | 'inspection' | 'system';
  type?: 'info' | 'warning' | 'urgent' | 'success';
  action_data?: Record<string, any>;
};

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async send(payload: SendNotificationPayload): Promise<Notification> {
    const notification = this.notificationRepo.create({
      ...payload,
      is_read: false,
      type: payload.type ?? 'info',
      sent_at: new Date(),
    });

    return this.notificationRepo.save(notification);
  }

  async countAll(): Promise<number> {
    return this.notificationRepo.count();
  }

  async countUnread(userId?: string): Promise<number> {
    if (userId) {
      return this.notificationRepo.count({
        where: { user_id: userId, is_read: false },
      });
    }
    return this.notificationRepo.count({
      where: { is_read: false },
    });
  }

  async getRecent(limit = 10): Promise<Notification[]> {
    return this.notificationRepo.find({
      order: { sent_at: 'DESC' },
      take: limit,
    });
  }

  async markAsRead(id: string): Promise<Notification | null> {
    await this.notificationRepo.update(id, {
      is_read: true,
      read_at: new Date(),
    });
    return this.notificationRepo.findOne({ where: { id } });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo.update(
      { user_id: userId, is_read: false },
      {
        is_read: true,
        read_at: new Date(),
      },
    );
  }

  async getUnread(userId: string): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { user_id: userId, is_read: false },
      order: { sent_at: 'DESC' },
    });
  }

  async getById(id: string): Promise<Notification | null> {
    return this.notificationRepo.findOne({ where: { id } });
  }

  async getUserNotifications(
    userId: string,
    limit = 50,
  ): Promise<Notification[]> {
    return this.notificationRepo.find({
      where: { user_id: userId },
      order: { sent_at: 'DESC' },
      take: limit,
    });
  }

  async deleteOlderThan(days = 90): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    await this.notificationRepo
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where('sent_at < :cutoff', { cutoff })
      .execute();
  }
}
