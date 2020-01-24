import { Context, Root } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import axios from 'axios';
import camelizeJSON from '../../helpers/camelizeJSON';

enum MatchStatus {
    Loading = 'Loading',
    Ready = 'Ready',
}

const enum MatchType {
    Lmatches,
    Tmatches,
}

async function processMatch(id: string, matchType: MatchType) {
    let matchRoute = matchType === MatchType.Lmatches ? 'lmatches' : 'tmatches';
    let response = (await axios.post(`${LEGACY_API_URI}/api/${matchRoute}/`, { id: id }));

    if (response.status === 200) {
        let camelizedData = camelizeJSON(response.data);

        // This step is necessary to convert Id -> id.
        // Any'ed because the schema's pretty huge and intricately making types just for this one occasion seems overkill
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let fixedData = camelizedData.map((d: any) => ({ id: d.Id, ...d }));

        return {
            status: MatchStatus.Ready,
            id,
            data: fixedData,
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
