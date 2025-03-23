import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RBAC } from 'src/common/decorator/rabc.decorator';
import { Role } from 'src/common/entities/user.entity';
import { FindAllProductDto } from './dto/find-all-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @RBAC(Role.admin)
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    findAll(@Body() dto: FindAllProductDto) {
        return this.productService.findAll(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    @Patch(':id')
    @RBAC(Role.admin)
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @RBAC(Role.admin)
    remove(@Param('id') id: string) {
        return this.productService.remove(+id);
    }
}
