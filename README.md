## How to Deploy

```bash
yarn install
yarn cdk bootstrap
yarn cdk synth # should output the infrastructure details
yarn cdk deploy
# to remove everything
yarn cdk destroy
```

## Folder Layout

- `cdk`
  - Contains the CDK definitions for the infrastructure.
  - `_main.ts` is the primary entry point, and any other files in the folder are
    for other stacks.
  - `test` contains tests for the cdk itself.
  - `utils` contains helper functions.
- `src`
  - Contains all the code that runs on AWS Lambda.
  - `handlers` contains the handlers that run on AWS Lambda. This folder is
    special: every file inside this folder is a route that will appear in the
    API. Each file must end with `.<ACTION>.ts`, where `<ACTION>` is a HTTP
    action like `GET` or `POST`. The path for the file relative to the
    `handlers` folder is the path for the endpoint.
  - All other files and folders are helpers for the handlers.
