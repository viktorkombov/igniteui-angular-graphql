const { ApolloServer, gql } = require('apollo-server');
const artists = require('./data/artists.json');
const albums = require('./data/albums.json');
const songs = require('./data/songs.json');

const FILTER_OPERATION = {
    CONTAINS: 'contains',
    STARTS_WITH: 'startswith',
    ENDS_WITH: 'endswith',
    EQUALS: 'eq',
    DOES_NOT_EQUAL: 'ne',
    DOES_NOT_CONTAIN: 'nc',
    GREATER_THAN: 'gt',
    LESS_THAN: 'lt',
    LESS_THAN_EQUAL: 'le',
    GREATER_THAN_EQUAL: 'ge'
}

let typeDefs = gql`

type Artist {
  ID: Int,
  Artist: String,
  HasGrammyAward: Boolean,
  Debut: Int,
  GrammyNominations: Int,
  GrammyAwards: Int
}

type Album {
  Album: String,
  LaunchDate: String,
  BillboardReview: Int,
  USBillboard200: Int,
  Artist: String
}

type Song {
  TrackNumber: String,
  Title: String,
  Released: String,
  Genre: String,
  Album: String,
}

input FilterInput {
    expression: FilterExpressionInput
    And: [FilterInput!]
    Or: [FilterInput!]
}

input FilterExpressionInput {
    field: String!
    eq: String
    gt: String
    ge: String
    lt: String
    le: String
    ne: String
    nc: String
    contains: String
    startswith: String
    endswith: String
}

type Query {
    Artists(_filter: FilterInput): [Artist],
    Albums(parentID: Int, _filter: FilterInput): [Album],
    Songs(parentID: String, _filter: FilterInput): [Song],
}
`;

const resolvers = {
    Query: {
        Artists(parent, args) {
            return filter(artists, args._filter);
        },
        Albums(parent, args) {
            return filter(albums, args._filter, args.parentID);
        },
        Songs(parent, args) {
            return filter(songs, args._filter, args.parentID);
        },
    },
};

function filter(data, expressions, parentID) {
    let i;
    let rec;
    const len = data.length;
    const res = [];

    for (i = 0; i < len; i++) {
        rec = data[i];
        if (rec.ParentID === parentID && matchRecord(rec, expressions)) {
            res.push(rec);
        }
    }
    return res;
}

function matchRecord(rec, expressions) {
    if (expressions) {
        const expressionKey = Object.keys(expressions)[0];
        if (expressionKey !== 'expression') {
            const expressionsTree = expressions[expressionKey];
            const operator = expressionKey;
            let matchOperand;

            if (expressionsTree && expressionsTree.length) {
                for (const operand of expressionsTree) {
                    matchOperand = matchRecord(rec, operand);

                    // Return false if at least one operand does not match and the filtering logic is And
                    if (!matchOperand && operator === 'And') {
                        return false;
                    }

                    // Return true if at least one operand matches and the filtering logic is Or
                    if (matchOperand && operator === 'Or') {
                        return true;
                    }
                }

                return matchOperand;
            }

            return true;
        } else {
            const expression = expressions.expression;
            return findMatchByExpression(rec, expression);
        }
    }
    return true;
}

function findMatchByExpression(rec, expr) {
    const condition = Object.keys(expr).find(key => key !== 'field');
    const val = rec[expr.field];
    const filterVal = expr[condition];
    return conditionLogic(val, condition, filterVal);
}

function conditionLogic(value, condition, filterValue) {
    if (condition === FILTER_OPERATION.GREATER_THAN ||
        condition === FILTER_OPERATION.GREATER_THAN_EQUAL ||
        condition === FILTER_OPERATION.LESS_THAN ||
        condition === FILTER_OPERATION.LESS_THAN_EQUAL) {
        value = Number(value);
    } else {
        value = value.toString().toLowerCase();
        filterValue = filterValue.toLowerCase();
    }

    switch (condition) {
        case FILTER_OPERATION.CONTAINS: {
            return value.includes(filterValue);
        }
        case FILTER_OPERATION.STARTS_WITH: {
            return value.startsWith(filterValue);
        }
        case FILTER_OPERATION.ENDS_WITH: {
            return value.endsWith(filterValue);
        }
        case FILTER_OPERATION.EQUALS: {
            return value === filterValue;
        }
        case FILTER_OPERATION.DOES_NOT_EQUAL: {
            return value !== filterValue;
        }
        case FILTER_OPERATION.DOES_NOT_CONTAIN: {
            return !value.includes(filterValue);
        }
        case FILTER_OPERATION.GREATER_THAN: {
            return value > filterValue;
        }
        case FILTER_OPERATION.GREATER_THAN_EQUAL: {
            return value >= filterValue;
        }
        case FILTER_OPERATION.LESS_THAN: {
            return val < filterValue;
        }
        case FILTER_OPERATION.LESS_THAN_EQUAL: {
            return val <= filterValue;
        }
    }
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
