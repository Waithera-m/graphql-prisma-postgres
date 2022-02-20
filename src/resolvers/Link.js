function postedBy(parent, args, context) {
    return context.prisma.link.findUnique({ where: { id: parent.id } }).postedBy()
}

function votes(parents, args, context) {
    return context.prisma.link.findUnique({
        where: {
            id: parent.id
        }
    }).votes()
}

module.exports = { postedBy, votes, }