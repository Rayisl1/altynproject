SELECT customers.CustomerID, customers.FirstName || ' ' || customers.LastName AS CustomerName,
employees.FirstName || ' ' || employees.LastName AS SupportRepName, employees.Title AS SupportRepTitle FROM customers
INNER JOIN employees ON customers.SupportRepID = employees.EmployeeID
ORDER BY CustomerName ASC;

SELECT InvoiceID, InvoiceDate, customers.FirstName || ' ' || customers.LastName AS CustomerName
FROM invoices
Inner Join customers ON invoices.CustomerID = customers.CustomerID
ORDER BY CustomerName DESC;

SELECT tracks.TrackID, tracks.Name AS TrackName, albums.Title AS AlbumTitle, artists.Name AS ArtistName
FROM tracks
INNER JOIN albums ON tracks.AlbumID = albums.AlbumID
INNER JOIN artists ON albums.ArtistID = artists.ArtistID
ORDER BY TrackName DESC;

SELECT InvoiceLineID, tracks.Name AS TrackName, albums.Title AS AlbumTitle, artists.Name AS ArtistName
FROM invoice_items
INNER JOIN tracks ON invoice_items.TrackID = tracks.TrackID
INNER JOIN albums ON tracks.AlbumID = albums.AlbumID
INNER JOIN artists ON albums.ArtistID = artists.ArtistID
ORDER BY AlbumTitle ASC;