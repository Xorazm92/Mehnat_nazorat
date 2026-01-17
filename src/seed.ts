import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { Department } from './core/entity/departments.entity';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const departmentRepo = dataSource.getRepository(Department);

  const departments = [
    { name: 'Mehnat muhofazasi', children: [] },
    { name: 'Sanoat xavfsizligi', children: [] },
  ];

  for (const dep of departments) {
    let existing = await departmentRepo.findOne({
      where: { department_name: dep.name },
    });
    if (!existing) {
      existing = departmentRepo.create({
        department_name: dep.name,
        is_active: true,
        parent_name: null,
        parent_department: null,
      });
      await departmentRepo.save(existing);
      console.log(`Created: ${dep.name}`);
    }

    if (dep.children) {
      for (const childName of dep.children) {
        let child = await departmentRepo.findOne({
          where: { department_name: childName },
        });
        if (!child) {
          child = departmentRepo.create({
            department_name: childName,
            is_active: true,
            parent_name: dep.name,
            parent_department: existing,
          });
          await departmentRepo.save(child);
          console.log(`Created child: ${childName} for ${dep.name}`);
        }
      }
    }
  }

  console.log('Departments seeded successfully!');
  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
