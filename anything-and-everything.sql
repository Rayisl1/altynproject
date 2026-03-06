SELECT product_id, name, price
FROM products
WHERE price > (
    SELECT MIN(price)
    FROM products
    WHERE rating BETWEEN 4.5 AND 4.6
)
ORDER BY price DESC;
SELECT product_id, name, price
FROM products
WHERE price > (
    SELECT MAX(price)
    FROM products
    WHERE rating BETWEEN 4.1 AND 4.2
)
ORDER BY price DESC;