SELECT a.ArtistID, a.Name 
FROM artists a 
LEFT JOIN albums al ON a.ArtistID = al.ArtistID 
WHERE al.AlbumID IS NULL
ORDER BY a.Name DESC;