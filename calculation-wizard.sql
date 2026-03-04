SELECT first_name || ' ' || last_name AS full_name,
salary * 12 AS annual_salary,
salary * 1.1 AS increased_salary,
ROUND((julianday('now') - julianday(hire_date)) / 365.25) AS years_employed,
salary / 20.0 AS daily_rate
FROM employees;