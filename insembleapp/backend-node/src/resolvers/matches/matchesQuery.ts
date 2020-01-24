import { Context, Root } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import axios from 'axios';

enum MatchStatus {
    Loading,
    Ready,
}

const enum MatchType {
    Lmatches,
    Tmatches,
}

type Match = {
    status: MatchStatus,
    id: string,
    data?: object, // TODO: construct type for `data`
}

async function processMatch(id: string, matchType: MatchType) {
    let matchRoute = matchType === MatchType.Lmatches ? 'lmatches' : 'tmatches';
    let response = (await axios.get(`${LEGACY_API_URI}/api/${matchRoute}/${id}`));

    if (response.status === 200) {
        return {
            status: MatchStatus.Ready,
            id,
            data: response.data,
        }
    } else if (response.status === 202) {
        return {
            status: MatchStatus.Loading,
            id,
        }
    }
}

async function lmatches(
    _: Root,
    {id}: {id: string},
    _context: Context,
) {
    return await processMatch(id, MatchType.Lmatches);
}

async function tmatches(
    _: Root,
    {id}: {id: string},
    _context: Context,
) {
    return await processMatch(id, MatchType.Tmatches);
}

export { lmatches, tmatches };
