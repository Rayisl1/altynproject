SELECT CASE 
    WHEN budget > 1000000 THEN UPPER(name) || ' - LARGE BUDGET'
    WHEN budget BETWEEN 700000 AND 1000000 THEN UPPER(SUBSTR(name, 1, 1)) || LOWER(SUBSTR(name, 2)) || ' - Medium Budget'
    WHEN budget < 700000 THEN LOWER(name) || ' - small budget'
END AS department_display 
FROM departments ORDER BY department_display DESC;

SELECT  UPPER(last_name) || ', ' || UPPER(first_name) || ' - ' || LOWER(position) AS employee_info FROM employees WHERE (first_name LIKE '_a%' OR first_name LIKE '_e%') AND (position LIKE '%Manager' OR position LIKE '%Analyst') 
ORDER BY employee_info ASC;

SELECT 'Product: ' || name || ' | ' || 'Price: ' || price || ' | ' || 'Rating: ' || rating
AS product_summary FROM products WHERE name LIKE '% %' AND name NOT LIKE '% % %' AND (rating > (SELECT AVG(rating) FROM products)) ORDER BY product_summary DESC;
