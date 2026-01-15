import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { User } from './core/entity/user.entity';
import { DataSource } from 'typeorm';
import { UserRole, UserStatus } from './common/enum';

async function createAdmin() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);

  // Admin ma'lumotlarini kiriting
  // Adminlar ro'yxati
  const admins = [
    {
      telegram_id: '6368348552',
      first_name: 'Zufarbek',
      last_name: 'Bobojonov',
      phone_number: '+998977771053',
      department: 'Boshqaruv',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
    },
    {
      telegram_id: '333313489',
      first_name: 'Murodjon',
      last_name: 'Tolipov',
      phone_number: '+998901234567',
      department: 'Boshqaruv',
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
    },
  ];

  for (const adminData of admins) {
    const existing = await userRepo.findOne({
      where: { telegram_id: adminData.telegram_id },
    });

    if (existing) {
      await userRepo.save({
        ...existing,
        first_name: adminData.first_name,
        last_name: adminData.last_name,
        phone_number: adminData.phone_number,
        department: adminData.department,
        role: adminData.role,
        status: adminData.status,
      });
      console.log(`Admin yangilandi: ${adminData.first_name} ${adminData.last_name}`);
    } else {
      const admin = userRepo.create(adminData);
      await userRepo.save(admin);
      console.log(`Admin yaratildi: ${adminData.first_name} ${adminData.last_name}`);
    }
  }

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error('Xatolik:', err);
  process.exit(1);
});
