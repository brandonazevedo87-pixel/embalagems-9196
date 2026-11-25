import { S3Client } from '@aws-sdk/client-s3';
export function storage() {
  const { S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = process.env;
  if (!S3_ENDPOINT || !S3_BUCKET || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) throw new Error('Storage não configurado.');
  return { bucket:S3_BUCKET, s3:new S3Client({region:'auto',endpoint:S3_ENDPOINT,forcePathStyle:false,credentials:{accessKeyId:S3_ACCESS_KEY_ID,secretAccessKey:S3_SECRET_ACCESS_KEY}}) };
}
export function imageUrl(key:string) { return `https://${process.env.S3_BUCKET}.t3.tigrisfiles.io/${key}`; }
