function feed(parent, args, context) {
    return context.prisma.link.findMany()
}

function link(parent, args, context) {
    return context.prisma.link.findUnique({where: {id: +args.id}})
}

module.exports = { feed, link, }