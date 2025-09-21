import { IsBoolean, IsOptional } from 'class-validator';

export class ApproveReportDto {
  @IsBoolean()
  approved: boolean;
}
