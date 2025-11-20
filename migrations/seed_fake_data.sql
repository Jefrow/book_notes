-- Seed fake data for testing/demo purposes
-- This script adds sample users, books, authors, reviews, and user library entries

-- Note: Passwords are hashed versions of "password123456" (12 chars minimum)
-- You can use these credentials to log in:
-- alice@example.com / password123456
-- bob@example.com / password123456
-- carol@example.com / password123456

BEGIN;

-- Insert sample users (password: "password123456")
INSERT INTO users (user_email, password) VALUES
('alice@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.8D8K1e'),
('bob@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.8D8K1e'),
('carol@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.8D8K1e'),
('david@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.8D8K1e'),
('emma@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIr.8D8K1e')
ON CONFLICT (user_email) DO NOTHING;

-- Get user IDs (assuming they start from a certain number, adjust if needed)
DO $$
DECLARE
    alice_id INTEGER;
    bob_id INTEGER;
    carol_id INTEGER;
    david_id INTEGER;
    emma_id INTEGER;
BEGIN
    SELECT user_id INTO alice_id FROM users WHERE user_email = 'alice@example.com';
    SELECT user_id INTO bob_id FROM users WHERE user_email = 'bob@example.com';
    SELECT user_id INTO carol_id FROM users WHERE user_email = 'carol@example.com';
    SELECT user_id INTO david_id FROM users WHERE user_email = 'david@example.com';
    SELECT user_id INTO emma_id FROM users WHERE user_email = 'emma@example.com';

    -- Insert sample authors
    INSERT INTO authors (author_name) VALUES
    ('J.K. Rowling'),
    ('George Orwell'),
    ('F. Scott Fitzgerald'),
    ('Jane Austen'),
    ('J.R.R. Tolkien'),
    ('Agatha Christie'),
    ('Stephen King'),
    ('Isaac Asimov'),
    ('Margaret Atwood'),
    ('Gabriel García Márquez')
    ON CONFLICT (author_name) DO NOTHING;

    -- Insert sample books with ISBNs
    INSERT INTO book (book_title, author_id, book_cover_url, book_summary, isbn, data_source, added_by_user_id) VALUES
    (
        'Harry Potter and the Sorcerer''s Stone',
        (SELECT author_id FROM authors WHERE author_name = 'J.K. Rowling'),
        'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
        'A young wizard discovers his magical heritage on his 11th birthday.',
        '9780439708180',
        'openlibrary',
        alice_id
    ),
    (
        '1984',
        (SELECT author_id FROM authors WHERE author_name = 'George Orwell'),
        'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
        'A dystopian social science fiction novel about totalitarianism.',
        '9780451524935',
        'openlibrary',
        bob_id
    ),
    (
        'The Great Gatsby',
        (SELECT author_id FROM authors WHERE author_name = 'F. Scott Fitzgerald'),
        'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
        'A classic American novel about the Jazz Age and the American Dream.',
        '9780743273565',
        'openlibrary',
        carol_id
    ),
    (
        'Pride and Prejudice',
        (SELECT author_id FROM authors WHERE author_name = 'Jane Austen'),
        'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
        'A romantic novel of manners set in Georgian England.',
        '9780141439518',
        'openlibrary',
        alice_id
    ),
    (
        'The Hobbit',
        (SELECT author_id FROM authors WHERE author_name = 'J.R.R. Tolkien'),
        'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
        'A fantasy novel about the adventures of Bilbo Baggins.',
        '9780547928227',
        'openlibrary',
        david_id
    ),
    (
        'Murder on the Orient Express',
        (SELECT author_id FROM authors WHERE author_name = 'Agatha Christie'),
        'https://covers.openlibrary.org/b/isbn/9780062693662-L.jpg',
        'A detective novel featuring Hercule Poirot.',
        '9780062693662',
        'openlibrary',
        bob_id
    ),
    (
        'The Shining',
        (SELECT author_id FROM authors WHERE author_name = 'Stephen King'),
        'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg',
        'A horror novel about a family isolated in a haunted hotel.',
        '9780307743657',
        'openlibrary',
        emma_id
    ),
    (
        'Foundation',
        (SELECT author_id FROM authors WHERE author_name = 'Isaac Asimov'),
        'https://covers.openlibrary.org/b/isbn/9780553293357-L.jpg',
        'A science fiction novel about the fall and rise of galactic civilization.',
        '9780553293357',
        'openlibrary',
        carol_id
    ),
    (
        'The Handmaid''s Tale',
        (SELECT author_id FROM authors WHERE author_name = 'Margaret Atwood'),
        'https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg',
        'A dystopian novel about a totalitarian society.',
        '9780385490818',
        'openlibrary',
        david_id
    ),
    (
        'One Hundred Years of Solitude',
        (SELECT author_id FROM authors WHERE author_name = 'Gabriel García Márquez'),
        'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg',
        'A landmark novel in magical realism telling the story of the Buendía family.',
        '9780060883287',
        'openlibrary',
        emma_id
    )
    ON CONFLICT (book_title, author_id) DO NOTHING;

    -- Insert sample reviews (multiple reviews per book from different users)
    INSERT INTO reviews (user_id, book_id, review_text, rating) VALUES
    -- Harry Potter reviews
    (alice_id, (SELECT book_id FROM book WHERE book_title = 'Harry Potter and the Sorcerer''s Stone'), 'An enchanting start to a magical journey! The world-building is incredible and the characters are so lovable. A must-read for all ages.', 5),
    (bob_id, (SELECT book_id FROM book WHERE book_title = 'Harry Potter and the Sorcerer''s Stone'), 'Great introduction to the wizarding world. Some parts felt a bit slow, but overall a fantastic read that got me hooked on the series.', 4),
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'Harry Potter and the Sorcerer''s Stone'), 'Magical storytelling at its finest. Rowling creates a world you never want to leave.', 5),

    -- 1984 reviews
    (bob_id, (SELECT book_id FROM book WHERE book_title = '1984'), 'Chillingly relevant even today. Orwell''s vision of a dystopian future is both terrifying and thought-provoking. A masterpiece.', 5),
    (alice_id, (SELECT book_id FROM book WHERE book_title = '1984'), 'Heavy and dark, but incredibly important. The themes resonate strongly in our current age. Everyone should read this.', 5),
    (david_id, (SELECT book_id FROM book WHERE book_title = '1984'), 'A stark warning about totalitarianism. Depressing but essential reading.', 4),

    -- The Great Gatsby reviews
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'The Great Gatsby'), 'Beautiful prose and a timeless story about the American Dream. Fitzgerald''s writing is absolutely stunning.', 5),
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'The Great Gatsby'), 'A classic for a reason. The symbolism and character development are exceptional.', 4),

    -- Pride and Prejudice reviews
    (alice_id, (SELECT book_id FROM book WHERE book_title = 'Pride and Prejudice'), 'Elizabeth Bennet is one of my favorite characters ever. The wit and romance are perfectly balanced. A timeless classic!', 5),
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'Pride and Prejudice'), 'Austen''s social commentary wrapped in a delightful romance. The dialogue sparkles.', 5),
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'Pride and Prejudice'), 'Charming and witty. Took me a while to get into the language, but worth it.', 4),

    -- The Hobbit reviews
    (david_id, (SELECT book_id FROM book WHERE book_title = 'The Hobbit'), 'An adventure that captures the imagination! Perfect for readers of all ages. Tolkien''s world-building is unmatched.', 5),
    (bob_id, (SELECT book_id FROM book WHERE book_title = 'The Hobbit'), 'A charming tale that sets the stage for LOTR. Great characters and memorable journey.', 4),

    -- Murder on the Orient Express reviews
    (bob_id, (SELECT book_id FROM book WHERE book_title = 'Murder on the Orient Express'), 'Christie at her best! The twist ending is brilliantly executed. A masterclass in mystery writing.', 5),
    (alice_id, (SELECT book_id FROM book WHERE book_title = 'Murder on the Orient Express'), 'Engaging mystery with a clever solution. Poirot is delightful as always.', 4),

    -- The Shining reviews
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'The Shining'), 'Genuinely terrifying! King''s psychological horror is masterful. Couldn''t put it down despite being scared.', 5),
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'The Shining'), 'Atmospheric and creepy. The isolation and descent into madness are brilliantly portrayed.', 4),

    -- Foundation reviews
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'Foundation'), 'Epic in scope and vision. Asimov''s ideas about psychohistory are fascinating. Essential sci-fi.', 5),
    (david_id, (SELECT book_id FROM book WHERE book_title = 'Foundation'), 'Groundbreaking science fiction. The scope is impressive though some characters feel distant.', 4),

    -- The Handmaid''s Tale reviews
    (david_id, (SELECT book_id FROM book WHERE book_title = 'The Handmaid''s Tale'), 'Disturbing and powerful. Atwood''s dystopia feels uncomfortably possible. A haunting read.', 5),
    (alice_id, (SELECT book_id FROM book WHERE book_title = 'The Handmaid''s Tale'), 'Brilliant and terrifying feminist dystopia. The writing is beautiful despite the dark subject matter.', 5),

    -- One Hundred Years of Solitude reviews
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'One Hundred Years of Solitude'), 'Magical realism at its finest. The prose is beautiful and the story is mesmerizing, though sometimes confusing.', 4),
    (bob_id, (SELECT book_id FROM book WHERE book_title = 'One Hundred Years of Solitude'), 'A sweeping epic that blends reality and fantasy beautifully. Required some patience but rewarding.', 4)
    ON CONFLICT (user_id, book_id) DO NOTHING;

    -- Add books to user libraries with favorites and read status
    INSERT INTO user_library (user_id, book_id, is_favorite, read_status) VALUES
    -- Alice's library
    (alice_id, (SELECT book_id FROM book WHERE book_title = 'Harry Potter and the Sorcerer''s Stone'), true, 'read'),
    (alice_id, (SELECT book_id FROM book WHERE book_title = 'Pride and Prejudice'), true, 'read'),
    (alice_id, (SELECT book_id FROM book WHERE book_title = '1984'), false, 'reading'),
    (alice_id, (SELECT book_id FROM book WHERE book_title = 'The Handmaid''s Tale'), true, 'want_to_read'),

    -- Bob's library
    (bob_id, (SELECT book_id FROM book WHERE book_title = '1984'), true, 'read'),
    (bob_id, (SELECT book_id FROM book WHERE book_title = 'Murder on the Orient Express'), true, 'read'),
    (bob_id, (SELECT book_id FROM book WHERE book_title = 'The Hobbit'), false, 'reading'),
    (bob_id, (SELECT book_id FROM book WHERE book_title = 'One Hundred Years of Solitude'), false, 'want_to_read'),

    -- Carol's library
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'The Great Gatsby'), true, 'read'),
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'Foundation'), true, 'read'),
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'The Shining'), false, 'read'),
    (carol_id, (SELECT book_id FROM book WHERE book_title = 'Pride and Prejudice'), true, 'want_to_read'),

    -- David's library
    (david_id, (SELECT book_id FROM book WHERE book_title = 'The Hobbit'), true, 'read'),
    (david_id, (SELECT book_id FROM book WHERE book_title = 'The Handmaid''s Tale'), true, 'read'),
    (david_id, (SELECT book_id FROM book WHERE book_title = '1984'), false, 'reading'),
    (david_id, (SELECT book_id FROM book WHERE book_title = 'Foundation'), false, 'want_to_read'),

    -- Emma's library
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'The Shining'), true, 'read'),
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'One Hundred Years of Solitude'), true, 'read'),
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'The Great Gatsby'), false, 'reading'),
    (emma_id, (SELECT book_id FROM book WHERE book_title = 'Pride and Prejudice'), true, 'want_to_read')
    ON CONFLICT (user_id, book_id) DO NOTHING;

END $$;

COMMIT;

-- Display summary
SELECT 'Fake data seeded successfully!' as message;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_authors FROM authors;
SELECT COUNT(*) as total_books FROM book;
SELECT COUNT(*) as total_reviews FROM reviews;
SELECT COUNT(*) as total_library_entries FROM user_library;
