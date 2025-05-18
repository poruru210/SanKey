#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LicenseServiceStack } from '../lib/license-service-stack';

const app = new cdk.App();
new LicenseServiceStack(app, 'LicenseServiceStack');
