CREATE TABLE IF NOT EXISTS halls (
    id SERIAL PRIMARY KEY, 
    hall_title VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS films (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    release_date INT NOT NULL,
    poster_title VARCHAR(255) NOT NULL,
    synopsis TEXT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    for_registration BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS chair_types (
    id SERIAL PRIMARY KEY, 
    "type" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS hall_chairs (
    id_seat INT NOT NULL,
    hall_id INT NOT NULL,
    FOREIGN KEY (hall_id) REFERENCES halls (id),
    hall_title VARCHAR(50) NOT NULL,
    row_number INT NOT NULL,
    seat_number INT NOT NULL,
    chair_type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    hall_id INT NOT NULL,
    FOREIGN KEY (hall_id) REFERENCES halls (id),
    hall_title VARCHAR(20) NOT NULL,
    session_date DATE NOT NULL,
    session_start TIME NOT NULL,
    session_finish TIME NOT NULL,
    film_id INT NULL
);

CREATE TABLE IF NOT EXISTS hall_chairs_of_session (
    id_seat INT NOT NULL,
    hall_id INT NOT NULL,
    FOREIGN KEY (hall_id) REFERENCES halls (id),
    hall_title VARCHAR(50) NOT NULL,
    row_number INT NOT NULL,
    seat_number INT NOT NULL,
    chair_type VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    session_id INT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions (id),
    check_is_buying BOOLEAN DEFAULT false
);