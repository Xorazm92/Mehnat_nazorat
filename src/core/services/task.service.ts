import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Task } from 'src/core/entity/task.entity';
import { TaskStatus, TaskPriority } from 'src/common/enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  // Yangi vazifa yaratish
  async createTask(data: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      status: TaskStatus.PENDING,
    });
    return await this.taskRepository.save(task);
  }

  // Vazifani ID bo'yicha topish
  async findById(id: string): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id } });
  }

  // Xodimning barcha vazifalarini olish
  async getTasksByEmployee(telegram_id: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { assigned_to: telegram_id },
      order: { created_at: 'DESC' },
    });
  }

  // Rahbarning bergan vazifalarini olish
  async getTasksByManager(telegram_id: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { assigned_by: telegram_id },
      order: { created_at: 'DESC' },
    });
  }

  // Status bo'yicha vazifalarni olish
  async getTasksByStatus(
    telegram_id: string,
    status: TaskStatus,
  ): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { assigned_to: telegram_id, status },
      order: { created_at: 'DESC' },
    });
  }

  // Muddati o'tayotgan vazifalarni olish
  async getOverdueTasks(telegram_id: string): Promise<Task[]> {
    const now = new Date();
    return await this.taskRepository.find({
      where: {
        assigned_to: telegram_id,
        status: TaskStatus.PENDING,
        deadline: LessThan(now),
      },
      order: { deadline: 'ASC' },
    });
  }

  // Bugungi vazifalarni olish
  async getTodayTasks(telegram_id: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.taskRepository.find({
      where: {
        assigned_to: telegram_id,
        deadline: Between(today, tomorrow),
      },
      order: { priority: 'DESC' },
    });
  }

  // Vazifani yangilash
  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    await this.taskRepository.update(id, data);
    return await this.findById(id);
  }

  // Vazifa statusini o'zgartirish
  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    const updateData: Partial<Task> = { status };

    if (status === TaskStatus.COMPLETED) {
      updateData.completed_at = new Date();
    }

    await this.taskRepository.update(id, updateData);
    return await this.findById(id);
  }

  // Vazifani o'chirish
  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  // Bo'lim bo'yicha vazifalar
  async getTasksByDepartment(department: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { department },
      order: { created_at: 'DESC' },
    });
  }

  // Muhimlik darajasi bo'yicha
  async getTasksByPriority(
    telegram_id: string,
    priority: TaskPriority,
  ): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { assigned_to: telegram_id, priority },
      order: { deadline: 'ASC' },
    });
  }

  // Shoshilinch vazifalar
  async getUrgentTasks(telegram_id: string): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        assigned_to: telegram_id,
        is_urgent: true,
        status: TaskStatus.PENDING,
      },
      order: { deadline: 'ASC' },
    });
  }

  // Statistika uchun
  async getTasksCount(
    telegram_id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    total: number;
    completed: number;
    pending: number;
    rejected: number;
    overdue: number;
  }> {
    const tasks = await this.taskRepository.find({
      where: {
        assigned_to: telegram_id,
        created_at: Between(startDate.getTime(), endDate.getTime()) as any,
      },
    });

    const now = new Date();

    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
      rejected: tasks.filter((t) => t.status === TaskStatus.REJECTED).length,
      overdue: tasks.filter(
        (t) => t.status === TaskStatus.PENDING && new Date(t.deadline) < now,
      ).length,
    };
  }
}
