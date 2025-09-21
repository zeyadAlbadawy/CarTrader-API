import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  mileage: number;

  @Expose()
  model: string;

  @Expose()
  approved: boolean;

  // This means for the current report entity pull out an instance and take the user.id
  // And Assign it into userId, this is the following lines do
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
