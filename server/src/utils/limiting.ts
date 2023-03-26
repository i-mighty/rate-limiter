import * as redis from 'redis';

import * as limiter from 'redis-bucket';

export const limiterFunction = (userLimit?: number) => {
  const redisUrl = process.env.REDIS_URI || '';

  const client = redis.createClient({
    url: redisUrl,
  });
  client.connect();
  const limit = limiter.create({
    rate: { flow: (userLimit || 10) - 1, burst: userLimit || 10 },
    async eval(script: string, keys: string[], argv: unknown[]) {
      return client.eval(script, {
        keys,
        arguments: argv.map(String),
      });
    },
    async evalsha(sha: string, keys: string[], argv: unknown[]) {
      return client.evalSha(sha, {
        keys,
        arguments: argv.map(String),
      });
    },
  });

  return limit;
};
