const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')


async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.user.create({ data: {...args, password}})
    console.log("user: ", user.id)
    const token = jwt.sign({ userId: user.id }, APP_SECRET)
    
    return { token, user, }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user.findUnique({
        where: {
            email: args.email
        }
    })
    if (!user) {
        throw new Error("User with the provided email does not exist")
    } else {
        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        } else {
            const token = jwt.sign({ userId: user.id }, APP_SECRET)
            return { token, user, }
        }
    }
}

async function post(parent, args, context, info) {
    const { userId } = context;
    return await context.prisma.link.create({
      data: {
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: +userId } },
      }
    })
}

async function updateLink(parent, args, context) {
    const { userId } = context;

    return await context.prisma.link.update({
        where: {id: +args.id},
        data: {
            url: args.url,
            description: args.description
        }
    });
}

async function deleteLink(parent, args, context) {
    const { userId } = context;

    return await context.prisma.link.delete({
        where: {
            id: +args.id
        }
    })
}

module.exports = { signup, login, post, updateLink, deleteLink, }