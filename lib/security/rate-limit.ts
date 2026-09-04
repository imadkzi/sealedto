import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "../db/prisma";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export async function hitRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<boolean> {
  try {
    const now = new Date();
    const row = await prisma.$transaction(async (tx) => {
      const existing = await tx.authRateLimit.findUnique({ where: { key } });
      if (!existing) {
        return tx.authRateLimit.create({
          data: { key, count: 1, windowStartedAt: now },
        });
      }

      const expired =
        existing.windowStartedAt.getTime() < now.getTime() - windowMs;
      if (expired) {
        return tx.authRateLimit.update({
          where: { key },
          data: { count: 1, windowStartedAt: now },
        });
      }

      return tx.authRateLimit.update({
        where: { key },
        data: { count: { increment: 1 } },
      });
    });

    return row.count > limit;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021"
    ) {
      return false;
    }
    throw error;
  }
}
