import { categories } from './category/categoryQuery';
import { lmatches, tmatches } from './matches/matchesQuery';
import { feedback, feedbacks } from './feedback/feedbackQuery';

export default {
    Query: {
        categories,

        feedback,
        feedbacks,

        lmatches,
        tmatches,
    },
};
