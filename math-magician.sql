alter TABLE students
add test_score INTEGER;

UPDATE students
SET test_score = 90
WHERE first_name = 'Mustafa';

UPDATE students
SET test_score = 85
WHERE first_name = 'Arthur';

UPDATE students
SET test_score = 88
WHERE first_name = 'Elnar';

UPDATE students
SET test_score = 95
WHERE first_name = 'Charlotte';

UPDATE students
SET test_score = 70
WHERE first_name = 'Edmond';

UPDATE students
SET test_score = 75
WHERE first_name = 'Mercedes';

UPDATE students
SET test_score = 99
WHERE first_name = 'Albert';

select first_name, last_name, test_score, (test_score + 5) as adjusted_score from students