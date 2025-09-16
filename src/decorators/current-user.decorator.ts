import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// The Decorator cant access the userservice as it is a part of DI
// So The Interceptor will connect the decorator with the userService
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
