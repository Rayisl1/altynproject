SELECT department_id, ROUND(AVG(salary), 2) AS total_salary
FROM employees
GROUP BY department_id ORDER BY department_id;