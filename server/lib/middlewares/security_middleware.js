const {RateLimiterMemory, RateLimiterQueue} = require("rate-limiter-flexible")

/**
 * In current process memory, allow at most 5 requests per IP every 1 second.
 * @type {RateLimiterMemory}
 */
const limiterFlexible = new RateLimiterMemory({
    points: 5,
    duration: 1
})

/**
 * Maximum 500 requests at a time.
 * @type {RateLimiterQueue}
 */
const limiterQueue = new RateLimiterQueue(limiterFlexible, {
    maxQueueSize: 500
})

/**
 * The middleware rate limits requests coming to current process.
 * @param request
 * @param response
 * @param next
 * @returns {Promise<void>}
 */
async function rateLimiter(request, response, next) {
    try {
        await limiterQueue.removeTokens(1)
        next()
    } catch(error) {
        response.status(429).end(error)
    }
}

module.exports = {
    rateLimiter
}