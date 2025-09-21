import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { UserAuthGuard } from 'src/guards/user-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportInterceptor } from './interceptors/report.interceptor';
import { ReportDto } from './dtos/reponse.report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  @UseInterceptors(new ReportInterceptor(ReportDto))
  createNewReport(
    @Body() body: CreateReportDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.reportService.createReport(body, currentUser);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  async updateReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return await this.reportService.updateReportStats(+id, body);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    console.log(query);
  }
}
