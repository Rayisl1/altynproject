SELECT first_name, last_name, salary, department_id
FROM employees ORDER BY department_id ASC, salary DESC, last_name ASC;
SELECT name, price, rating FROM products ORDER BY rating DESC, price DESC;
SELECT name, price, rating, quantity FROM products ORDER BY rating DESC, price ASC, quantity DESC;