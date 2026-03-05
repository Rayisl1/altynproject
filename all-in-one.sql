SELECT department_id, ROUND(AVG(salary), 0) AS average_salary, MAX(salary) AS max_salary
FROM employees WHERE position LIKE '%Engineer%' OR position LIKE '%Manager%'
GROUP BY department_id
HAVING ROUND(AVG(salary), 0) > 10000 AND MAX(salary) < 1000000
ORDER BY max_salary DESC;