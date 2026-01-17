import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReportingSystem1737110000000 implements MigrationInterface {
  name = 'AddReportingSystem1737110000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(50) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        short_name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        responsible_person_id UUID,
        assigned_inspector_id UUID,
        is_active BOOLEAN DEFAULT TRUE,
        metadata JSONB,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (responsible_person_id) REFERENCES users(id),
        FOREIGN KEY (assigned_inspector_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS report_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        report_type VARCHAR(50) NOT NULL,
        organization_id UUID NOT NULL,
        submitted_by_id UUID NOT NULL,
        assigned_inspector_id UUID,
        status VARCHAR(50) DEFAULT 'pending',
        files TEXT[],
        file_metadata JSONB,
        parsed_data JSONB,
        deadline TIMESTAMP,
        submitted_at TIMESTAMP,
        reviewed_at TIMESTAMP,
        approved_at TIMESTAMP,
        reviewer_comment TEXT,
        rejection_reason TEXT,
        reviewed_by_id UUID,
        is_late BOOLEAN DEFAULT FALSE,
        revision_count INTEGER DEFAULT 0,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        FOREIGN KEY (submitted_by_id) REFERENCES users(id),
        FOREIGN KEY (assigned_inspector_id) REFERENCES users(id),
        FOREIGN KEY (reviewed_by_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS report_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        report_id UUID NOT NULL,
        changed_by_id UUID NOT NULL,
        action VARCHAR(100) NOT NULL,
        comment TEXT,
        changed_at TIMESTAMP NOT NULL,
        metadata JSONB,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (report_id) REFERENCES report_submissions(id),
        FOREIGN KEY (changed_by_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS deadlines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(50) NOT NULL,
        organization_id UUID,
        assigned_to_id UUID,
        due_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        reminder_days JSONB DEFAULT '[7,3,1]',
        reminders_sent JSONB DEFAULT '[]',
        created_by_id UUID NOT NULL,
        completed_at TIMESTAMP,
        metadata JSONB,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        FOREIGN KEY (assigned_to_id) REFERENCES users(id),
        FOREIGN KEY (created_by_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS inspections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        organization_id UUID NOT NULL,
        inspector_id UUID NOT NULL,
        inspection_date DATE NOT NULL,
        inspection_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'scheduled',
        findings TEXT,
        violations JSONB,
        recommendations TEXT,
        photos TEXT[],
        documents TEXT[],
        score INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        metadata JSONB,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        FOREIGN KEY (inspector_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        category VARCHAR(50) NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        action_data JSONB,
        sent_at TIMESTAMP NOT NULL,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS file_archive (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        file_id VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size BIGINT NOT NULL,
        mime_type VARCHAR(255),
        uploaded_by_id UUID NOT NULL,
        organization_id UUID,
        category VARCHAR(50) NOT NULL,
        tags TEXT[],
        description TEXT,
        uploaded_at TIMESTAMP NOT NULL,
        search_vector TSVECTOR,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (uploaded_by_id) REFERENCES users(id),
        FOREIGN KEY (organization_id) REFERENCES organizations(id)
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reports_org ON report_submissions(organization_id)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reports_status ON report_submissions(status)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_reports_deadline ON report_submissions(deadline)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_deadlines_due ON deadlines(due_date)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_deadlines_status ON deadlines(status)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS file_archive CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS notifications CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS inspections CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS report_history CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS report_submissions CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS deadlines CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS organizations CASCADE`);
  }
}
