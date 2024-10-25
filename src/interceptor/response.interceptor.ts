import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //before the request is handled by the route handler
    return next.handle().pipe(
      //after the request is handled by the route handler
      map((data) => ({
        message: 'success',
        data,
      })),
    );
  }
}
