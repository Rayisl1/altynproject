SELECT SUM(salary) AS total_salary_expenditure
FROM employees;
SELECT department_id, SUM(salary) AS department_salary_expenditure FROM employees
GROUP BY department_id;