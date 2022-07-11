import fs from "fs";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import dynamodb from "aws-cdk-lib/aws-dynamodb";
import cognito, { UserPool } from "aws-cdk-lib/aws-cognito";
import {
  BundlingOptions,
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { HttpApi, HttpStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import * as path from "path";
import { findHandlers } from "./utils/handlers.js";
import { PK, SK, TableName } from "../src/db/client.js";

export class LiquidBudgetingHandler extends NodejsFunction {
  constructor(scope: Construct, id: string, props?: NodejsFunctionProps) {
    const bundling: BundlingOptions = {
      minify: true,
      target: "es2020",
      tsconfig: "tsconfig.json",
      // Can't enable tree shaking because it breaks the build. Maybe try
      // writing a custom build script for this instead?
    };

    super(scope, id, {
      runtime: Runtime.NODEJS_16_X,
      architecture: Architecture.ARM_64,
      handler: "handler",
      bundling: {
        ...bundling,
        ...props?.bundling,
      },
      ...props,
    });
  }
}

export class LiquidBudgetingStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The primary mapping for the table.
    //
    // PK for the whole table is user ID.
    //
    // There are several entities stored in the table.
    // - Users: USER#<user-id> -- name, email, and other user-specific information.
    // - Budgets: BUDGET#<budget-id> -- name, max. These are templates for the actual budgets.
    // - Monthly budgets: MONTH#<yyyy>.<mm>#BUDGET#<budget-id> -- name, max, usage total. These are the instantiated versions of the monthly budgets.
    // - Spending items: ITEMMONTH#<yyyy>.<mm>#BUDGET#<budget-id>#ITEM#<item-id> -- name, amount, date, notes. These are the individual spending items within monthly budgets.
    //
    const table = new dynamodb.Table(this, TableName, {
      tableName: TableName,
      partitionKey: { name: PK, type: dynamodb.AttributeType.STRING },
      sortKey: { name: SK, type: dynamodb.AttributeType.STRING },
    });

    const userPool = new UserPool(this, "LiquidUsers", {
      // TODO: This will need to be enabled to allow people to sign up
      selfSignUpEnabled: false,
      userVerification: {
        emailSubject: "Verify your email for Liquid Budgeting",
        emailBody:
          "Welcome to Liquid Budgeting. Your verification code is {####}",
      },
      signInAliases: {
        email: true,
        username: true,
        preferredUsername: true,
      },
      mfa: cognito.Mfa.OPTIONAL,
      mfaSecondFactor: {
        otp: true,
        sms: false,
      },
    });
    userPool.addClient("LiquidBudgeting", {
      oAuth: {
        callbackUrls: [
          // TODO: should only allow this for local development
          "http://localhost:3000/auth/login_callback",
        ],
        flows: {
          authorizationCodeGrant: true,
          implicitCodeGrant: true,
        },
      },
      authFlows: {
        userPassword: true,
      },
    });
    userPool.addDomain("CognitoDomain", {
      cognitoDomain: {
        // TODO: For actual development use a real domain
        domainPrefix: "liquidbudgetingtest",
      },
    });

    const authorizer = new HttpUserPoolAuthorizer("Authorizer", userPool);

    // Create the API that all handlers will be attached to
    const api = new HttpApi(this, "budget-api", {
      defaultAuthorizer: authorizer,
      corsPreflight: {
        allowOrigins: [
          // TODO: only during development
          "http://localhost:3000",
        ],
      },
    });

    // For every TS file in the handlers dir, create a handler
    const handlersDir = path.join(process.cwd(), "src", "handlers");
    findHandlers(handlersDir).forEach((handlerOptions) => {
      const name = path.relative(handlersDir, handlerOptions.entryPoint);
      const handler = new LiquidBudgetingHandler(this, `${name}-handler`, {
        entry: handlerOptions.entryPoint,
      });
      table.grantReadWriteData(handler);

      // Each handler needs an integration
      const integration = new HttpLambdaIntegration(
        `${name}-integration`,
        handler,
      );
      // Finally, use the integration to connect the handler to the API
      api.addRoutes({
        path: handlerOptions.route,
        methods: [handlerOptions.action],
        integration,
      });
    });
  }
}
