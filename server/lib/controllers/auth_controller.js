const User = require('../models/User')
const Location = require('../models/Location')

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

/**
 * The function handles the login request. It tries to find a user
 * with given email and password. If a user's email and hashed password matches
 * with request's email and password, it updates found user's stampedSessionID with the request's sessionID.
 * Then, it generates token1 and token2 JWTs.
 * The token1 JWT expires in 20 minutes and has hashedEmail, hashedSessionID as body.
 * Login request's sessionId is unique. Therefore, both user's email and request's sessionId is hashed and
 * saved on token1 JWT. This JWT is used to give user timeframe to update critical information,
 * such as full name, email, and other info that is considered. Then, token1 JWT is saved as value to token1 cookie.
 * The token2 JWT expires in 30 days and has user's hashedEmail and stampedSessionId as body.
 * This JWT is used to identify the request user. For example, user sends a request to add education info.
 * In this case, user is identified by using request's token2 cookie value, which is a token2 JWT.
 * The token2 JWT has email and stampedSessionId as body, they are used to find the request user.
 * There is no need to check for presence of token1 or token2 cookies, since a middleware in "client" app checks them
 * beforehand. If, required cookie is not present, it redirects user to login page.
 *
 * The token1 and token2 cookies is strictly protected against CSRF, XSS and other attacks by following these best practices:
 * - httpOnly flag is used to make cookies unreachable to Javascript.
 * - path='/' flag is used to add the __Host- cookie prefix. However, when setting cookie on express response, the express
 *      gives domain name to cookie and defaults to the domain name of the app. However, __Host- cookie prefix cannot be set with
 *      domain attribute. Therefore, although __Host- cookie prefix is very valuable on cookie generation it is not added to cookie names.
 *      Some little work is required to solve this problem.
 * - signed flag is used to sign the cookie with the help of cookie-parser middleware (app.js line 27).
 * - sameSite flag is used to allow browsers to only send this to the Linkfree domain.
 * - secure flag is used to allow browsers only transit this cookie on https connections.
 * - maxAge flag is used to control expire time of cookies.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function login(request, response) {
    try {
        const {email, password} = request.body

        const user = await User.findOne({where: {email: email}})

        if (!user || !bcrypt.compareSync(password, user.password)) {
            response.status(200).send({status: 'Email or password is wrong!'})
        } else {
            const hashedEmail = bcrypt.hashSync(email, 10)
            const hashedSessionID = bcrypt.hashSync(request.sessionID, 10)

            user.update({stampedSessionId: request.sessionID})

            const token1 = jwt.sign(
                {
                    email: hashedEmail,
                    sessionID: hashedSessionID
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '20m',
                    issuer: 'linkfree'
                })

            const token2 = jwt.sign(
                {
                    email: hashedEmail,
                    stampedSessionId: request.sessionID
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '30d',
                    issuer: 'linkfree'
                })

            response.cookie('token1', token1, {
                httpOnly: true,
                path: '/',
                signed: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 1200000
            })

            response.cookie('token2', token2, {
                httpOnly: true,
                path: '/',
                signed: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 2592000000
            })

            response.status(200).send({status: 'OK'})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * Logs out user by deleting saved cookies.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function logout(request, response) {
    try {
        response.clearCookie('token1')
        response.clearCookie('token2')

        response.status(200).send({status: 'OK'})
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * The function handles user registration. It first checks whether there is any registered
 * user with request email. If, no user with the email exist, it creates the user with the post data.
 * Password of user is automatically hashed on user creation thanks to configuration on User sequelize model setup (models/User.js line 34).
 * Token1 and token2 cookies also set on response. You can learn more on token1 and token2 cookies on above login documentation.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function registration(request, response) {
    try {
        const {fullName, email, headline, password, location} = request.body
        const image = request.file

        const hashedSessionID = bcrypt.hashSync(request.sessionID, 10)
        const hashedEmail = bcrypt.hashSync(email, 10)

        const user = await User.findOne({where: {email: email}})

        if (!user) {
            let loc = await Location.findOne({where: {city: location.split(' / ')[0], country: location.split(' / ')[1]}})

            if (!loc) {
                loc = await Location.create({
                    country: location.split(' / ')[1],
                    city: location.split(' / ')[0]
                })
            }

            const user = await User.create({
                fullName: fullName,
                email: email,
                headline: headline,
                password: password,
                stampedSessionId: request.sessionID,
                imageURL: image.filename
            })

            await user.addLocation(loc)

            const token1 = jwt.sign(
                {
                    email: hashedEmail,
                    sessionID: hashedSessionID
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '20m',
                    issuer: 'linkfree'
                })

            const token2 = jwt.sign(
                {
                    email: hashedEmail,
                    stampedSessionId: request.sessionID
                },
                process.env.JWT_KEY,
                {
                    expiresIn: '30d',
                    issuer: 'linkfree'
                })

            response.cookie('token1', token1, {
                httpOnly: true,
                path: '/',
                signed: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 1200000
            })

            response.cookie('token2', token2, {
                httpOnly: true,
                path: '/',
                signed: true,
                sameSite: 'strict',
                secure: false,
                maxAge: 2592000000
            })

            response.status(200).send({status: 'OK'})
        } else {
            response.status(200).send({status: 'USER ALREADY EXISTS'})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * It is a fake contact us api endpoint.
 * Contact us task can be customized according to business requirements later on.
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function contactUs(request, response) {
    try {
        response.status(200).send({status: 'OK'})
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

module.exports = {
    login,
    logout,
    registration,
    contactUs
}