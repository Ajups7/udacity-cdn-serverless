import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('fileAccess')
export class FileAccess {
  constructor(
    private readonly s3: AWS.S3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName: string = process.env.BUCKET_NAME,
    private readonly urlExpiration: number = parseInt(
      process.env.SIGNED_URL_EXPIRATION
    )
  ) {}

  async getUploadUrl(imageId: string): Promise<string> {
    logger.info(`Getting signed url`)

    const result = await this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.urlExpiration
    })

    return result
  }
}
