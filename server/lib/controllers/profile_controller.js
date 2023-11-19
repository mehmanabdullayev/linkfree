const User = require('../models/User')
const Organization = require('../models/Organization')
const Certificate = require('../models/Certificate')
const Education = require('../models/Education')
const Interest = require('../models/Interest')
const Location = require('../models/Location')
const Position = require('../models/Position')
const Project = require('../models/Project')
const Skill = require('../models/Skill')
const Follow = require('../models/Follow')

const jwt = require("jsonwebtoken")

const bcrypt = require("bcrypt");

/**
 * The function retrieves all public data of user.
 * If imageURL is present in request query. then it means
 * information of other user is requested, other than the current request user.
 * User is found with the help imageURL in request query (if present) or token2 cookie value,
 * which is a JWT that contains hashedEmail and stampedSessionId.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function getUserData(request, response) {
    try {
        let user, currentUser, following = false
        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        const {imageURL} = request.query

        if (imageURL) {
            user = await User.findOne({
                where: {imageURL: imageURL},
                include: [Certificate, Education, Interest, Location, Position, Project, Skill]
            })

            currentUser = await User.findOne({
                where: {stampedSessionId: r['stampedSessionId']},
            })

            const follow = await Follow.findOne({
                where: {followedId: user.id, followerId: currentUser.id}
            })

            if (follow) following = true
        } else {
            user = await User.findOne({
                where: {stampedSessionId: r['stampedSessionId']},
                include: [Certificate, Education, Interest, Location, Position, Project, Skill]
            })

            currentUser = user
        }

        if (!bcrypt.compareSync(currentUser.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {
            currentUser = user.dataValues.stampedSessionId === r['stampedSessionId']

            const {
                id,
                phone,
                phoneConfirmed,
                emailConfirmed,
                password,
                stampedSessionId,
                createdAt,
                updatedAt,
                deletedAt,
                UserId,
                Certificates,
                Interests,
                Locations,
                Positions,
                Projects,
                Skills,
                ...userBasicInfo
            } = user.dataValues

            let certificates = [], education = [], interests = [], locations = [], positions = [], projects = [],
                skills = []

            if (Certificates.length !== 0) {
                for (let certificate of Certificates) {
                    const {
                        name,
                        organizationId,
                        issueDate,
                        expireDate,
                        credentialID,
                        credentialURL
                    } = certificate.dataValues
                    let dates = issueDate
                    if (expireDate) dates += (' / ' + expireDate)
                    const organization = await Organization.findByPk(organizationId)
                    certificates.push({
                        logoURL: organization.logoURL,
                        name,
                        organization: 'Issuing organization: ' + organization.name,
                        dates: 'Issue/Expire Date: ' + dates,
                        credentials: 'Credential id: ' + credentialID + ' / Credential url: ' + credentialURL
                    })
                }
            }
            if (userBasicInfo.Education.length !== 0) {
                for (let e of userBasicInfo.Education) {
                    const {organizationId, degree, fieldOfStudy, startDate, endDate, grade, activities} = e.dataValues
                    let dates = startDate
                    if (endDate) dates += (' / ' + endDate)
                    let gpa
                    if (grade) gpa = 'Grade: ' + grade
                    const organization = await Organization.findByPk(organizationId)
                    education.push({
                        logoURL: organization.logoURL,
                        name: organization.name,
                        field: degree + ' / ' + fieldOfStudy,
                        dates: dates,
                        gpa,
                        activities
                    })
                }
            }
            if (Interests.length !== 0) {
                for (let interest of Interests) {
                    const {organizationId} = interest.dataValues
                    const organization = await Organization.findByPk(organizationId)
                    interests.push({name: organization.name})
                }
            }
            if (Locations.length !== 0) {
                for (let location of Locations) {
                    const {city, country} = location.dataValues
                    locations.push({city, country})
                }
            }
            if (Positions.length !== 0) {
                for (let position of Positions) {
                    const {
                        title,
                        employmentType,
                        organizationId,
                        locationId,
                        locationType,
                        startDate,
                        endDate,
                        description
                    } = position.dataValues
                    let dates = startDate
                    if (endDate) dates += (' / ' + endDate)
                    const organization = await Organization.findByPk(organizationId)
                    const location = await Location.findByPk(locationId)
                    positions.push({
                        logoURL: organization.logoURL,
                        title,
                        job: organization.name + ' / ' + employmentType,
                        locationAndDate: location.city + ', ' + location.country + ' / ' + dates,
                        description
                    })
                }
            }
            if (Projects.length !== 0) {
                for (let project of Projects) {
                    const {name, description, startDate, endDate} = project.dataValues
                    let dates = startDate
                    if (endDate) dates += (' / ' + endDate)
                    projects.push({logoURL: null, name, description, dates: dates})
                }
            }
            if (Skills.length !== 0) {
                for (let skill of Skills) {
                    const {name, type} = skill.dataValues
                    skills.push({name, type})
                }
            }

            response.status(200).send({
                response: {
                    userBasicInfo,
                    positions,
                    education,
                    projects,
                    certificates,
                    skills,
                    interests,
                    locations,
                    following,
                    currentUser
                }
            })
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * It is a generic function that can edit request user's basic information.
 * Any kind of information can be send to get edit, such fullname or headline
 * of user can be send to be edited. Information sent with post-data is not known in advance.
 * The Only thing known is a User model's object properties will be changed and any property can be
 * sent to get changed. Therefore, it is a generic function.
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function editInfo(request, response) {
    try {
        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)

        const user = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']}
        })

        if (!bcrypt.compareSync(user.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {
            const data = request.body

            Object.entries(data).forEach(([key, value]) => {
                user[key] = value
            })

            await user.save()

            response.status(200).send({status: 'OK'})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

/**
 * It is a generic function that can create different entities for request user.
 * An entity created for request user can be Education, Certificate, Project of user etc.
 * (which all have relations with User model).
 *
 * @param request
 * @param response
 * @returns {Promise<void>}
 */
