INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Administrador',
  'admin@imec.com.br',
  '$2a$12$7ETs6LomAfczQ6LchY18FeFWA..GQ.2z04Qgmm26cOk8CDMQfgwNy',
  'admin'
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role);
