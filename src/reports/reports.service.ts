import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  createReport(reportBody: CreateReportDto, currentUser: User) {
    const report = this.repo.create(reportBody);
    report.user = currentUser;
    return this.repo.save(report);
  }

  async updateReportStats(id: number, attrs: Partial<Report>) {
    if (!id) return null;
    const foundedReport = await this.repo.findOneBy({ id });
    if (!foundedReport)
      throw new NotFoundException(`Report with id of ${id} not found`);
    Object.assign(foundedReport, attrs);
    return this.repo.save(foundedReport);
  }
}
