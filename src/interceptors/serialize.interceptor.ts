import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';
import { UserDto } from 'src/dtos/user.dto';

interface classConstructor {
  new (...args: any[]): {};
}
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: classConstructor) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // console.log(`I'm Running before the handler is called`, context);
    return next.handle().pipe(
      map((data: any) => {
        // console.log('Runnig before the respone is sent to the client!', data);
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
