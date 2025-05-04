import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
    @ApiProperty()
    readonly totalItems: number;

    @ApiProperty()
    readonly itemCount: number;

    @ApiProperty()
    readonly itemsPerPage: number;

    @ApiProperty()
    readonly totalPages: number;

    @ApiProperty()
    readonly currentPage: number;

    constructor(
        totalItems: number,
        itemCount: number,
        itemsPerPage: number,
        currentPage: number,
    ) {
        this.totalItems = totalItems;
        this.itemCount = itemCount;
        this.itemsPerPage = itemsPerPage;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.currentPage = currentPage;
    }
}
