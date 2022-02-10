const Artists = `
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

const Albums = `
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

const Songs = `
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
  Artists,
  Albums,
  Songs
}
