import { Module } from '@nestjs/common';
import { OrganizationModule } from './modules/organization.module';
import { PlanModule } from './modules/plan.module';
import { ComplianceModule } from './modules/compliance.module';
import { InventoryModule } from './modules/inventory.module';
import { TaskModule } from './modules/task.module';
import { SalaryModule } from './modules/salary.module';
import { CommunicationModule } from './modules/communication.module';
import { UserModule } from './modules/user.module';

/**
 * CoreModule - Barcha domain modullarini birlashtiradi
 *
 * Domain modullari:
 * - OrganizationModule: Tashkilotlar, qo'llanuvchilar, mas'ullar
 * - PlanModule: Yillik/oylik rejalar va reja punktlari
 * - ComplianceModule: Normativ talablar va tekshiruvlar
 * - InventoryModule: Inventar va berish loglari
 * - TaskModule: Vazifalar va hisobotlar
 * - SalaryModule: Maoshlar va statistika
 * - CommunicationModule: Xabarlar, murojaatlar, kampaniyalar
 * - UserModule: Foydalanuvchilar va bo'limlar
 */
@Module({
  imports: [
    OrganizationModule,
    PlanModule,
    ComplianceModule,
    InventoryModule,
    TaskModule,
    SalaryModule,
    CommunicationModule,
    UserModule,
  ],
  exports: [
    OrganizationModule,
    PlanModule,
    ComplianceModule,
    InventoryModule,
    TaskModule,
    SalaryModule,
    CommunicationModule,
    UserModule,
  ],
})
export class CoreModule {}
