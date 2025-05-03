import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';

export class PaginatedResponseDto<TData> {
    @ApiProperty()
    readonly data: TData[];

    @ApiProperty({
        type: () => PageMetaDto,
        description: 'Metadata about the pagination.',
    })
    readonly meta: PageMetaDto;

    constructor(data: TData[], meta: PageMetaDto) {
        this.data = data;
        this.meta = meta;
    }
}
