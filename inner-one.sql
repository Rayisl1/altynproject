SELECT 
employees.FirstName || ' ' || employees.LastName AS EmployeeName,
customers.FirstName || ' ' || customers.LastName AS CustomerName,
invoices.InvoiceId,
invoices.InvoiceDate,
tracks.Name AS TrackName,
albums.Title AS AlbumTitle,
artists.Name AS ArtistName,
genres.Name AS GenreName,
media_types.Name AS MediaTypeName

FROM employees

INNER JOIN customers 
ON employees.EmployeeId = customers.SupportRepId

INNER JOIN invoices 
ON customers.CustomerId = invoices.CustomerId

INNER JOIN invoice_items 
ON invoices.InvoiceId = invoice_items.InvoiceId

INNER JOIN tracks 
ON invoice_items.TrackId = tracks.TrackId

INNER JOIN albums 
ON tracks.AlbumId = albums.AlbumId

INNER JOIN artists 
ON albums.ArtistId = artists.ArtistId

INNER JOIN genres 
ON tracks.GenreId = genres.GenreId

INNER JOIN media_types 
ON tracks.MediaTypeId = media_types.MediaTypeId

ORDER BY 
EmployeeName ASC,
CustomerName ASC,
InvoiceDate ASC;