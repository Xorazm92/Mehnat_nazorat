import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { ReportSubmission } from '../entity/report-submission.entity';
import { ReportHistory } from '../entity/report-history.entity';
import { NotificationService } from './notification.service';

@Injectable()
export class ReportSubmissionService {
  constructor(
    @InjectRepository(ReportSubmission)
    private readonly reportRepo: Repository<ReportSubmission>,
    @InjectRepository(ReportHistory)
    private readonly historyRepo: Repository<ReportHistory>,
    private readonly notificationService: NotificationService,
  ) {}

  async submitReport(data: {
    title: string;
    report_type: string;
    organization_id: string;
    submitted_by_id: string;
    files?: string[];
    file_metadata?: any[];
    deadline?: Date;
    assigned_inspector_id?: string;
  }): Promise<ReportSubmission> {
    const report = this.reportRepo.create({
      ...data,
      files: data.files ?? [],
      file_metadata: data.file_metadata ?? null,
      submitted_at: new Date(),
      status: 'pending',
    });

    const saved = await this.reportRepo.save(report);
    await this.addHistory(saved.id, data.submitted_by_id, 'submitted');

    if (saved.assigned_inspector_id) {
      await this.notificationService.send({
        user_id: saved.assigned_inspector_id,
        title: 'Yangi hisobot',
        message: `${data.title} tashkilot: ${saved.organization_id}`,
        type: 'info',
        category: 'report',
        action_data: { type: 'view_report', report_id: saved.id },
      });
    }

    return saved;
  }

  async approveReport(
    reportId: string,
    reviewerId: string,
    comment?: string,
  ): Promise<ReportSubmission> {
    const report = await this.reportRepo.findOneOrFail({
      where: { id: reportId },
    });

    report.status = 'approved';
    report.reviewed_at = new Date();
    report.approved_at = new Date();
    report.reviewed_by_id = reviewerId;
    report.reviewer_comment = comment;

    await this.reportRepo.save(report);
    await this.addHistory(reportId, reviewerId, 'approved', comment);

    await this.notificationService.send({
      user_id: report.submitted_by_id,
      title: '✅ Hisobot tasdiqlandi',
      message: `${report.title} tasdiqlandi`,
      type: 'success',
      category: 'report',
      action_data: { type: 'view_report', report_id: report.id },
    });

    return report;
  }

  async rejectReport(
    reportId: string,
    reviewerId: string,
    reason: string,
  ): Promise<ReportSubmission> {
    const report = await this.reportRepo.findOneOrFail({
      where: { id: reportId },
    });

    report.status = 'rejected';
    report.reviewed_at = new Date();
    report.reviewed_by_id = reviewerId;
    report.rejection_reason = reason;

    await this.reportRepo.save(report);
    await this.addHistory(reportId, reviewerId, 'rejected', reason);

    await this.notificationService.send({
      user_id: report.submitted_by_id,
      title: '❌ Hisobot rad etildi',
      message: `${report.title} - Sabab: ${reason}`,
      type: 'warning',
      category: 'report',
    });

    return report;
  }

  async requestRevision(
    reportId: string,
    reviewerId: string,
    comment: string,
  ): Promise<ReportSubmission> {
    const report = await this.reportRepo.findOneOrFail({
      where: { id: reportId },
    });

    report.status = 'revision_needed';
    report.reviewed_at = new Date();
    report.reviewed_by_id = reviewerId;
    report.reviewer_comment = comment;
    report.revision_count += 1;

    await this.reportRepo.save(report);
    await this.addHistory(reportId, reviewerId, 'revision_requested', comment);

    await this.notificationService.send({
      user_id: report.submitted_by_id,
      title: '🔄 Hisobot qayta ishlash talab qilinmoqda',
      message: `${report.title} - ${comment}`,
      type: 'warning',
      category: 'report',
    });

    return report;
  }

