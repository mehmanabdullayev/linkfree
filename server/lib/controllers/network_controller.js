const User = require('../models/User')
const Follow = require('../models/Follow')
const Certificate = require("../models/Certificate");
const Education = require("../models/Education");
const Interest = require("../models/Interest");
const Location = require("../models/Location");
const Position = require("../models/Position");
const Project = require("../models/Project");
const Skill = require("../models/Skill");
const Post = require('../models/Post')
const Like = require('../models/Like')

const jwt = require("jsonwebtoken");

const {Op} = require("sequelize");

const bcrypt = require("bcrypt");

/**
 * The function makes case-insensitive search on User and Organization models by request's search term.
 * Then, in response it sends found User and Organization records' basic info. Only registered users can
 * make this search. The request user is found with the help of token2 cookie value, which is a JWT that
 * contains hashedEmail and stampedSessionId.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function search(request, response) {
    try {
        let array1 = []

        const {term} = request.body

        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        const user = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']},
            include: [Certificate, Education, Interest, Location, Position, Project, Skill]
        })

        if (!bcrypt.compareSync(user.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {
            if (request.method === 'POST') {
                array1 = await User.findAll({
                    where: {
                        id: {
                            [Op.ne]: user.id
                        },
                        fullName: {
                            [Op.iLike]: '%' + term + '%'
                        }
                    },
                    include: Location
                })
            } else {
                const follows = await Follow.findAll({
                    where: {followerId: user.id}
                })

                for (let e of follows) {
                    const o = await User.findOne({
                        where: {id: e.followedId},
                        include: Location
                    })

                    array1.push(o)
                }
            }

            let users = []

            for (let e of array1) {
                const {fullName, headline, imageURL} = e.dataValues
                let userInfo = {imageURL, fullName, headline}

                if (e.Locations.length > 0) {
                    userInfo.location = e.Locations.at(-1).city + '/' + e.Locations.at(-1).country
                }

                users.push(userInfo)
            }

            response.status(200).send({status: 'OK', networkData: {users}})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * The function allows a user to follow another user. Request user
 * is found with the help of token2 cookie value, which is a JWT that contains
 * hashedEmail and stampedSessionId. The user that request user wants to follow or unfollow
 * is found by profile imageURL, which is unique. If request user already follows the found user,
 * the user is unfollowed. Otherwise, the user is followed by the request user.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function followAction(request, response) {
    try {
        const {imageURL} = request.body

        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        const follower = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']}
        })

        if (!bcrypt.compareSync(follower.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {
            const followed = await User.findOne({
                where: {imageURL}
            })

            const follow = await Follow.findOne({
                where: {followedId: followed.id, followerId: follower.id}
            })

            if (follow) {
                await Follow.destroy({
                    where: {id: follow.id},
                    force: true
                })
            } else {
                await Follow.create({
                    followerId: follower.id,
                    followedId: followed.id
                })
            }

            response.status(200).send({status: 'OK'})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * The function allows a user to add a post to his/her feed.
 * Added post has content and optional image value.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function addPost(request, response) {
    try {
        const {content} = request.body
        const image = request.file

        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        const user = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']}
        })

        if (!bcrypt.compareSync(user.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {
            if (image) {
                await Post.create({
                    userId: user.id,
                    content: content,
                    imageURL: image.filename
                })
            } else {
                await Post.create({
                    userId: user.id,
                    content: content
                })
            }

            response.status(200).send({status: 'OK'})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * The function allows request user get his and his network's posts (the posts of users that request user follows).
 * Request user is found with the help of token2 cookie value, which is a JWT that contains hashedEmail and stampedSessionId.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function getPosts(request, response) {
    try {
        let array = []

        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        let user = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']},
            include: [Post, Location]
        })

        if (!bcrypt.compareSync(user.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {

            for (let post of user.Posts) {
                array.push({
                    userImageURL: user.imageURL,
                    userName: user.fullName,
                    userLocation: user.Locations.at(-1).dataValues.city + '/' + user.Locations.at(-1).dataValues.country,
                    content: post.dataValues.content,
                    imageURL: post.dataValues.imageURL,
                    dateString: post.dataValues.createdAt.toString().substring(0, 11),
                    date: post.dataValues.createdAt,
                    postId: post.dataValues.id,
                    likeCounts: await Like.count({
                        where: {
                            postId: post.dataValues.id
                        }
                    })
                })
            }

            const follows = await Follow.findAll({
                where: {followerId: user.id},
            })

            for (let follow of follows) {
                user = await User.findOne({
                    where: {id: follow.dataValues.followedId},
                    include: [Post, Location]
                })

                for (let post of user.Posts) {
                    array.push({
                        userImageURL: user.dataValues.imageURL,
                        userName: user.dataValues.fullName,
                        userLocation: user.Locations.at(-1).dataValues.city + '/' + user.Locations.at(-1).dataValues.country,
                        content: post.dataValues.content,
                        imageURL: post.dataValues.imageURL,
                        dateString: post.dataValues.createdAt.toString().substring(0, 11),
                        date: post.dataValues.createdAt,
                        postId: post.dataValues.id,
                        likeCounts: await Like.count({
                            where: {
                                postId: post.dataValues.id
                            }
                        })
                    })
                }
            }

            array = array.sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })

            response.status(200).send({response: array})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * The function allows request user to like a post on his/her network.
 * Request user is found with the help of token2 cookie value, which is a JWT that contains
 * hashedEmail and stampedSessionId.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function likePost(request, response) {
    try {
        const {postId} = request.body

        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        const user = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']},
        })

        if (!bcrypt.compareSync(user.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {

            const like = await Like.findOne({
                where: {
                    userId: user.id,
                    postId: postId
                }
            })

            if (!like) {
                await Like.create({
                    userId: user.id,
                    postId: postId
                })
            }

            response.status(200).send({status: 'OK'})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * The function retrieves suggested users to follow based on request user's network.
 * Retrieved data also contains some user suggestions based on overall network.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function suggestions(request, response) {
    try {
        let array = []

        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        const user = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']},
        })

        if (!bcrypt.compareSync(user.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {
            const following = await Follow.findAll({
                where: {followerId: user.dataValues.id}
            })

            for (let e of following) {
                const e_follows = await Follow.findAll({
                    where: {followerId: e.dataValues.followedId}
                })

                for (let e1 of e_follows) {
                    const follow = await Follow.findOne({
                        where: {followerId: user.dataValues.id, followedId: e1.dataValues.followedId}
                    })

                    if (follow === null) {
                        const u = await User.findOne({
                            where: {id: e1.dataValues.followedId},
                            include: Location
                        })

                        const {fullName, headline, imageURL} = u.dataValues
                        let userInfo = {imageURL, fullName, headline}

                        if (u.Locations.length > 0) {
                            userInfo.location = u.Locations.at(-1).city + '/' + u.Locations.at(-1).country
                        }

                        array.push(userInfo)
                    }
                }
            }

            const otherUsers = await User.findAll({
                where: {id: {[Op.ne]: user.id}},
                include: Location
            })

            for (let e of otherUsers.slice(0, 4)) {
                const follow = await Follow.findOne({
                    where: {followerId: user.dataValues.id, followedId: e.dataValues.id}
                })

                if (follow === null) {
                    const {fullName, headline, imageURL} = e.dataValues
                    let userInfo = {imageURL, fullName, headline}

                    if (e.Locations.length > 0) {
                        userInfo.location = e.Locations.at(-1).city + '/' + e.Locations.at(-1).country
                    }

                    array.push(userInfo)
                }
            }

            array = array.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.imageURL === value.imageURL
                        )
                    )
            )
            array.sort((a, b) => 0.5 - Math.random())
            response.status(200).send({response: array.slice(0, 4)})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

module.exports = {
    search,
    followAction,
    addPost,
    getPosts,
    likePost,
    suggestions
}