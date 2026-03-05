SELECT rating, AVG(price) AS avg_price, SUM(quantity) AS total_quantity 
FROM products
GROUP BY rating ORDER BY rating DESC;