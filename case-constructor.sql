SELECT first_name || ' ' || last_name AS full_name,
    CASE
        WHEN salary < 50000 THEN 'Low'
        WHEN salary >= 50000 AND salary <= 75000 THEN 'Medium'
        ELSE 'High'
    END AS salary_category, 
    CASE 
        WHEN department_id BETWEEN 1 AND 5 THEN 'Core Team'
        WHEN department_id BETWEEN 6 AND 10 THEN 'Support Team'
    END AS employee_type
FROM employees ORDER BY full_name DESC;