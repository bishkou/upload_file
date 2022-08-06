import { Request } from 'express';

// Array of allowed files
const array_of_allowed_files: Array<string> = [
  'png',
  'jpeg',
  'jpg',
  'gif',
  'pdf',
];
const array_of_allowed_file_types: Array<string> = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'application/pdf',
];
const array_of_allowed_content_types: Array<string> = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'application/pdf',
];

export const fileValidation = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  // Get the extension of the uploaded file
  const file_extension = file.originalname.slice(
    ((file.originalname.lastIndexOf('.') - 1) >>> 0) + 2,
  );
  // Check allowed file size in mb else Check if the uploaded file is allowed
  if (
    !array_of_allowed_files.includes(file_extension) ||
    !array_of_allowed_file_types.includes(file.mimetype) ||
    !array_of_allowed_content_types.includes(req.headers['content-type'])
  ) {
    req.body.fileValidationError =
      'Invalid extension, mimetype or content-type';
    callback(null, false);
  }

  callback(null, true);
};
