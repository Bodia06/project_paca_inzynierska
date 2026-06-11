const {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const path = require('path');
const fs = require('fs');

const s3 = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT_URL || 'http://minio:9000',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.MINIO_SECRET_KEY || 'minioadminpassword',
  },
  forcePathStyle: true,
  region: 'us-east-1',
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'my-bucket';

const seedDefaultFiles = async () => {
  const defaultImages = [
    { filename: 'default-language.png', subFolder: 'info', mime: 'image/png' },
  ];

  for (const img of defaultImages) {
    const fileKey = `${img.subFolder}/${img.filename}`;

    try {
      await s3.send(
        new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: fileKey })
      );
    } catch (error) {
      if (
        error.name === 'NotFound' ||
        error.$metadata?.httpStatusCode === 404
      ) {
        const localPath = path.join('/app', 'static-seeds', img.filename);

        if (fs.existsSync(localPath)) {
          const fileBuffer = fs.readFileSync(localPath);

          await s3.send(
            new PutObjectCommand({
              Bucket: BUCKET_NAME,
              Key: fileKey,
              Body: fileBuffer,
              ContentType: img.mime,
            })
          );
        }
      }
    }
  }
};

const initMinio = async () => {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    await seedDefaultFiles();
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      await s3.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));

      const publicReadPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      };

      await s3.send(
        new PutBucketPolicyCommand({
          Bucket: BUCKET_NAME,
          Policy: JSON.stringify(publicReadPolicy),
        })
      );

      await seedDefaultFiles();
    } else {
      console.error(
        '[MinIO]: Error occurred during storage client initialization:',
        error
      );
    }
  }
};

const uploadFile = async (file, subFolder = 'general') => {
  if (!file) throw new Error('No file provided for upload');

  const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const extension = path.extname(file.originalname);

  const filename = `${uniquePrefix}${extension}`;
  const fileKey = `${subFolder}/${filename}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));
  return filename;
};

const deleteFile = async (filename, subFolder = 'general') => {
  try {
    if (
      !filename ||
      filename === 'anon.png' ||
      filename === 'anon.jpg' ||
      filename === 'default-language.png'
    )
      return;

    const fileKey = `${subFolder}/${filename}`;

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
      })
    );
  } catch (err) {
    console.error(
      `[MinIO]: Failed to delete file from MinIO: ${filename}`,
      err
    );
  }
};

initMinio();

module.exports = {
  uploadFile,
  deleteFile,
};
