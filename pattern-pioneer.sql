SELECT first_name, last_name, position, email FROM employees
WHERE first_name LIKE 'M%' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE last_name LIKE '%son' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE email LIKE '%.w%' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE position LIKE 'Senior%' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE last_name LIKE '_____' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE email LIKE '_a%' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE position LIKE '%Manager%' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE last_name LIKE 'M%' OR last_name LIKE 'W%' OR last_name LIKE 'R%' ORDER BY position DESC;
SELECT first_name, last_name, position, email FROM employees
WHERE first_name LIKE '_li%' ORDER BY position DESC;
