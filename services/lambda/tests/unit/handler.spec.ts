import { handler } from '../../src/handlers/licenseGenerator.handler';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getMasterKey } from '../../src/utils/parameterStore';
import { webcrypto } from 'crypto';

jest.mock('../../src/utils/parameterStore');

describe('handler', () => {
  it('should return statusCode 200 and a license', async () => {
    const keyData = Buffer.alloc(32, 2);
    const key = await webcrypto.subtle.importKey('raw', keyData, 'AES-CBC', true, ['encrypt']);
    (getMasterKey as jest.Mock).mockResolvedValue(key);

    const event = {
      body: JSON.stringify({ eaName: 'TestEA', accountId: '1234', expiry: '2025-12-31T23:59:59Z' })
    } as APIGatewayProxyEvent;

    const response = (await handler(event, {} as any, {} as any)) as any;
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(typeof body.license).toBe('string');
    expect(Buffer.from(body.license, 'base64').length).toBeGreaterThan(12 + 16);
  });
});
