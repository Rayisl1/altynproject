SELECT name, ABS(quantity - 100) AS quantity_diff,
ROUND(price) AS rounded_price,
rating * 20 AS rating_percent,
max(price, 50) AS price_or_50,
min(quantity, 200) AS quantity_cap,
price * quantity AS total_value
FROM products;