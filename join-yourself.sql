SELECT m.FirstName AS ManagerFirstName, m.LastName AS ManagerLastName, m.Title AS ManagerTitle,
COUNT(e.ReportsTo) AS SubordinateCount FROM employees e
INNER JOIN employees m ON e.ReportsTo = m.EmployeeId
GROUP BY m.EmployeeId, m.FirstName, m.LastName, m.Title
HAVING COUNT(e.ReportsTo) > 0
ORDER BY m.LastName, m.FirstName;