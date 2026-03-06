SELECT first_name, last_name,
(SELECT name FROM departments WHERE department_id = employees.department_id) AS department_name
FROM employees
WHERE department_id = (
    SELECT department_id FROM employees WHERE first_name = 'Emma' AND last_name = 'Clark'
)ORDER BY last_name DESC;