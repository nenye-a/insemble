import { categories } from './category/categoryQuery';
import { feedback, feedbacks } from './feedback/feedbackQuery';
import { lmatches, tmatches } from './matches/matchesQuery';
import { search } from './search/searchQuery';

export default {
    Query: {
        categories,

        feedback,
        feedbacks,

        lmatches,
        tmatches,

        search,
    },
};
