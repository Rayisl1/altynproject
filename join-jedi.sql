SELECT FirstName, LastName, InvoiceID FROM Customers
INNER JOIN Invoices ON Customers.CustomerID = Invoices.CustomerID WHERE 
TOTAL > 0 ORDER BY FirstName ASC;