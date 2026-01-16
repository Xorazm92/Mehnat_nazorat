import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { Department } from './core/entity/departments.entity';
import { DataSource } from 'typeorm';

async function resetDepartments() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const departmentRepo = dataSource.getRepository(Department);

  console.log('Deleting all departments...');
  // Delete all departments. We might need to handle foreign key constraints if any (child_departments)
  // Since we have self-referencing relation, we might need to delete children first or cascade.
  // Using query builder or simple delete if cascade is set.
  // Safest is to delete everything.
  await departmentRepo.query('DELETE FROM department');
  // Depending on DB (sqlite/pg), DELETE FROM table usually works.
  // If Cascade OnDelete is not set, we might need manual order.
  // But given standard setup, let's try direct delete.

  console.log('All departments deleted.');

  const departments = [
    { name: 'Mehnat muhofazasi', children: [] },
    { name: 'Sanoat xavfsizligi', children: [] },
  ];

  for (const dep of departments) {
    const newDep = departmentRepo.create({
      department_name: dep.name,
      is_active: true,
      parent_name: null,
      parent_department: null,
    });
    await departmentRepo.save(newDep);
    console.log(`Created: ${dep.name}`);
  }

  console.log('Departments reset successfully!');
  await app.close();
  process.exit(0);
}

resetDepartments().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
