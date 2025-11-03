# Repro
1. Copy `.env.sample` to `.env` and fill it out.
2. Open dev container.
3. Once it's done loading, run `pnpm sst deploy`, it should deploy to your AWS account (initial deployment takes >5 minutes). When it's done it will output the URL, use the router URL. You can navigate to the client page and click the trigger error button.
    ```bash
    ✓  Complete    
    client: https://xxxxxx.cloudfront.net
    router: https://xxxxxx.cloudfront.net <- this one
    api: https://xxxxxx.execute-api.us-east-1.amazonaws.com
    ```
4. When finished, `pnpm sst remove` destroys the deployment.