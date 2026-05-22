-- PostgreSQL Alter Table Commands for Ingredients
-- Adds the missing language columns for English, Spanish, French, German, and Italian.

ALTER TABLE ingredients ADD COLUMN name_en VARCHAR(255);
ALTER TABLE ingredients ADD COLUMN name_es VARCHAR(255);
ALTER TABLE ingredients ADD COLUMN name_fr VARCHAR(255);
ALTER TABLE ingredients ADD COLUMN name_de VARCHAR(255);
ALTER TABLE ingredients ADD COLUMN name_it VARCHAR(255);

-- (Optional) If you have any existing ingredients, you can copy the English base name (name) into name_en for a quick fallback:
UPDATE ingredients SET name_en = name WHERE name_en IS NULL;
