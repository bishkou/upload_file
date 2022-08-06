
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Environment Variables

Create a .env file in the root of the project and add the following variables to it:
```bash
AWS_S3_BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
MAX_SIZE=

```

## '/fileupload'

if you are passing an image and want to resize it you must pass
('large', 'medium' or 'thumb') in a property called size

# 'NOTES'

The service is not taking care of the RAM issue, I wanted to use streams and send the file by chunks but unfortunately
I could not find anything that works well with Nestjs, as Nestjs uses FileInterceptor() to intercept the file,
I couldn't find a work around to upload a file without using fileinterceptor, I also thought about using Express instead of nestjs,
but again I could not find anything suitable to this as all I can find online is for uploading local files using streams.

Although I wanted to mention that I am fully aware of the problem, as the problem with loading a large file into memory
is that you can actually run out of memory and cause your application to crash.
That why the beauty of streams is they help you work around this memory problem by acting on chunks of data hence allowing
you to minimize your memory footprint.

The second issue was trying to send the file without multipart/form-data, again Nestjs uses Fileinterceptor and it only accepts multipart/form-data,
otherwise the file will be ignored, I used insomnia to send the data, but it could only be sent with multipart/form-data.
but anyways I put the validation to not accept specified content-types, so if you dont want multipart/form-data,
if won't be accepted only if you add it to 'array_of_allowed_content_types' Array in file.validation.ts

Otherwise I think the rest works fine, the maximum file size is defined in .env along with AWS credentials.

Thank you.

