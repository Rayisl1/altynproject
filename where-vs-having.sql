SELECT department_id, ROUND(AVG(salary), 0) AS average_salary
FROM employees
WHERE hire_date > '2015-05-18'
GROUP BY department_id
HAVING ROUND(AVG(salary), 0) > 33333
ORDER BY department_id;