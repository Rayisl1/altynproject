SELECT tracks.Name AS TrackName, albums.Title AS AlbumTitle, artists.Name AS ArtistName, genres.Name AS GenreName, media_types.Name AS MediaTypeName
FROM tracks
JOIN albums ON tracks.AlbumId = albums.AlbumId
JOIN artists ON albums.ArtistId = artists.ArtistId
JOIN genres ON tracks.GenreId = genres.GenreId
JOIN media_types ON tracks.MediaTypeId = media_types.MediaTypeId
WHERE genres.Name = 'Rock' and tracks.Milliseconds >= 600000
ORDER BY genres.Name;