SELECT first_name, last_name
FROM employees WHERE department_id IN (
    SELECT department_id
    FROM departments
    ORDER BY budget DESC
    LIMIT 1
) ORDER BY first_name;