  async getPendingReports(inspectorId?: string): Promise<ReportSubmission[]> {
    const where: any = { status: 'pending' };
    if (inspectorId) {
      where.assigned_inspector_id = inspectorId;
    }

    return this.reportRepo.find({
      where,
      relations: ['organization', 'submitted_by'],
      order: { submitted_at: 'ASC' },
    });
  }

  async getOverdueReports(): Promise<ReportSubmission[]> {
    return this.reportRepo.find({
      where: {
        deadline: LessThan(new Date()),
        status: 'pending',
        is_late: false,
      },
      relations: ['organization', 'assigned_inspector'],
    });
  }

  async getByIdWithRelations(
    id: string,
  ): Promise<(ReportSubmission & { history: ReportHistory[] }) | null> {
    return this.reportRepo
      .createQueryBuilder('report')
      .leftJoinAndSelect('report.organization', 'organization')
      .leftJoinAndSelect('report.submitted_by', 'submitted_by')
      .leftJoinAndSelect('report.assigned_inspector', 'assigned_inspector')
      .leftJoinAndSelect('report.reviewed_by', 'reviewed_by')
      .leftJoinAndSelect('report.history', 'history')
      .leftJoinAndSelect('history.changed_by', 'changed_by')
      .where('report.id = :id', { id })
      .orderBy('history.changed_at', 'DESC')
      .getOne();
  }

  async getPendingByOrganization(
    organizationId: string,
    limit = 5,
  ): Promise<ReportSubmission[]> {
    return this.reportRepo.find({
      where: {
        organization_id: organizationId,
        status: 'pending',
      },
      relations: ['submitted_by'],
      order: { submitted_at: 'DESC' },
      take: limit,
    });
  }

  async getUpcomingDeadlines(days = 3): Promise<ReportSubmission[]> {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);

    return this.reportRepo.find({
      where: {
        deadline: Between(start, end),
        status: 'pending',
      },
      relations: ['organization', 'assigned_inspector'],
    });
  }

  async getStatistics(filters?: {
    organization_id?: string;
    inspector_id?: string;
    start_date?: Date;
    end_date?: Date;
  }): Promise<{
    total: number;
    by_status: Record<string, number>;
    late_count: number;
    avg_review_time: number;
  }> {
    let query = this.reportRepo.createQueryBuilder('report').where('1=1');

    if (filters?.organization_id) {
      query = query.andWhere('report.organization_id = :orgId', {
        orgId: filters.organization_id,
      });
    }

    if (filters?.inspector_id) {
      query = query.andWhere('report.assigned_inspector_id = :inspId', {
        inspId: filters.inspector_id,
      });
    }

    if (filters?.start_date && filters?.end_date) {
      query = query.andWhere('report.submitted_at BETWEEN :start AND :end', {
        start: filters.start_date,
        end: filters.end_date,
      });
    }

    const reports = await query.getMany();

    return {
      total: reports.length,
      by_status: {
        pending: reports.filter((r) => r.status === 'pending').length,
        approved: reports.filter((r) => r.status === 'approved').length,
        rejected: reports.filter((r) => r.status === 'rejected').length,
        revision_needed: reports.filter((r) => r.status === 'revision_needed')
          .length,
      },
      late_count: reports.filter((r) => r.is_late).length,
      avg_review_time: this.calculateAvgReviewTime(reports),
    };
  }

  private calculateAvgReviewTime(reports: ReportSubmission[]): number {
    const reviewed = reports.filter((r) => r.reviewed_at && r.submitted_at);
    if (!reviewed.length) return 0;

    const totalMs = reviewed.reduce((sum, r) => {
      const reviewedAt = new Date(r.reviewed_at).getTime();
      const submittedAt = new Date(r.submitted_at).getTime();
      return sum + (reviewedAt - submittedAt);
    }, 0);

    return totalMs / reviewed.length / (1000 * 60 * 60);
  }

  private async addHistory(
    reportId: string,
    userId: string,
    action: string,
    comment?: string,
  ) {
    const history = this.historyRepo.create({
      report_id: reportId,
      changed_by_id: userId,
      action,
      comment,
      changed_at: new Date(),
    });

    await this.historyRepo.save(history);
  }
}
