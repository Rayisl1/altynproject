SELECT first_name, last_name
FROM students
WHERE test_score BETWEEN 80 AND 90
ORDER BY last_name ASC;

SELECT first_name, last_name
FROM students
WHERE student_id IN (1, 3, 5)
ORDER BY last_name ASC;