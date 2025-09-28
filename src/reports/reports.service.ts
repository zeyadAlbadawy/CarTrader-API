import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

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

  createEstimate(estimateDto: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make: estimateDto.make })
      .andWhere('model = :model', { model: estimateDto.model })
      .andWhere('(lng - :lng) BETWEEN -5 AND 5', { lng: estimateDto.lng })
      .andWhere('(lat - :lat) BETWEEN -5 AND 5', { lat: estimateDto.lat })
      .andWhere('(year - :year) BETWEEN -3 AND 3', { year: estimateDto.year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: estimateDto.mileage })
      .limit(3)
      .getRawOne();
  }
}
