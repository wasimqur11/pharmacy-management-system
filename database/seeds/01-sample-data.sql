-- Insert sample data for development/testing

-- Insert sample users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@pharmacy.com', '$2b$10$YourHashedPasswordHere', 'Admin', 'User', '+1234567890', 'admin', true),
('550e8400-e29b-41d4-a716-446655440002', 'doctor@pharmacy.com', '$2b$10$YourHashedPasswordHere', 'Dr. John', 'Smith', '+1234567891', 'doctor', true),
('550e8400-e29b-41d4-a716-446655440003', 'pharmacist@pharmacy.com', '$2b$10$YourHashedPasswordHere', 'Jane', 'Doe', '+1234567892', 'pharmacist', true),
('550e8400-e29b-41d4-a716-446655440004', 'patient@test.com', '$2b$10$YourHashedPasswordHere', 'Alice', 'Johnson', '+1234567893', 'patient', true),
('550e8400-e29b-41d4-a716-446655440005', 'partner@pharmacy.com', '$2b$10$YourHashedPasswordHere', 'Robert', 'Brown', '+1234567894', 'partner', true);

-- Insert sample doctors
INSERT INTO doctors (id, specialization, license_number, consultation_fee, is_available) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'General Medicine', 'MD123456', 500.00, true);

-- Insert sample staff
INSERT INTO staff (id, employee_id, department, salary, hire_date) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'EMP001', 'Pharmacy', 25000.00, '2024-01-01');

-- Insert sample patients
INSERT INTO patients (id, date_of_birth, address, emergency_contact, medical_history) VALUES
('550e8400-e29b-41d4-a716-446655440004', '1990-05-15', '123 Main St, City, State', '+1234567895', 'No known allergies');

-- Insert sample partners
INSERT INTO partners (id, profit_share_percentage, investment_amount, join_date) VALUES
('550e8400-e29b-41d4-a716-446655440005', 25.00, 100000.00, '2024-01-01');

-- Insert sample distributors
INSERT INTO distributors (name, contact_person, email, phone, address, credit_limit, settlement_percentage, settlement_day) VALUES
('MediSupply Co.', 'John Manager', 'contact@medisupply.com', '+1234567896', '456 Supply St, City, State', 50000.00, 15.00, 1),
('HealthCorp Distribution', 'Sarah Director', 'info@healthcorp.com', '+1234567897', '789 Health Ave, City, State', 75000.00, 12.50, 3);

-- Insert sample product categories and products
INSERT INTO products (name, description, sku, category, manufacturer, cost_price, selling_price, stock_quantity, min_stock_level) VALUES
('Paracetamol 500mg', 'Pain relief and fever reducer', 'PARA500-001', 'Analgesics', 'PharmaCorp', 2.50, 5.00, 1000, 100),
('Amoxicillin 250mg', 'Antibiotic for bacterial infections', 'AMOX250-001', 'Antibiotics', 'MediLab', 8.00, 15.00, 500, 50),
('Vitamin C 1000mg', 'Vitamin C supplement', 'VITC1000-001', 'Vitamins', 'HealthPlus', 3.00, 8.00, 800, 100),
('Cough Syrup 100ml', 'Relief from cough and cold', 'COUGH100-001', 'Cough & Cold', 'ReliefMed', 12.00, 25.00, 200, 20),
('Blood Pressure Monitor', 'Digital BP monitoring device', 'BPM-001', 'Medical Devices', 'TechMed', 1500.00, 2500.00, 50, 5);

-- Note: In a real application, password hashes would be properly generated
-- For development, you might want to use a tool to generate proper bcrypt hashes