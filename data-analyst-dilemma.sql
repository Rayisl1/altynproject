SELECT rating, SUM(price * quantity) AS total_inventory_value, 
ROUND(AVG(rating), 1) AS average_rating FROM products 
GROUP BY rating 
HAVING SUM(price * quantity) > 20000 AND ROUND(AVG(rating), 1) < (SELECT ROUND(AVG(rating), 1) + 50000 FROM products)
ORDER BY total_inventory_value DESC;