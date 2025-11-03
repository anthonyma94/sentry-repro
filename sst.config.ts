/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sentry-repro",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { command: "1.1.3" },
    };
  },
  async run() {
    const router = new sst.aws.Router("router", {
      transform: {
        cachePolicy: {
          parametersInCacheKeyAndForwardedToOrigin: {
            cookiesConfig: {
              cookieBehavior: "all",
            },
            queryStringsConfig: {
              queryStringBehavior: "all",
            },
            headersConfig: {
              headerBehavior: "whitelist",
              headers: {
                items: [
                  "baggage",
                  "sentry-trace",
                ],
              },
            },
          },
        },
      }
    });
    const api = new sst.aws.ApiGatewayV2("api");
    const trpc = new sst.aws.Function("trpc", {
      handler: "apps/api/src/index.handler",
      nodejs: {
        sourcemap: true
      },
      environment: {
        SENTRY_DSN: process.env.SENTRY_DSN!,
        NODE_ENV: $dev ? "development" : "production"
      },
      hook: {
        postbuild: async (dir) => {
          await command.local.run({
            command: `
              VERSION=$(pnpm sentry-cli releases propose-version); \\
              pnpm sentry-cli releases new -p $SENTRY_PROJECT $VERSION && \\
              pnpm sentry-cli releases set-commits --auto --ignore-missing $VERSION && \\
              pnpm sentry-cli sourcemaps inject ${dir} && \\
              pnpm sentry-cli sourcemaps upload --release $VERSION ${dir} && \\
              find ${dir} -type f \\( -name "*.js.map" -or -name "*.mjs.map" \\) -delete`,
            environment: {
              SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN!,
              SENTRY_ORG: process.env.SENTRY_ORG!,
              SENTRY_PROJECT: process.env.SENTRY_PROJECT!
            }
          })
        }
      }
    });
    api.route("GET /trpc/{proxy+}", trpc.arn);
    api.route("POST /trpc/{proxy+}", trpc.arn);
    router.route("/trpc", api.url);

    new sst.aws.StaticSite("client", {
      path: "apps/client",
      router: {
        instance: router,
      },
      build: {
        command: "pnpm --filter @sentry-repo/client run build",
        output: "dist"
      },
      dev: {
        command: "pnpm run --filter @sentry-repo/client dev",
      },
      environment: {
        NODE_ENV: $dev ? "development" : "production",
        VITE_TRPC_URL: $interpolate`${router.url}/trpc`,
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN!,
        VITE_SENTRY_DSN: process.env.CLIENT_SENTRY_DSN!,
        SENTRY_ORG: process.env.SENTRY_ORG!,
        SENTRY_PROJECT: process.env.CLIENT_SENTRY_PROJECT!
      }
    })
  },
});
