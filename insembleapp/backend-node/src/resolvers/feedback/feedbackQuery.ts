import {Root, Context} from 'serverTypes';
import {FeedbackWhereInput} from '../../generated/prisma-client';

function feedbacks(
    _: Root,
    { where}: {where: FeedbackWhereInput;},
    { prisma }: Context,
) {
    return prisma.feedbacks({
        where,
    });
}

// TODO: prisma wants the mongodb _id, can we PK with our id?
// function feedback(_: Root, {id}: {id: string}, {prisma}: Context) {
//     return prisma.feedback({id});
// }

export {feedbacks}
