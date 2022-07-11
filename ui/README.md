## Getting Started

Deploy your test environment to AWS. See the readme at the project root.

Then, create a file `.env.local` here, in the `ui` directory.
Place the following inside this file, filling the values based on the values from your AWS console:

```bash
# go to cognito, find you app integration, copy the link for "View Hosted UI", paste it here. Replace response_type=code with response_type=token
NEXT_PUBLIC_LOGIN_URL='https://<...>.amazoncognito.com/<...>&response_type=token&scope=<...>'
# go to API Gateway, find your API, get the "invoke URL" and paste it below
NEXT_PUBLIC_API_URL='https://<...>.execute-api.<...>.amazonaws.com'
```

Now, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
You should be able to log in and use things now.
