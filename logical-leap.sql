select first_name, last_name, email from students
WHERE test_score > 85 and enrollment_date between '1900-01-01' and '2023-10-01'
order by first_name desc