import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
    @UseInterceptors(FilesInterceptor('files', 10,{
      storage: diskStorage({
        destination: './uploads', // Directory where files will be saved
        filename: (req, file, callback) => {
          const uniqueSuffix:any = new Date();
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix.toISOString()}${ext}`;
          callback(null, filename);
        },
      }),
    }))
 async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
  try {
    console.log("======= files =======\n", files);
    const response =await files?.map(file => ({
      originalname: file.originalname,
      filename: file.filename,
      path: `/uploads/${file.filename}`,
    }));
    console.log("======= response =======\n", response);

    return {
      statusCode:201,
      data:response,
      message:"upload image successfully"
    };
  } catch (error) {
  console.log("======= error =======\n", error);
    
  }
  }


  @Get()
  findAll() {
    return this.uploadsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadsService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadsService.remove(+id);
  }
}
