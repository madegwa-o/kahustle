import { Redis } from "@upstash/redis"

const UPSTASH_REDIS_REST_URL="https://social-ant-134539.upstash.io"
const UPSTASH_REDIS_REST_TOKEN="gQAAAAAAAg2LAAIgcDJkOTM4NjhjMzY2Yjc0ZjJmODMzN2U1N2U2ZWFhOWIyYQ"

export const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,       // from upstash.com dashboard
    token: UPSTASH_REDIS_REST_TOKEN,   // from upstash.com dashboard
})