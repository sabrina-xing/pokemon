START TRANSACTION; 
INSERT INTO ownership (uid, card_id) VALUES (%s,%s); 
COMMIT;