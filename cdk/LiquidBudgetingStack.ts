import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime, Architecture } from "aws-cdk-lib/aws-lambda";
import {
  BundlingOptions,
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { HttpApi, HttpStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import * as path from "path";
import { findHandlers } from "./utils/handlers";

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

    // Create the API that all handlers will be attached to
    const api = new HttpApi(this, "budget-api", {
      description: "Handles all budget related APIs.",
    });

    // For every TS file in the handlers dir, create a handler
    const handlersDir = path.join(__dirname, "..", "src", "handlers");
    findHandlers(handlersDir).forEach((handlerOptions) => {
      const name = path.relative(handlersDir, handlerOptions.entryPoint);
      const handler = new LiquidBudgetingHandler(this, `${name}-handler`, {
        entry: handlerOptions.entryPoint,
      });
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

    // Deploy this API as a stage
    new HttpStage(this, "Stage", {
      httpApi: api,
      stageName: "test",
    });
  }
}
