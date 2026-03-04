SELECT first_name || ' ' || last_name AS full_name, SUBSTR(email, INSTR(email, '@') + 1) AS email_domain, UPPER(position) AS job_title FROM employees ORDER BY full_name ASC;
