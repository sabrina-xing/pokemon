import pandas as pd
import ast

# Load the datasets
tcg_data = pd.read_csv("./kaggle_data/pokemon-tcg-data-master 1999-2023.csv", dtype=str)  # Official Pokémon cards
cards_data = pd.read_csv("./kaggle_data/pokemon-cards.csv", dtype=str)  # User-created Pokémon cards

# Fill missing values
tcg_data.fillna("", inplace=True)
cards_data.fillna("", inplace=True)

# ---------------------------- #
# Extracting Data for pokemon_card Table
# ---------------------------- #

# Select only the relevant columns for pokemon_card table
tcg_columns = {
    "id": "card_id",
    "name": "pname",
    "set": "set_name",
    "series": "generation",
    "release_date": "release_date",
    "rarity": "rarity",
    "types": "pokemon_type",
    "subtypes": "subtype",
    "hp": "hp",
    "level": "level",
    "flavorText": "flavour_text"
}

# Keep only required columns and rename them
tcg_data = tcg_data[list(tcg_columns.keys())].rename(columns=tcg_columns)

# Set is_custom to False for official cards
tcg_data["is_custom"] = False

# Merge image URLs from user-created cards
cards_data = cards_data.rename(columns={"id": "card_id", "image_url": "image_url"})
merged_data = pd.merge(tcg_data, cards_data[["card_id", "image_url"]], on="card_id", how="left", suffixes=("", "_custom"))

# Ensure correct column order
pokemon_card_columns = [
    "card_id", "pname", "set_name", "is_custom", "image_url", "generation", 
    "release_date", "rarity", "pokemon_type", "subtype", "hp", "level", "flavour_text"
]
pokemon_card = merged_data[pokemon_card_columns]

# Remove rows with NULL (empty) values in any column
pokemon_card.replace("", None, inplace=True)  # Convert empty strings to None
pokemon_card.dropna(inplace=True)  # Drop rows where any column is NULL

# Save to CSV
pokemon_card.to_csv("pokemon_card_production_1.csv", index=False)

print("Cleaned pokemon_card.csv has been created successfully!")

# ---------------------------- #
# Extracting Data for Abilities, Attacks, Weaknesses, and Resistances
# ---------------------------- #

# Filter original dataset to only keep valid pokemon_card entries
valid_card_ids = set(pokemon_card["card_id"])

# Reload the datasets
tcg_data = pd.read_csv("./kaggle_data/pokemon-tcg-data-master 1999-2023.csv", dtype=str)  # Official Pokémon cards

# Function to safely parse lists from strings
def safe_parse_list(value):
    if isinstance(value, float):  # Handle NaN values
        return []
    try:
        parsed_value = ast.literal_eval(value)  # Convert string representation to actual list
        return parsed_value if isinstance(parsed_value, list) else []
    except:
        return []

# Abilities
if "abilities" in tcg_data.columns:
    abilities = tcg_data[["id", "abilities"]].copy()
    abilities.columns = ["card_id", "abilities"]
    abilities["abilities"] = abilities["abilities"].astype(str).apply(safe_parse_list)  # Convert to list
    
    ability_list = []
    for _, row in abilities.iterrows():
        if row["card_id"] in valid_card_ids:  # Only keep abilities for valid cards
            for ability in row["abilities"]:
                ability_list.append([row["card_id"], ability["name"], ability.get("text", "")])
    
    abilities_df = pd.DataFrame(ability_list, columns=["card_id", "ability_name", "description"])
    abilities_df.to_csv("abilities.csv", index=False)

# Attacks
if "attacks" in tcg_data.columns:
    attacks = tcg_data[["id", "attacks"]].copy()
    attacks.columns = ["card_id", "attacks"]
    attacks["attacks"] = attacks["attacks"].astype(str).apply(safe_parse_list)
    
    attack_list = []
    for _, row in attacks.iterrows():
        if row["card_id"] in valid_card_ids:  # Only keep attacks for valid cards
            for attack in row["attacks"]:
                attack_list.append([row["card_id"], attack["name"], attack.get("text", ""), attack.get("damage", "0")])
    
    attacks_df = pd.DataFrame(attack_list, columns=["card_id", "attack_name", "description", "damage"])
    attacks_df.to_csv("attacks.csv", index=False)

# Weaknesses
if "weaknesses" in tcg_data.columns and "types" in tcg_data.columns:
    weaknesses = tcg_data[["id", "types", "weaknesses"]].copy()
    weaknesses.columns = ["card_id", "type_name", "weakness"]
    weaknesses["weakness"] = weaknesses["weakness"].astype(str).apply(safe_parse_list)
    
    weakness_list = []
    for _, row in weaknesses.iterrows():
        if row["card_id"] in valid_card_ids:  # Only keep weaknesses for valid cards
            for weakness in row["weakness"]:
                weakness_list.append([row["type_name"], weakness])
    
    weaknesses_df = pd.DataFrame(weakness_list, columns=["type_name", "weakness"])
    weaknesses_df.to_csv("weaknesses.csv", index=False)

# Resistances
if "resistances" in tcg_data.columns and "types" in tcg_data.columns:
    resistances = tcg_data[["id", "types", "resistances"]].copy()
    resistances.columns = ["card_id", "type_name", "resistance"]
    resistances["resistance"] = resistances["resistance"].astype(str).apply(safe_parse_list)
    
    resistance_list = []
    for _, row in resistances.iterrows():
        if row["card_id"] in valid_card_ids:  # Only keep resistances for valid cards
            for resistance in row["resistance"]:
                resistance_list.append([row["type_name"], resistance])
    
    resistances_df = pd.DataFrame(resistance_list, columns=["type_name", "resistance"])
    resistances_df.to_csv("resistances.csv", index=False)

print("All CSV files have been successfully created!")
