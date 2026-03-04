SELECT first_name, last_name, salary, position, hire_date FROM employees WHERE salary BETWEEN 45000 AND 55000 ORDER BY salary ASC;
SELECT first_name, last_name, salary, position, hire_date FROM employees WHERE department_id IN (1, 3) ORDER BY salary ASC;
SELECT first_name, last_name, salary, position, hire_date FROM employees WHERE hire_date BETWEEN '2014-01-01' AND '2019-12-31' ORDER BY salary ASC;
SELECT first_name, last_name, salary, position, hire_date FROM employees 
WHERE position IN ('Warehouse Manager', 'Senior Researcher', 'Lead Engineer') ORDER BY salary ASC;