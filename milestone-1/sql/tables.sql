DROP TABLE IF EXISTS account;
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS pokemon_card;
DROP TABLE IF EXISTS pokemon_type;
DROP TABLE IF EXISTS ability;
DROP TABLE IF EXISTS attacks;

CREATE TABLE account
  ( 
     uid     DECIMAL(9, 0) NOT NULL PRIMARY KEY AUTO_INCREMENT, 
     acc_name    VARCHAR(40), NOT NULL,
     email    VARCHAR(255), NOT NULL
     usr_password    VARCHAR(255), NOT NULL
  ); 

CREATE TABLE transaction
  ( 
     tid    DECIMAL(9, 0) NOT NULL PRIMARY KEY AUTO_INCREMENT ,
     sender_id  DECIMAL(9, 0) NOT NULL,
     receiver_id DECIMAL(9, 0) NOT NULL,
     card_id VARCHAR(20), NOT NULL
     tdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY(sender_id) REFERENCES account(uid),
     FOREIGN KEY(receiver_id) REFERENCES account(uid),
     FOREIGN KEY(card_id) REFERENCES pokemon_cards(card_id),
  ); 

CREATE TABLE pokemon_card
  ( 
     card_id VARCHAR(20) NOT NULL PRIMARY KEY, 
     pname VARCHAR(50) NOT NULL, 
     set_name VARCHAR(50) NOT NULL, 
     is_custom BOOLEAN NOT NULL,
     image_url VARCHAR(255) NOT NULL,
     generation VARCHAR(50) NOT NULL,
     release_date DATE NOT NULL,
     rarity VARCHAR(50) NOT NULL,
     pokemon_type VARCHAR(20) NOT NULL,
     subtype VARCHAR(50) NOT NULL,
     hp INT NOT NULL, 
     level INT NOT NULL,
     flavour_text VARCHAR(255),
  ); 

CREATE TABLE weaknesses
  ( 
     type_name     VARCHAR(20) NOT NULL, 
     weakness     VARCHAR(10), 
     PRIMARY KEY (type_name, weakness)
  ); 

CREATE TABLE resistanaces
  ( 
     type_name     VARCHAR(20) NOT NULL, 
     resistance    VARCHAR(20) NOT NULL,
     PRIMARY KEY (type_name, resistance)
  ); 

CREATE TABLE attacks 
  ( 
    card_id VARCHAR(20) NOT NULL,
    attack_name VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    damage INT NOT NULL,
    FOREIGN KEY(card_id) REFERENCES pokemon_cards(card_id),
  ); 

CREATE TABLE ability
  ( 
    card_id VARCHAR(20) NOT NULL,
    ability_name VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY(card_id) REFERENCES pokemon_cards(card_id),
  ); 
