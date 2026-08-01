import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';

const MIME_TIPOS_PERMITIDOS = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const EXT_IMAGEM = /\.(jpe?g|png|webp|gif)$/i;

export const imagemUploadOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const mime = (file.mimetype || '').toLowerCase();
    const nome = file.originalname || '';

    if (MIME_TIPOS_PERMITIDOS.has(mime)) {
      return callback(null, true);
    }

    if (EXT_IMAGEM.test(nome)) {
      return callback(null, true);
    }

    return callback(
      new BadRequestException('Formato de imagem inválido. Use JPEG, PNG, WebP ou GIF.'),
      false,
    );
  },
};
