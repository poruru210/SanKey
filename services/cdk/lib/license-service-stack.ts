import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class LicenseServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SSM からマスターキーを取得
    const keyParam = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MasterKeyParam', {
      parameterName: '/license-service/master-key',
      version: 1,
    });

    // Lambda 関数定義
    const lambdaFn = new NodejsFunction(this, 'LicenseGeneratorFunction', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, '../../lambda/src/handlers/licenseGenerator.handler.ts'),
      handler: 'handler',
      environment: {
        MASTER_KEY_PARAM: keyParam.parameterName,
      },
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
    });
    keyParam.grantRead(lambdaFn);

    // REST API に切り替え
    const api = new apigw.RestApi(this, 'LicenseApi', {
      restApiName: 'LicenseServiceApi',
      defaultMethodOptions: { apiKeyRequired: true },
      defaultCorsPreflightOptions: { allowOrigins: apigw.Cors.ALL_ORIGINS },
      deployOptions: { stageName: 'prod' },
    });

    // /generate リソース＆POST メソッド
    const generate = api.root.addResource('generate');
    generate.addMethod('POST', new apigw.LambdaIntegration(lambdaFn));

    // API Key の作成（apiKeyName が正しいプロパティ名）
    const apiKey = api.addApiKey('LicenseApiKey', {
      apiKeyName: 'LicenseServiceKey',
      description: 'API Key for License Service'
    });

    // Usage Plan の作成
    const plan = api.addUsagePlan('BasicUsagePlan', {
      name: 'Basic',
      description: 'Basic usage plan',
      throttle: { rateLimit: 100, burstLimit: 50 },
      quota: { limit: 1000, period: apigw.Period.DAY },
    });
    // Usage Plan に API Key を紐付け
    plan.addApiKey(apiKey);
    // ステージを Usage Plan に紐付け
    plan.addApiStage({ stage: api.deploymentStage });

    // エンドポイント出力
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url ?? '',
      description: 'License issuance API endpoint',
    });
  }
}
