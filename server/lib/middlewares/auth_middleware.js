const express = require('express')
const jwt = require('jsonwebtoken')

/**
 * The middleware checks request url. If request path is protected,
 * it checks for token2 cookie in request's signed cookies. The token2 cookie value
 * is a signed JWT. The middleware tries to verify the JWT. If token2 cookie is not present or
 * verification fails, it sends 'UNAUTHORIZED' string as response.
 * @param request
 * @param response
 * @param next
 */
function authMiddleware(request, response, next) {
    if (request.url.startsWith('/api/auth') || request.url.includes('.png') || request.url.includes('.svg')) next()
    else {
        const token2 = request.signedCookies['token2']

        if (!token2) response.status(401).send({status: 'UNAUTHORIZED'})
        else {
            try {
                jwt.verify(token2, process.env.JWT_KEY)
            } catch (error) {
                response.status(401).send({status: 'UNAUTHORIZED'})
            }
        }

        next()
    }
}

module.exports = authMiddleware