import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salary } from 'src/core/entity/salary.entity';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(Salary)
    private salaryRepository: Repository<Salary>,
  ) {}

  // Maosh hisoblash
  async calculateSalary(
    user_id: string,
    month: string,
    base_salary: number,
    tasks_completed: number,
    tasks_total: number,
    bonus_coefficient: number = 1.0,
    penalty_per_task: number = 0,
    overdue_tasks: number = 0,
  ): Promise<Salary> {
    const completion_rate =
      tasks_total > 0 ? (tasks_completed / tasks_total) * 100 : 0;

    // Bonus hisoblash
    const bonus = completion_rate * bonus_coefficient;

    // Jarima hisoblash
    const penalty = overdue_tasks * penalty_per_task;

    // Jami maosh
    const total = base_salary + bonus - penalty;

    const salary = this.salaryRepository.create({
      user_id,
      month,
      base_salary,
      bonus,
      penalty,
      total,
      tasks_completed,
      tasks_total,
      completion_rate,
      calculated_at: new Date(),
    });

    return await this.salaryRepository.save(salary);
  }

  // Foydalanuvchining maosh tarixini olish
  async getSalaryHistory(user_id: string): Promise<Salary[]> {
    return await this.salaryRepository.find({
      where: { user_id },
      order: { month: 'DESC' },
    });
  }

  // Oylik maoshni olish
  async getSalaryByMonth(user_id: string, month: string): Promise<Salary> {
    return await this.salaryRepository.findOne({
      where: { user_id, month },
    });
  }

  // Bonus qo'shish
  async addBonus(
    user_id: string,
    month: string,
    bonus_amount: number,
    notes?: string,
  ): Promise<Salary> {
    let salary = await this.getSalaryByMonth(user_id, month);

    if (!salary) {
      // Agar maosh hali hisoblanmagan bo'lsa, yangi yozuv yaratamiz
      salary = this.salaryRepository.create({
        user_id,
        month,
        base_salary: 0,
        bonus: bonus_amount,
        penalty: 0,
        total: bonus_amount,
        tasks_completed: 0,
        tasks_total: 0,
        completion_rate: 0,
        calculated_at: new Date(),
        notes,
      });
    } else {
      salary.bonus += bonus_amount;
      salary.total = salary.base_salary + salary.bonus - salary.penalty;
      if (notes) {
        salary.notes = salary.notes ? `${salary.notes}\n${notes}` : notes;
      }
    }

    return await this.salaryRepository.save(salary);
  }

  // Jarima qo'shish
  async addPenalty(
    user_id: string,
    month: string,
    penalty_amount: number,
    notes?: string,
  ): Promise<Salary> {
    let salary = await this.getSalaryByMonth(user_id, month);

    if (!salary) {
      salary = this.salaryRepository.create({
        user_id,
        month,
        base_salary: 0,
        bonus: 0,
        penalty: penalty_amount,
        total: -penalty_amount,
        tasks_completed: 0,
        tasks_total: 0,
        completion_rate: 0,
        calculated_at: new Date(),
        notes,
      });
    } else {
      salary.penalty += penalty_amount;
      salary.total = salary.base_salary + salary.bonus - salary.penalty;
      if (notes) {
        salary.notes = salary.notes ? `${salary.notes}\n${notes}` : notes;
      }
    }

    return await this.salaryRepository.save(salary);
  }

  // Maoshni yangilash
  async updateSalary(id: string, data: Partial<Salary>): Promise<Salary> {
    await this.salaryRepository.update(id, data);
    return await this.salaryRepository.findOne({ where: { id } });
  }

  // Barcha xodimlarning oylik maoshini hisoblash
  async calculateMonthlySalariesForAll(
    users: Array<{ user_id: string; base_salary: number }>,
    month: string,
    tasksData: Map<
      string,
      { completed: number; total: number; overdue: number }
    >,
    bonus_coefficient: number = 1.0,
    penalty_per_task: number = 0,
  ): Promise<Salary[]> {
    const salaries: Salary[] = [];

    for (const user of users) {
      const tasks = tasksData.get(user.user_id) || {
        completed: 0,
        total: 0,
        overdue: 0,
      };

      const salary = await this.calculateSalary(
        user.user_id,
        month,
        user.base_salary,
        tasks.completed,
        tasks.total,
        bonus_coefficient,
        penalty_per_task,
        tasks.overdue,
      );

      salaries.push(salary);
    }

    return salaries;
  }

  // Jami maosh statistikasi
  async getTotalSalaryStats(month: string): Promise<{
    total_employees: number;
    total_base_salary: number;
    total_bonus: number;
    total_penalty: number;
    total_payout: number;
  }> {
    const salaries = await this.salaryRepository.find({ where: { month } });

    return {
      total_employees: salaries.length,
      total_base_salary: salaries.reduce(
        (sum, s) => sum + Number(s.base_salary),
        0,
      ),
      total_bonus: salaries.reduce((sum, s) => sum + Number(s.bonus), 0),
      total_penalty: salaries.reduce((sum, s) => sum + Number(s.penalty), 0),
      total_payout: salaries.reduce((sum, s) => sum + Number(s.total), 0),
    };
  }
}
