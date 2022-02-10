const { ApolloServer, gql } = require('apollo-server');
const artists = require('./data/artists.json');
const albums = require('./data/albums.json');
const songs = require('./data/songs.json')

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

type Query {
    Artists(filteringOperands: [ID!]): [Artist],
    Albums(filteringOperands: [ID!], parentID: Int): [Album],
    Songs(filteringOperands: [ID!], parentID: String): [Song],
}
`;

const resolvers = {
    Query: {
        Artists(parent, args, context, info) {
            const filteringOperands = JSON.parse(args.filteringOperands);
            return filterFunction(artists, filteringOperands.filteringOperands, filteringOperands.filteringOperator);
        },
        Albums(parent, args, context, info) {
            const filteringOperands = JSON.parse(args.filteringOperands);
            return filterFunction(albums, filteringOperands.filteringOperands, filteringOperands.filteringOperator, args.parentID);
        },
        Songs(parent, args, context, info) {
            const filteringOperands = JSON.parse(args.filteringOperands);
            return filterFunction(songs, filteringOperands.filteringOperands, filteringOperands.filteringOperator, args.parentID);
        }
    },
};

function filterFunction(data, filteringOperands, filteringOperator, parentID) {
    let resultAnd = data.slice();
    let resultOr = [];

    if (filteringOperands?.length) {
        filteringOperands.forEach(operand => {
            // checks whether the current operand is a subGroup
            if (typeof operand === 'string') {
                operand = JSON.parse(operand);
                if (filteringOperator === 0) {
                    resultAnd = filterFunction(resultAnd, operand.filteringOperands, operand.filteringOperator, parentID);
                } else {
                    resultOr = filterFunction(resultOr, operand.filteringOperands, operand.filteringOperator, parentID);
                }
            } else {
                const fieldName = operand.fieldName;
                const filterValue = operand.searchValueString ?
                    operand.searchValueString.toLowerCase() :
                    operand.searchValueNumber;
                const filterOperandConditionName = operand.conditionName;

                if (filteringOperator === 0) {
                    resultAnd = filterImplementation(resultAnd, fieldName, filterValue, filterOperandConditionName, parentID);
                } else {
                    resultOr.push(...filterImplementation(data, fieldName, filterValue, filterOperandConditionName, parentID));
                }
            }
        });
    } else if (parentID) {
        resultAnd = resultAnd.filter(record => record.ParentID === parentID);
    }
    return filteringOperator === 0 ? resultAnd : resultOr;
}

function filterImplementation(d, fieldName, filterValue, filterOperandConditionName, parentID) {
    d = d.filter(record => {
        if (parentID) {
            if (parentID !== record.ParentID) {
                return false;
            }
        }

        switch (filterOperandConditionName) {
            case 'contains': {
                const recordValue = record[fieldName].toLowerCase();
                return recordValue.includes(filterValue);
            }
            case 'startsWith': {
                const recordValue = record[fieldName].toLowerCase();
                return recordValue.startsWith(filterValue);
            }
            case 'endsWith': {
                const recordValue = record[fieldName].toLowerCase();
                return recordValue.endsWith(filterValue);
            }
            case 'equals': {
                return record[fieldName] === filterValue;
            }
            case 'doesNotEqual': {
                return record[fieldName] !== filterValue;
            }
            case 'doesNotContain': {
                const recordValue = record[fieldName].toLowerCase();
                return !recordValue.includes(filterValue);
            }
            case 'greaterThan': {
                return record[fieldName] > filterValue;
            }
            case 'greaterThanOrEqualTo': {
                return record[fieldName] >= filterValue;
            }
            case 'lessThan': {
                return record[fieldName] < filterValue;
            }
            case 'lessThanOrEqualTo': {
                return record[fieldName] <= filterValue;
            }
            case 'empty': {
                return record[fieldName].length === 0;
            }
            case 'notEmpty': {
                return record[fieldName].length > 0;
            }
            case 'null': {
                return record[fieldName].length === null;
            }
            case 'notNull': {
                return record[fieldName].length !== null;
            }
        }
    })
    return d;
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
