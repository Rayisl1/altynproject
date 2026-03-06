SELECT rating, total_quantity, average_price
FROM (
    SELECT 
        rating,
        SUM(quantity) AS total_quantity,
        ROUND(AVG(price), 2) AS average_price
    FROM products
    GROUP BY rating
) AS rating_stats
WHERE total_quantity > 500
ORDER BY rating DESC;