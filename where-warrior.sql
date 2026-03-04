SELECT first_name, last_name, position FROM employees WHERE salary > 55000 ORDER BY position DESC;
SELECT first_name, last_name, position FROM employees WHERE hire_date > '2012-06-01' ORDER BY position DESC;
SELECT first_name, last_name, position FROM employees WHERE department_id = 2 and salary < 100000 ORDER BY position DESC;
SELECT first_name, last_name, position FROM employees WHERE position LIKE '%Lead%' ORDER BY position DESC;