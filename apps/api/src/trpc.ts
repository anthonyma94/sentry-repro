import { trpcMiddleware } from "@sentry/aws-serverless";
import { initTRPC, TRPCError } from "@trpc/server";

const t = initTRPC.context<any>().create();

const middleware = t.middleware(trpcMiddleware());
const router = t.router;
export const procedure = t.procedure.use(middleware);

export const appRouter = router({
    error: procedure.mutation(() => {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "This is a test error"})
    })
})

export type Router = typeof appRouter;