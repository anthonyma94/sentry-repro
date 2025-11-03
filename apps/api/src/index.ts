import { awsLambdaRequestHandler } from "@trpc/server/adapters/aws-lambda";
import { appRouter } from "./trpc";
import { captureException, init, setContext, wrapHandler } from "@sentry/aws-serverless";

init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    sendDefaultPii: true,
    normalizeDepth: 50
})

export const handler = wrapHandler(awsLambdaRequestHandler({
    createContext: ({event}) => {
        setContext("event", {event});
        return;
    },
    router: appRouter,
    onError: (opts) => {
        const {error} = opts;
        console.error("Error occurred:", error);
        captureException(error);
    }
}));