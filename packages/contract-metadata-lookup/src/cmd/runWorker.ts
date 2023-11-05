import { Worker } from 'bullmq'
import { JOB_QUEUE } from '@/constants/queues'
import { processJob } from '@/jobs/processJob'
import { envVars } from '@/envVars'

new Worker(
  JOB_QUEUE,
  async (job) => {
    try {
      return await processJob({
        job,
      })
    } catch (e) {
      console.error(e)
    }
  },
  {
    connection: {
      host: envVars.REDIS_HOST,
      port: envVars.REDIS_PORT,
      username: envVars.REDIS_USERNAME,
      password: envVars.REDIS_PASSWORD,
    },
  },
)
