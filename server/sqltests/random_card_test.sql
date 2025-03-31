-- Picking a new random card
WITH owned AS 
(
    SELECT card_id 
    FROM ownership
)
SELECT * 
FROM pokemon_card 
WHERE card_id NOT IN (
    SELECT card_id 
    FROM owned
) 
ORDER BY RAND() 
LIMIT 1;




