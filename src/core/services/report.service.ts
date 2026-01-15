import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/core/entity/report.entity';
import { ReportStatus } from 'src/common/enum';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  // Yangi hisobot yaratish
  async createReport(data: Partial<Report>): Promise<Report> {
    const report = this.reportRepository.create({
      ...data,
      status: ReportStatus.PENDING,
      submitted_at: new Date(),
    });
    return await this.reportRepository.save(report);
  }

  // Hisobotni ID bo'yicha topish
  async findById(id: string): Promise<Report> {
    return await this.reportRepository.findOne({ where: { id } });
  }

  // Vazifa bo'yicha hisobotlarni olish
  async getReportsByTask(task_id: string): Promise<Report[]> {
    return await this.reportRepository.find({
      where: { task_id },
      order: { submitted_at: 'DESC' },
    });
  }

  // Xodimning hisobotlarini olish
  async getReportsByEmployee(telegram_id: string): Promise<Report[]> {
    return await this.reportRepository.find({
      where: { submitted_by: telegram_id },
      order: { submitted_at: 'DESC' },
    });
  }

  // Status bo'yicha hisobotlarni olish
  async getReportsByStatus(status: ReportStatus): Promise<Report[]> {
    return await this.reportRepository.find({
      where: { status },
      order: { submitted_at: 'DESC' },
    });
  }

  // Kutilayotgan hisobotlar (rahbar uchun)
  async getPendingReports(): Promise<Report[]> {
    return await this.reportRepository.find({
      where: { status: ReportStatus.PENDING },
      order: { submitted_at: 'ASC' },
    });
  }

  // Hisobotni tasdiqlash
  async approveReport(id: string, comment?: string): Promise<Report> {
    await this.reportRepository.update(id, {
      status: ReportStatus.APPROVED,
      reviewed_at: new Date(),
      reviewer_comment: comment,
    });
    return await this.findById(id);
  }

  // Hisobotni rad etish
  async rejectReport(id: string, reason: string): Promise<Report> {
    await this.reportRepository.update(id, {
      status: ReportStatus.REJECTED,
      reviewed_at: new Date(),
      rejection_reason: reason,
    });
    return await this.findById(id);
  }

  // Qayta ishlash kerak
  async needsRevision(id: string, comment: string): Promise<Report> {
    await this.reportRepository.update(id, {
      status: ReportStatus.NEEDS_REVISION,
      reviewed_at: new Date(),
      reviewer_comment: comment,
    });
    return await this.findById(id);
  }

  // Hisobotni yangilash
  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    await this.reportRepository.update(id, data);
    return await this.findById(id);
  }

  // Hisobotni o'chirish
  async deleteReport(id: string): Promise<void> {
    await this.reportRepository.delete(id);
  }

  // Vazifa uchun oxirgi hisobot
  async getLatestReportForTask(task_id: string): Promise<Report> {
    return await this.reportRepository.findOne({
      where: { task_id },
      order: { submitted_at: 'DESC' },
    });
  }

  // Yakuniy hisobotni belgilash
  async markAsFinal(id: string): Promise<Report> {
    await this.reportRepository.update(id, { is_final: true });
    return await this.findById(id);
  }
}
