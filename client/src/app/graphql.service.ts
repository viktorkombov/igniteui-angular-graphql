/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { queries } from './queries';

interface IDataResponse {
    value: any[];
}

interface IFilteringOperand {
    fieldName: string;
    searchValueString: string;
    searchValueNumber: number | null;
    conditionName: string;
}

export interface IDataState {
    parentID: any;
    parentKey: string;
}

@Injectable()
export class GraphQLService {

    constructor(private apollo: Apollo) { }

    public getData(dataState: IDataState, filteringOperands?: any): any {
        const builtFilteringExpressions = this.buildQueries(filteringOperands);
        const query = dataState.parentKey === 'Artists' ? queries.getArtists :
            (dataState.parentKey === 'Albums' ? queries.getAlbums : queries.getSongs);
        const variables = dataState.parentID ? { filteringOperands: builtFilteringExpressions, parentID: dataState.parentID } :
            { filteringOperands: builtFilteringExpressions }

        return this.apollo
            .watchQuery({
                query: query,
                variables: variables
            })
            .valueChanges
            .pipe(map((response: IDataResponse | any) => response.data[dataState.parentKey]))
    }

    public buildQueries(filteringOperands: any[] = []): any {
        const result: IFilteringOperand[] = [];

        filteringOperands.forEach(operand => {
            const fieldName = operand.FieldName;
            const searchValueString = typeof operand.searchVal === 'string' ? operand.searchVal : '';
            const searchValueNumber = typeof operand.searchVal === 'number' ? operand.searchVal : null;
            const conditionName = operand.condition.name;

            result.push({ fieldName, searchValueString, searchValueNumber, conditionName });
        });

        return JSON.stringify(result);
    }
}
