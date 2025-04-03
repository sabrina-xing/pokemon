-- Login/Sign Up
INSERT INTO account (username, email, usr_password) VALUES ('evan', 'evan@gmail.com', '123evan');

SELECT * FROM account WHERE email = 'evan@gmail.com';

-- User Profile
UPDATE account SET bio = 'hello world' WHERE uid = 7;

SELECT * FROM account WHERE username = 'evan';

SELECT pc.*
FROM ownership o
            JOIN pokemon_card pc ON o.card_id = pc.card_id
WHERE o.uid = 1;

-- Searching for Pokemon
SELECT pc.*, COALESCE(o.username, NULL) AS owner_username
FROM pokemon_card pc
LEFT JOIN card_owners o ON pc.card_id = o.card_id
WHERE 1=1 AND pc.card_id='base1-1';

SELECT pc.*, COALESCE(o.username, NULL) AS owner_username
FROM pokemon_card pc
LEFT JOIN card_owners o ON pc.card_id = o.card_id
WHERE 1=1
AND pokemon_type IN ('[\'Lightning\']');

-- Gift and Request Transactions
INSERT INTO transaction
(card_id, sender_id, receiver_id, tdate, t_type)
VALUES ('base1-15', 2, 1, NOW(), 'request');

-- INSERT INTO transaction
(card_id, sender_id, receiver_id, tdate, t_type)
VALUES ('base1-1', 2, 1, NOW(), 'gift');

SELECT * FROM transaction WHERE tid = 12 OR tid = 13;

UPDATE transaction SET status = 'rejected' WHERE tid = 12;

START TRANSACTION;
UPDATE ownership SET uid = 1 WHERE card_id = 'base1-1';
UPDATE transaction SET status = 'accepted' WHERE tid = 13;

SELECT * FROM transaction WHERE tid = 12 OR tid = 13;

-- Add Card
WITH owned AS (
    SELECT card_id FROM pokemon.ownership
) SELECT *
FROM pokemon.pokemon_card WHERE card_id NOT IN (
    SELECT card_id
    FROM owned
) ORDER BY RAND() LIMIT 1;
