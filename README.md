# Repro
1. Copy `.env.sample` to `.env` and fill it out.
2. Open dev container.
3. Once it's done loading, run `pnpm sst deploy`, it should deploy to your AWS account. When it's done it will output the URL, you can navigate to the client page and click the trigger error button.
    ```
    ✓  Complete    
    client: https://xxxxxx.cloudfront.net
    api: https://xxxxxx.execute-api.us-east-1.amazonaws.com
    ```