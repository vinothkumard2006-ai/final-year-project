USE network_monitoring_db;

INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2b$12$WbO0W2GQ1fQzM5wQ6sP9qe4QvBq4GHFz2jT0u7pUM7MnR3s9YJbY.', 'ADMIN'),
('analyst', '$2b$12$WbO0W2GQ1fQzM5wQ6sP9qe4QvBq4GHFz2jT0u7pUM7MnR3s9YJbY.', 'ANALYST'),
('viewer', '$2b$12$WbO0W2GQ1fQzM5wQ6sP9qe4QvBq4GHFz2jT0u7pUM7MnR3s9YJbY.', 'VIEWER');

INSERT INTO devices (ip, mac, status, risk_score) VALUES
('192.168.1.10', 'AA:BB:CC:10', 'ACTIVE', 0.2),
('192.168.1.44', 'AA:BB:CC:44', 'SUSPICIOUS', 0.9),
('192.168.1.12', 'AA:BB:CC:12', 'ACTIVE', 0.5);

INSERT INTO network_flows (source_ip, destination_ip, protocol, packet_count, byte_count) VALUES
('192.168.1.10', '10.0.0.15', 'TCP', 40, 1800),
('192.168.1.44', '10.0.0.20', 'UDP', 18, 900),
('192.168.1.12', '10.0.0.9', 'ICMP', 12, 320);

INSERT INTO threats (source_ip, severity, description, score) VALUES
('192.168.1.44', 'HIGH', 'Suspicious scan pattern', 0.91),
('192.168.1.12', 'MEDIUM', 'DNS tunneling suspicion', 0.83);

INSERT INTO alerts (title, severity, message) VALUES
('Suspicious scan', 'HIGH', 'Unusual scan pattern detected');

INSERT INTO incidents (title, severity, status) VALUES
('Lateral movement', 'HIGH', 'OPEN');

INSERT INTO risk_scores (score, summary) VALUES
(67.5, 'Elevated');

INSERT INTO system_settings (key_name, value_text) VALUES
('retention_days', '2'),
('demo_mode', 'true');
