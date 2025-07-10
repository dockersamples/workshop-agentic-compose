import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { jokeAgent } from './agent';

export const mastra = new Mastra({
  agents: { jokeAgent },
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
