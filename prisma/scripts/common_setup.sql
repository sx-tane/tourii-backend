ALTER DATABASE tourii_backend SET timezone TO 'Asia/Tokyo';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas for development and staging
CREATE SCHEMA IF NOT EXISTS touriidev;
CREATE SCHEMA IF NOT EXISTS touriistg;


