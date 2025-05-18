import { APIGatewayProxyHandler } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { getMasterKey } from '../utils/parameterStore';
import { encryptLicense } from '../services/encryption';
import { LicensePayload } from '../models/licensePayload';

const logger = new Logger();

export const handler: APIGatewayProxyHandler = async (event) => {
  logger.info('Received license request', { event });
  const { eaName, accountId, expiry } = JSON.parse(event.body!);
  const masterKey = await getMasterKey();
  const payload: LicensePayload = { eaName, accountId, expiry };
  const license = await encryptLicense(masterKey, JSON.stringify(payload), accountId);
  return { statusCode: 200, body: JSON.stringify({ license }) };
};
