import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statistics } from 'src/core/entity/statistics.entity';
import { PeriodType } from 'src/common/enum';
import { TaskService } from './task.service';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistics)
    private statisticsRepository: Repository<Statistics>,
    private taskService: TaskService,
  ) {}

  // Statistika hisoblash
  async calculateStatistics(
    user_id: string,
    period_type: PeriodType,
    period_start: Date,
    period_end: Date,
  ): Promise<Statistics> {
    const tasksCount = await this.taskService.getTasksCount(
      user_id,
      period_start,
      period_end,
    );

    // O'rtacha bajarilish vaqtini hisoblash
    const completedTasks = await this.taskService.getTasksByStatus(
      user_id,
      'completed' as any,
    );
    let totalCompletionTime = 0;
    let completedCount = 0;

    for (const task of completedTasks) {
      if (task.completed_at && task.created_at) {
        const completionTime =
          (new Date(task.completed_at).getTime() - new Date(task.created_at).getTime()) /
          (1000 * 60 * 60); // soatlarda
        totalCompletionTime += completionTime;
        completedCount++;
      }
    }

    const average_completion_time =
      completedCount > 0 ? totalCompletionTime / completedCount : 0;

    // Performance score hisoblash
    const performance_score = this.calculatePerformanceScore(
      tasksCount.completed,
      tasksCount.total,
      tasksCount.overdue,
      average_completion_time,
    );

    const statistics = this.statisticsRepository.create({
      user_id,
      period_type,
      period_start,
      period_end,
      tasks_assigned: tasksCount.total,
      tasks_completed: tasksCount.completed,
      tasks_pending: tasksCount.pending,
      tasks_rejected: tasksCount.rejected,
      tasks_overdue: tasksCount.overdue,
      average_completion_time,
      performance_score,
      calculated_at: new Date(),
    });

    return await this.statisticsRepository.save(statistics);
  }

  // Performance score hisoblash
  private calculatePerformanceScore(
    completed: number,
    total: number,
    overdue: number,
    avgTime: number,
  ): number {
    if (total === 0) return 0;

    const completionRate = (completed / total) * 100;
    const onTimeRate = total > 0 ? ((total - overdue) / total) * 100 : 0;
    const speedScore =
      avgTime > 0 ? Math.max(0, 100 - (avgTime / 24) * 10) : 50; // 24 soatdan kam yaxshi

    // Weighted average
    const score = completionRate * 0.4 + onTimeRate * 0.4 + speedScore * 0.2;

    return Math.min(100, Math.max(0, score));
  }

  // Kunlik statistika
  async getDailyStatistics(user_id: string, date: Date): Promise<Statistics> {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return await this.calculateStatistics(
      user_id,
      PeriodType.DAILY,
      start,
      end,
    );
  }

  // Haftalik statistika
  async getWeeklyStatistics(user_id: string, date: Date): Promise<Statistics> {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Dushanba
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Yakshanba
    end.setHours(23, 59, 59, 999);

    return await this.calculateStatistics(
      user_id,
      PeriodType.WEEKLY,
      start,
      end,
    );
  }

  // Oylik statistika
  async getMonthlyStatistics(
    user_id: string,
    year: number,
    month: number,
  ): Promise<Statistics> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    return await this.calculateStatistics(
      user_id,
      PeriodType.MONTHLY,
      start,
      end,
    );
  }

  // Statistika tarixini olish
  async getStatisticsHistory(
    user_id: string,
    period_type: PeriodType,
  ): Promise<Statistics[]> {
    return await this.statisticsRepository.find({
      where: { user_id, period_type },
      order: { period_start: 'DESC' },
    });
  }

  // Barcha xodimlar uchun oylik statistika
  async getAllEmployeesMonthlyStats(
    year: number,
    month: number,
    user_ids: string[],
  ): Promise<Statistics[]> {
    const stats: Statistics[] = [];

    for (const user_id of user_ids) {
      const stat = await this.getMonthlyStatistics(user_id, year, month);
      stats.push(stat);
    }

    return stats.sort((a, b) => b.performance_score - a.performance_score);
  }

  // Eng yaxshi xodimlar (top performers)
  async getTopPerformers(
    period_type: PeriodType,
    limit: number = 10,
  ): Promise<Statistics[]> {
    return await this.statisticsRepository.find({
      where: { period_type },
      order: { performance_score: 'DESC' },
      take: limit,
    });
  }

  // Bo'lim bo'yicha statistika
  async getDepartmentStatistics(
    _department: string,
    _period_start: Date,
    _period_end: Date,
  ): Promise<{
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    overdue_tasks: number;
    average_performance: number;
  }> {
    void _department;
    void _period_start;
    void _period_end;
    // Bu yerda bo'lim xodimlarini olish kerak
    // Hozircha oddiy versiya
    return {
      total_tasks: 0,
      completed_tasks: 0,
      pending_tasks: 0,
      overdue_tasks: 0,
      average_performance: 0,
    };
  }
}
