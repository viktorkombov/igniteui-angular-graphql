import { gql } from 'apollo-angular'

const getArtists = gql`
query GetArtists($filteringOperands: [ID!]) {
        Artists(filteringOperands: $filteringOperands){
              ID
              Artist
              HasGrammyAward
              Debut
              GrammyNominations
              GrammyAwards
    }
  }
`;

const getAlbums = gql`
query GetAlbums($filteringOperands: [ID!], $parentID: Int) {
        Albums(filteringOperands: $filteringOperands, parentID: $parentID) {
              Album
              LaunchDate
              BillboardReview
              USBillboard200
              Artist
  }
}   
`;

const getSongs = gql`
query GetSongs($filteringOperands: [ID!], $parentID: String) {
        Songs(filteringOperands: $filteringOperands, parentID: $parentID) {
              TrackNumber
              Title
              Released
              Genre
              Album
  }
}   
`;

export const queries = {
  getArtists,
  getAlbums,
  getSongs
}
