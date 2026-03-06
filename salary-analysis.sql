SELECT
    first_name,
    last_name,
    department_id,
    salary,
    (
        SELECT name
        FROM departments d
        WHERE d.department_id = e.department_id
    ) AS department_name
FROM employees e
WHERE salary > (
        SELECT AVG(salary)
        FROM employees
        WHERE department_id = e.department_id
    )
AND department_id IN (
        SELECT department_id
        FROM departments
        WHERE budget > (SELECT AVG(budget) FROM departments)
    )
AND salary > (
        SELECT AVG(salary)
        FROM employees
    )
ORDER BY salary DESC;