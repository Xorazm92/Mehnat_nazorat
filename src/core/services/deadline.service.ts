import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Deadline } from '../entity/deadline.entity';
import { NotificationService } from './notification.service';

@Injectable()
export class DeadlineService {
  constructor(
    @InjectRepository(Deadline)
    private readonly deadlineRepo: Repository<Deadline>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(data: Partial<Deadline>): Promise<Deadline> {
    const deadline = this.deadlineRepo.create(data);
    const saved = await this.deadlineRepo.save(deadline);

    await this.scheduleReminders(saved);
    return saved;
  }

  async createBulk(deadlines: Partial<Deadline>[]): Promise<Deadline[]> {
    const created: Deadline[] = [];
    for (const payload of deadlines) {
      created.push(await this.create(payload));
    }
    return created;
  }

  async update(id: string, data: Partial<Deadline>): Promise<Deadline | null> {
    await this.deadlineRepo.update(id, data);
    return this.deadlineRepo.findOne({ where: { id } });
  }

  async complete(id: string): Promise<Deadline | null> {
    await this.deadlineRepo.update(id, {
      status: 'completed',
      completed_at: new Date(),
    });

    return this.deadlineRepo.findOne({ where: { id } });
  }

  async reopen(id: string): Promise<Deadline | null> {
    await this.deadlineRepo.update(id, {
      status: 'pending',
      completed_at: null,
    });

    return this.deadlineRepo.findOne({ where: { id } });
  }

  async getUpcoming(userId?: string): Promise<Deadline[]> {
    const where: any = {
      status: 'pending',
      due_date: Between(new Date(), this.addDays(new Date(), 30)),
    };

    if (userId) {
      where.assigned_to_id = userId;
    }

    return this.deadlineRepo.find({
      where,
      relations: ['organization', 'assigned_to'],
      order: { due_date: 'ASC' },
    });
  }

  async getOverdue(): Promise<Deadline[]> {
    return this.deadlineRepo.find({
      where: {
        due_date: LessThan(new Date()),
        status: 'pending',
      },
      relations: ['organization', 'assigned_to'],
      order: { due_date: 'ASC' },
    });
  }

  async countCompleted(): Promise<number> {
    return this.deadlineRepo.count({ where: { status: 'completed' } });
  }

  async getStatsByOrganization(
    organizationId: string,
  ): Promise<{
    total: number;
    pending: number;
    upcoming30: number;
    overdue: number;
    completed: number;
  }> {
    const now = new Date();
    const in30Days = this.addDays(new Date(), 30);

    const [total, pending, upcoming30, overdue, completed] = await Promise.all([
      this.deadlineRepo.count({ where: { organization_id: organizationId } }),
      this.deadlineRepo.count({
        where: { organization_id: organizationId, status: 'pending' },
      }),
      this.deadlineRepo.count({
        where: {
          organization_id: organizationId,
          status: 'pending',
          due_date: Between(now, in30Days),
        },
      }),
      this.deadlineRepo.count({
        where: {
          organization_id: organizationId,
          status: 'pending',
          due_date: LessThan(now),
        },
      }),
      this.deadlineRepo.count({
        where: { organization_id: organizationId, status: 'completed' },
      }),
    ]);

    return {
      total,
      pending,
      upcoming30,
      overdue,
      completed,
    };
  }

  async getUpcomingByOrganization(
    organizationId: string,
    limit = 5,
  ): Promise<Deadline[]> {
    return this.deadlineRepo.find({
      where: {
        organization_id: organizationId,
        status: 'pending',
        due_date: Between(new Date(), this.addDays(new Date(), 30)),
      },
      relations: ['assigned_to'],
      order: { due_date: 'ASC' },
      take: limit,
    });
  }

  async getByIdWithRelations(id: string): Promise<Deadline | null> {
    return this.deadlineRepo.findOne({
      where: { id },
      relations: ['organization', 'assigned_to', 'created_by'],
    });
  }

  private async scheduleReminders(deadline: Deadline) {
    if (!deadline.assigned_to_id || !deadline.reminder_days?.length) {
      return;
    }

    const remindersToSend = deadline.reminder_days.filter(
      (tag) => !deadline.reminders_sent?.includes(`${tag}d`),
    );

    for (const daysBefore of remindersToSend) {
      const diffMs =
        new Date(deadline.due_date).getTime() -
        this.addDays(new Date(), daysBefore).getTime();

      if (diffMs >= 0) {
        await this.notificationService.send({
          user_id: deadline.assigned_to_id,
          title: `⏳ Deadline yaqinlashmoqda`,
          message: `${deadline.title} - ${daysBefore} kun qoldi`,
          type: 'warning',
          category: 'deadline',
          action_data: { type: 'view_deadline', deadline_id: deadline.id },
        });
      }
    }

    await this.deadlineRepo.update(deadline.id, {
      reminders_sent: remindersToSend.map((d) => `${d}d`),
    });
  }

  private addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }
}
