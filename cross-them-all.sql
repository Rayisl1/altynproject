SELECT media_types.Name AS MediaTypeName, genres.Name AS GenreName
FROM media_types
CROSS JOIN genres
ORDER BY GenreName DESC;