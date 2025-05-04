import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100; // Prevent excessively large requests

export class PaginationQueryDto {
    @ApiPropertyOptional()
    @Min(1)
    @IsInt()
    page: number = DEFAULT_PAGE;

    @ApiPropertyOptional()
    @Max(MAX_LIMIT)
    @IsInt()
    limit: number = DEFAULT_LIMIT;

    // Getter to calculate skip easily
    get skip(): number {
        return (
            ((this.page ?? DEFAULT_PAGE) - 1) * (this.limit ?? DEFAULT_LIMIT)
        );
    }
}
