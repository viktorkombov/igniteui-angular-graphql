/* eslint-disable id-blacklist */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilteringExpressionsTree, FilteringLogic } from 'igniteui-angular';
import { map } from 'rxjs/operators';
import { queries } from './queries';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};
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
    key: string;
}

@Injectable()
export class GraphQLService {
    private configUrl = 'http://localhost:4000/';

    constructor(private http: HttpClient) { }

    public getData(dataState: IDataState, filteringOperands?: any, filteringOperator?: FilteringLogic): any {
        const builtFilteringExpressions = this.buildVariables(filteringOperands, filteringOperator);
        const query = this.getQuery(dataState.key);
        const variables = { filteringOperands: builtFilteringExpressions };

        if (dataState.parentID) {
            Object.assign(variables, { parentID: dataState.parentID });
        }
        
        return this.http.post(
            this.configUrl,
            JSON.stringify({ query, variables }),
            httpOptions
        ).pipe(
            map((response: IDataResponse | any) => response.data[dataState.key])
        );
    }

    private buildVariables(filteringOperands: any[] = [], filteringOperator?: FilteringLogic): any {
        const result: IFilteringOperand[] = [];

        filteringOperands.forEach(operand => {
            if (operand instanceof FilteringExpressionsTree) {
                const subGroupVariables = this.buildVariables(operand.filteringOperands, operand.operator);
                result.push(subGroupVariables);
            } else {
                const fieldName = operand.fieldName;
                const searchValueString = typeof operand.searchVal === 'string' ?
                    operand.searchVal :
                    '';
                const searchValueNumber = typeof operand.searchVal === 'number' ?
                    operand.searchVal :
                    null;
                const conditionName = operand.condition.name;

                result.push({ fieldName, searchValueString, searchValueNumber, conditionName });
            }
        });

        return JSON.stringify({ filteringOperands: result, filteringOperator });
    }

    private getQuery(key: string) {
        switch (key) {
            case 'Artists':
                return queries.Artists;
            case 'Albums':
                return queries.Albums;
            default:
                return queries.Songs;
        }
    }
}
