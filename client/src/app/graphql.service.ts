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

export interface IDataState {
    parentID: any;
    key: string;
}

enum FILTER_OPERATION {
    CONTAINS = 'contains',
    STARTS_WITH = 'startswith',
    ENDS_WITH = 'endswith',
    EQUALS = 'eq',
    DOES_NOT_EQUAL = 'ne',
    DOES_NOT_CONTAIN = 'nc',
    GREATER_THAN = 'gt',
    LESS_THAN = 'lt',
    LESS_THAN_EQUAL = 'le',
    GREATER_THAN_EQUAL = 'ge'
}

@Injectable()
export class GraphQLService {
    private configUrl = 'http://localhost:4000/';

    constructor(private http: HttpClient) { }

    public getData(dataState: IDataState, filteringOperands?: any, filteringOperator?: FilteringLogic): any {
        const builtFilteringExpressions = this._buildAdvancedFilterExpression(filteringOperands, filteringOperator);
        const query = this.getQuery(dataState.key);
        const variables = { filter: builtFilteringExpressions };

        console.log('***** FILTER INPUT ARGUMENT ******')
        console.log(JSON.stringify(variables,null,'\t'));

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

    private _buildAdvancedFilterExpression(operands: any, operator: any): any {
        const filterExpression: { [k: string]: any } = {};
        operands.forEach((operand: any) => {
            if (operand instanceof FilteringExpressionsTree) {
                filterExpression[FilteringLogic[operator]].push(this._buildAdvancedFilterExpression(
                    operand.filteringOperands,
                    operand.operator));
            } else {
                const value = operand.searchVal;
                const isNumberValue = typeof value === 'number' ? true : false;
                const filterValue = isNumberValue ? value.toString() : value;
                const field = operand.fieldName;
                const expression: { [k: string]: any } = {};

                expression.field = field;

                const isEmpty = Object.keys(filterExpression).length === 0;
                if (isEmpty) {
                    filterExpression[FilteringLogic[operator]] = [];
                    console.log(JSON.stringify(filterExpression));
                }
                switch (operand.condition.name) {
                    case 'contains': {
                        expression[FILTER_OPERATION.CONTAINS] = filterValue;
                        break;
                    }
                    case 'startsWith': {
                        expression[FILTER_OPERATION.STARTS_WITH] = filterValue;
                        break;
                    }
                    case 'endsWith': {
                        expression[FILTER_OPERATION.ENDS_WITH] = filterValue;
                        break;
                    }
                    case 'equals': {
                        expression[FILTER_OPERATION.EQUALS] = filterValue;
                        break;
                    }
                    case 'doesNotEqual': {
                        expression[FILTER_OPERATION.DOES_NOT_EQUAL] = filterValue;
                        break;
                    }
                    case 'doesNotContain': {
                        expression[FILTER_OPERATION.DOES_NOT_CONTAIN] = filterValue;
                        break;
                    }
                    case 'greaterThan': {
                        expression[FILTER_OPERATION.GREATER_THAN] = filterValue;
                        break;
                    }
                    case 'greaterThanOrEqualTo': {
                        expression[FILTER_OPERATION.GREATER_THAN_EQUAL] = filterValue;
                        break;
                    }
                    case 'lessThan': {
                        expression[FILTER_OPERATION.LESS_THAN] = filterValue;
                        break;
                    }
                    case 'lessThanOrEqualTo': {
                        expression[FILTER_OPERATION.LESS_THAN_EQUAL] = filterValue;
                        break;
                    }
                    case 'empty': {
                        expression[FILTER_OPERATION.EQUALS] = '0';
                        break;
                    }
                    case 'notEmpty': {
                        expression[FILTER_OPERATION.GREATER_THAN] = '0';
                        break;
                    }
                    case 'null': {
                        expression[FILTER_OPERATION.EQUALS] = 'null';
                        break;
                    }
                    case 'notNull': {
                        expression[FILTER_OPERATION.DOES_NOT_EQUAL] = 'null';
                        break;
                    }
                }
                filterExpression[FilteringLogic[operator]].push({ expression });
            }
        });
        return filterExpression;
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
