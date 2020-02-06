import { Root, Context } from 'serverTypes';
import { FeedbackWhereInput } from '../../generated/prisma-client';

function feedbacks(
    _: Root,
    { where }: { where: FeedbackWhereInput },
    { prisma }: Context,
) {
    return prisma.feedbacks({
        where,
    });
}

function feedback(_: Root, { id }: { id: string }, { prisma }: Context) {
    return prisma.feedback({ id });
}

export { feedback, feedbacks };
