const Artists = `
query GetArtists($filter: FilterInput) {
        Artists(_filter: $filter){
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
query GetAlbums($parentID: Int, $filter: FilterInput) {
        Albums(parentID: $parentID, _filter: $filter) {
              Album
              LaunchDate
              BillboardReview
              USBillboard200
              Artist
  }
}   
`;

const Songs = `
query GetSongs($parentID: String, $filter: FilterInput) {
        Songs(parentID: $parentID, _filter: $filter) {
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
