import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { OrganizationService } from './core/services/organization.service';
import { ComplianceService } from './core/services/compliance.service';
import { InventoryService } from './core/services/inventory.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const organizationService = app.get(OrganizationService);
  const complianceService = app.get(ComplianceService);
  const inventoryService = app.get(InventoryService);

  console.log("🌱 Seed ma'lumotlarini qo'shishni boshlayaman...");

  // Create organizations
  console.log('📍 Tashkilotlar yaratilmoqda...');
  const qoqunMtu = await organizationService.createOrganization({
    name: "Qo'qon MTU filiali",
    code: 'QOQUN_MTU',
    description: "Qo'qon temir yo'l sanoat xavfsizligi inspeksiyasi",
    address: "Qo'qon sh., Farg'ona viloyati",
    phone: '+998902223344',
    email: 'admin@qoqun-mtu.uz',
    status: 'ACTIVE',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _temiryo = await organizationService.createOrganization({
    name: "Temiryo'l Kargo",
    code: 'TEMIR_KARGO',
    description: "Temiryo'l Kargo korxonasi",
    address: 'Tashkent',
    phone: '+998901234567',
    email: 'admin@temirkargo.uz',
    status: 'ACTIVE',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _o_zvagonta = await organizationService.createOrganization({
    name: "O'zvagonta'mir",
    code: "OZVAGONTA'MIR",
    description: "O'zvagonta'mir korxonasi",
    address: 'Tashkent',
    status: 'ACTIVE',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _emtb = await organizationService.createOrganization({
    name: 'EMTB',
    code: 'EMTB',
    description: 'EMTB korxonasi',
    address: 'Tashkent',
    status: 'ACTIVE',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _amz = await organizationService.createOrganization({
    name: 'AMZ',
    code: 'AMZ',
    description: 'AMZ korxonasi',
    address: 'Tashkent',
    status: 'ACTIVE',
  });

  // Create facilities for Qo'qon MTU
  console.log("🏭 Qo'llanuvchilar yaratilmoqda...");
  const facility1 = await organizationService.createFacility({
    name: "Qo'qon Markaziy Sahnasi",
    code: 'QMS-001',
    organization_id: qoqunMtu.id,
    division: "Operatsiya bo'limi",
    location: "Qo'qon markaziy stansiya",
    status: 'ACTIVE',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _facility2 = await organizationService.createFacility({
    name: "Qo'qon Elektr Sahnasi",
    code: 'QES-001',
    organization_id: qoqunMtu.id,
    division: 'Elektr xizmati',
    location: "Qo'qon elektr birligi",
    status: 'ACTIVE',
  });

  // Create responsibility matrices (responsible officers)
  console.log("👥 Mas'ullar tayinlanmoqda...");

  // Bobojonov Z.K - Raqamlashtirish
  const bobojonov_id = '123456789'; // These would be real telegram IDs
  await organizationService.addResponsible({
    facility_id: facility1.id,
    user_id: bobojonov_id,
    role: 'DIGITALIZATION_OFFICER',
    scope: 'Raqamlashtirish ishlari',
    kpi: 'Oylik raqamlashtirish hisobotini topshirish, audit loglari',
    effective_from: new Date(),
    status: 'ACTIVE',
  });

  // Said-G'oziev X.S - Kuz-qish va hujjatlar
  const saidgoziev_id = '123456790';
  await organizationService.addResponsible({
    facility_id: facility1.id,
    user_id: saidgoziev_id,
    role: 'WINTER_PREP_OFFICER',
    scope: 'Kuz-qish tayyorgarligi, Hujjatlar aylanmasi',
    kpi: "Kuz-qish reja, Xodim ro'yxatlari, Masala-talabalar",
    effective_from: new Date(),
    status: 'ACTIVE',
  });

  // Djabaev Dj.R - Talon va maxsus kiyim
  const djabaev_id = '123456791';
  await organizationService.addResponsible({
    facility_id: facility1.id,
    user_id: djabaev_id,
    role: 'INVENTORY_OFFICER',
    scope: 'Talon tizimi, Maxsus kiyim boshqaruvi',
    kpi: 'Sоф talon eleneni, Kiyim inventari',
    effective_from: new Date(),
    status: 'ACTIVE',
  });

  // Seed compliance items
  console.log("✅ Normativ talablar qo'shilmoqda...");
  await complianceService.seedComplianceItems();

  // Seed inventory
  console.log("📦 Inventar qo'shilmoqda...");
  await inventoryService.seedInventory();

  console.log("✨ Seed ma'lumotlar muvaffaqiyatli qo'shildi!");
  await app.close();
}

bootstrap();
