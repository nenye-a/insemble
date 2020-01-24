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

type PlaceTuple = {
    placeName: string,
    count: number,
}

function toPlaceTupleArray(obj: {[key: string]: number}) : Array<PlaceTuple> {
    let key = Object.keys(obj);

    return key.map((k) => ({ placeName: k, count: obj[k] }));
}

async function processMatch(id: string, matchType: MatchType) {
    let matchRoute = matchType === MatchType.Lmatches ? 'lmatches' : 'tmatches';
    let response = (await axios.post(`${LEGACY_API_URI}/api/${matchRoute}/`, { id: id }));

    if (response.status === 200) {
        let camelizedData = camelizeJSON(response.data);

        // Any'ed because matchData's type is fairly complex, and having to intricately add types just for this purpose is overkill
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let resultData = camelizedData.map((d: any) => {
            return {
                ...d,
                // Fixes uppercased id
                id: d.Id,

                // Format data that's initially a JSON(?) dictionary (i.e. { Restaurant: 10, Library: 2 })
                // to [ { placeName: Restaurant, count: 10 }, { placeName: Library, count: 2 } ].
                // This needs to be done since object keys in graphql schema can't be dynamic
                nearby: toPlaceTupleArray(d.nearby),
                placeType: toPlaceTupleArray(d.placeType),
            }}
        );

        return {
            status: MatchStatus.Ready,
            id,
            data: resultData,
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
