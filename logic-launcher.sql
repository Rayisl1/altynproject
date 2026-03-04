SELECT first_name, last_name, position, salary, department_id, hire_date FROM employees WHERE position LIKE '%Engineer%' AND salary > 50000 ORDER BY first_name DESC;
SELECT first_name, last_name, position, salary, department_id, hire_date FROM employees WHERE department_id IN (
    SELECT department_id FROM departments WHERE name in ('Human Resources', 'Finance')
) ORDER BY first_name DESC;
SELECT first_name, last_name, position, salary, department_id, hire_date FROM employees WHERE department_id NOT IN (
    SELECT department_id FROM departments WHERE name = 'Logistics'
) AND salary > 50000 ORDER BY first_name DESC;
SELECT first_name, last_name, position, salary, department_id, hire_date FROM employees WHERE position LIKE '%Analyst%' AND hire_date BETWEEN '2012-01-01' AND '2016-12-31' AND salary < 70000 ORDER BY first_name DESC;
