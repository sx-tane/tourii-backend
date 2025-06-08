-- ALTER DATABASE tourii_backend SET timezone TO 'Asia/Tokyo' IF EXISTS;
ALTER DATABASE postgres SET timezone TO 'Asia/Tokyo';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