async function addElement(request, response) {
    try {
        const r = jwt.verify(request.signedCookies['token2'], process.env.JWT_KEY)
        let model, o = {}, addElement = true, skill

        const user = await User.findOne({
            where: {stampedSessionId: r['stampedSessionId']}
        })

        if (!bcrypt.compareSync(user.dataValues.email, r['email'])) {
            response.status(200).send({status: 'TOKEN INVALID!'})
        } else {
            const data = request.body

            for (const [key, value] of Object.entries(data)) {
                if (key === 'organization') {
                    let organization = await Organization.findOne({where: {name: value}})

                    if (organization) {
                        o.organizationId = organization.id
                    } else {
                        organization = await Organization.create({
                            name: value
                        })
                        o.organizationId = organization.id
                    }
                } else if (key === 'location') {
                    let location = await Location.findOne({
                        where: {
                            city: value.split(' / ')[0],
                            country: value.split(' / ')[1]
                        }
                    })

                    if (location) {
                        o.locationId = location.id
                    } else {
                        location = await Location.create({
                            country: value.split(' / ')[1],
                            city: value.split(' / ')[0]
                        })

                        o.locationId = location.id
                    }
                } else if (key === 'startDate' || key === 'issueDate' || key === 'expireDate' || key === 'endDate') {
                    o[key] = new Date(value)
                } else {
                    o[key] = value
                }
            }

            if (request.url.includes('add_certificate')) {
                o.userId = user.id
                model = Certificate
            } else if (request.url.includes('add_education')) {
                o.userId = user.id
                model = Education
            } else if (request.url.includes('add_interest')) {
                o.userId = user.id
                model = Interest
            } else if (request.url.includes('add_position')) {
                o.userId = user.id
                model = Position
            } else if (request.url.includes('add_project')) {
                o.userId = user.id
                model = Project
            } else if (request.url.includes('add_skill')) {
                skill = await Skill.findOne({where: o})

                if (skill) addElement = false;
                user.addSkill(skill)
                model = Skill
            }

            if (addElement) {
                const element = await model.create(o)

                if (request.url.includes('add_skill')) {
                    user.addSkill(element)
                }
            }

            response.status(200).send({status: 'OK'})
        }
    } catch (error) {
        response.status(500).send({status: 'SERVER ERROR'})
    }
}

module.exports = {
    getUserData,
    editInfo,
    addElement
}