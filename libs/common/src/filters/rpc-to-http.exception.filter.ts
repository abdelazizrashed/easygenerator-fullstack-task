import {
    ArgumentsHost,
    HttpStatus,
    Logger,
    ExceptionFilter,
    Catch,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(RpcToHttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const rpcError = exception.getError();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message =
            'An internal error occurred communicating with a downstream service.';

        if (typeof rpcError === 'object' && rpcError != null) {
            status =
                rpcError.error.status ||
                rpcError.status ||
                rpcError.statusCode ||
                status;
            message = rpcError.message || message;
        }

        switch (status) {
            case HttpStatus.CONFLICT: // 409
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Conflict',
                });
                break;
            case HttpStatus.BAD_REQUEST: // 400
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Bad Request',
                });
                break;
            case HttpStatus.NOT_FOUND: // 404
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Not Found',
                });
                break;
            case HttpStatus.UNAUTHORIZED: // 401
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Unauthorized',
                });
                break;
            case HttpStatus.FORBIDDEN: // 403
                response.status(status).json({
                    statusCode: status,
                    message: message,
                    error: 'Forbidden',
                });
                break;
            default:
                this.logger.error(
                    `Unmapped RPC status ${status} received: ${message}`,
                );
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message:
                        message || 'An internal processing error occurred.',
                    error: 'Internal Server Error',
                });
                break;
        }
    }
}
