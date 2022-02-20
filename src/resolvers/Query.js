async function feed(parent, args, context) {
    const where = args.filter ? {
        OR: [
            {description: {contains: args.filter}},
            {url: {contains: args.filter}}
        ],
    } : {}

    const links = await context.prisma.link.findMany({where, })
    return links
}

function link(parent, args, context) {
    return context.prisma.link.findUnique({where: {id: +args.id}})
}

module.exports = { feed, link, }