const sequelize = require('./sequelize')

const User = require('../models/User')
const Location = require('../models/Location')
const Organization = require('../models/Organization')
const Position = require('../models/Position')
const Education = require('../models/Education')
const Certificate = require('../models/Certificate')
const Project = require('../models/Project')
const Skill = require('../models/Skill')
const Interest = require('../models/Interest')
const Follow = require('../models/Follow')
const Post = require('../models/Post')
const Like = require('../models/Like')

User.belongsToMany(Location, {through: 'user_location'})
Location.belongsToMany(User, {through: 'user_location'})
User.belongsToMany(Skill, {through: 'user_skill'})
Skill.belongsToMany(User, {through: 'user_skill'})
User.hasMany(
    Organization,
    {
        foreignKey: {
            name: 'userId',
            allowNull: true
        },
        onDelete: 'NO ACTION'
    }
)
Organization.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: true
    },
    as: 'user'
    }
)
Organization.belongsToMany(Location, {through: 'organization_location'})
Location.belongsToMany(Organization, {through: 'organization_location'})
User.hasMany(
    Position,
    {
        foreignKey: {
            name: 'userId'
        },
        onDelete: 'CASCADE'
    }
)
Position.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    as: 'user'
})
Organization.hasMany(
    Position,
    {
        foreignKey: {
            name: 'organizationId'
        },
        onDelete: 'RESTRICT'
    }
)
Position.belongsTo(Organization, {
    foreignKey: {
        name: 'organizationId',
        allowNull: false
    },
    as: 'organization'
})
Location.hasMany(
    Position,
    {
        foreignKey: {
            name: 'locationId',
        },
        onDelete: 'RESTRICT'
    }
)
Position.belongsTo(Location, {
    foreignKey: {
        name: 'locationId',
        allowNull: false
    },
    as: 'location'
})
User.hasMany(
    Education,
    {
        foreignKey: {
            name: 'userId'
        },
        onDelete: 'CASCADE'
    }
)
Education.belongsTo(
    User,
    {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'user'
    }
)
Organization.hasMany(
    Education,
    {
        foreignKey: {
            name: 'organizationId'
        },
        onDelete: 'RESTRICT'
    }
)
Education.belongsTo(
    Organization,
    {
        foreignKey: {
            name: 'organizationId',
            allowNull: false
        },
        as: 'organization'
    }
)
User.hasMany(
    Certificate,
    {
        foreignKey: {
            name: 'userId'
        },
        onDelete: 'CASCADE'
    }
)
Certificate.belongsTo(
    User,
    {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'user'
    }
)
Organization.hasMany(
    Certificate,
    {
        foreignKey: {
            name: 'organizationId'
        },
        onDelete: 'RESTRICT'
    }
)
Certificate.belongsTo(
    Organization,
    {
        foreignKey: {
            name: 'organizationId',
            allowNull: false
        },
        as: 'organization'
    }
    )
User.hasMany(
    Project,
    {
        foreignKey: {
            name: 'userId'
        },
        onDelete: 'CASCADE'
    }
)
Project.belongsTo(
    User,
    {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'user'
    }
)
User.hasMany(
    Interest,
    {
        foreignKey: {
            name: 'userId',
        },
        onDelete: 'CASCADE'
    }
)
Interest.belongsTo(
    User,
    {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'user'
    }
)
Organization.hasMany(
    Interest,
    {
        foreignKey: {
            name: 'organizationId'
        },
        onDelete: 'CASCADE'
    }
)
Interest.belongsTo(
    Organization,
    {
        foreignKey: {
            name: 'organizationId',
            allowNull: false
        },
        as: 'organization'
    }
)
User.belongsToMany(User,{ through: Follow, as: "to", foreignKey: "followedId" });
User.belongsToMany(User, { through: Follow, as: "from", foreignKey: "followerId" });
User.hasMany(
    Post,
    {
        foreignKey: {
            name: 'userId'
        },
        onDelete: 'CASCADE'
    }
)
Post.belongsTo(
    User,
    {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'user'
    }
)
Post.hasMany(
    Like,
    {
        foreignKey: {
            name: 'postId'
        },
        onDelete: 'CASCADE'
    }
)
Like.belongsTo(
    Post,
    {
        foreignKey: {
            name: 'postId',
            allowNull: false
        },
        as: 'post'
    }
)
User.hasMany(
    Like,
    {
        foreignKey: {
            name: 'userId'
        },
        onDelete: 'CASCADE'
    }
)
Like.belongsTo(
    User,
    {
        foreignKey: {
            name: 'userId',
            allowNull: false
        },
        as: 'user'
    }
)

function syncDatabase() {
    sequelize.sync({alter: true}).then(r => {
    }).catch((error) => {
    })
}

module.exports = syncDatabase