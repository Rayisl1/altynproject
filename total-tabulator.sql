SELECT rating, ROUND(SUM(price * quantity), 1) AS total_value FROM products
GROUP BY rating ORDER BY total_value DESC;