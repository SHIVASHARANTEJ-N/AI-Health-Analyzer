-- Add hospital_phone column to appointments table
ALTER TABLE appointments ADD COLUMN hospital_phone text NOT NULL DEFAULT '+91-9999999999';