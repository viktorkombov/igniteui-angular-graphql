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
            const filteringOperands = JSON.parse(args.filteringOperands)
            return filterFunction(artists, filteringOperands);
        },
        Albums(parent, args, context, info) {
            const filteringOperands = JSON.parse(args.filteringOperands)
            return filterFunction(albums, filteringOperands, args.parentID);
        },
        Songs(parent, args, context, info) {
            const filteringOperands = JSON.parse(args.filteringOperands)
            return filterFunction(songs, filteringOperands, args.parentID);
        }
    },
};

function filterFunction(data, filteringOperands, parentID = undefined) {
    const result = data.slice();
    if (filteringOperands) {
        filteringOperands.forEach(operand => {
            result = result.filter(record => {
                if (parentID) {
                    if (parentID === record.ParentID) {
                        return false;
                    }
                }

                const fieldName = operand.fieldName;
                const filterValue = operand.searchValueString ? operand.searchValueString : operand.searchValueNumber;

                switch (operand.condition.name) {
                    case 'contains': {
                        return record[fieldName].includes(filterValue);
                    }
                    case 'startsWith': {
                        return record[fieldName].startsWith(filterValue);
                    }
                    case 'endsWith': {
                        return record[fieldName].endsWith(filterValue);
                    }
                    case 'equals': {
                        return record[fieldName] === filterValue;
                    }
                    case 'doesNotEqual': {
                        return record[fieldName] !== filterValue;
                    }
                    case 'doesNotContain': {
                        return !record[fieldName].includes(filterValue);
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
        })
    }
    return result;
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
