import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import dynamodb from "aws-cdk-lib/aws-dynamodb";
import sqs from "aws-cdk-lib/aws-sqs";
import cognito, { UserPool } from "aws-cdk-lib/aws-cognito";
import {
  BundlingOptions,
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { HttpUserPoolAuthorizer } from "@aws-cdk/aws-apigatewayv2-authorizers-alpha";
import * as path from "path";
import { findHandlers } from "./utils/handlers.js";
import { PK, SK, TableName } from "../src/db/client.js";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

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

    // // A queue for deletion requests. Delete operations, especially deleting an
    // // entire account, can be hard to do. It might not get done in a single
    // // execution of a Lambda, so we'll put it in a queue until the deletion
    // // completes. Each lambda can execute at most up to 15 minutes, so if the
    // // deletion is still not complete after that, the lambda will timeout and
    // // the queue will launch a new one.
    // const deleteQueueProcessTimeout = 15;
    // const deleteQueue = new sqs.Queue(this, "Queue", {
    //   // order is unimportant, we're just gonna delete everything
    //   fifo: false,
    //   // max allowed, keep everything in the queue until we finish them
    //   retentionPeriod: Duration.days(14),
    //   // after the lambda times out, launch another one.
    //   visibilityTimeout: Duration.minutes(deleteQueueProcessTimeout + 1),
    // });
    // const deleteHandler = new LiquidBudgetingHandler(this, "DeleteHandler", {
    //   entry: "<TODO>",
    //   timeout: Duration.minutes(deleteQueueProcessTimeout),
    // });
    // deleteHandler.addEventSource(new SqsEventSource(deleteQueue, {}));

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
