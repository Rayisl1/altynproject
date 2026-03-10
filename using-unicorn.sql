SELECT invoices.InvoiceID, invoices.InvoiceDate, invoice_items.TrackID, invoice_items.UnitPrice, invoice_items.Quantity
FROM invoices
JOIN invoice_items USING (InvoiceID)
ORDER BY invoice_items.UnitPrice DESC;