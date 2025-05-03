import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { BaseRpcExceptionFilter, RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

@Catch()
export class HttpToRpcExceptionFilter extends BaseRpcExceptionFilter {
    private readonly logger = new Logger(HttpToRpcExceptionFilter.name);
    catch(exception: any, host: ArgumentsHost): Observable<any> {

        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            const message = typeof response === 'string' ? response : (response as any)?.message || "Internal Server Error";
            const code = typeof response === "object" ? (response as any)?.code : undefined;

            const rpcError = {
                status: status,
                message: message,
                code: code,
            };
            return throwError(() => new RpcException(rpcError));

        } else if (exception instanceof RpcException) {
            return throwError(() => exception);
        } else {
            this.logger.error("Caught non-HTTP, non-RPC exception in filter:", exception); // Log the original error
            const rpcError = {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
            };
            return throwError(() => new RpcException(rpcError));
        }

    }
}
