-- Returns attributes of Pokemon cards based on type specified by user

SELECT *
FROM pokemon_cards
WHERE card_types LIKE '%Psychic%'
