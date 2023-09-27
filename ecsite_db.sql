-- Active: 1695798624080@@localhost@3306@EC_db
CREATE TABLE table_name-- Active: 1695272844337@@localhost@3306
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (name, price) VALUES
('商品1', 1000.00),
('商品2', 1500.00),
('商品3', 2000.00),
-- 他の商品を追加
;


CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    itemId INT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    content TEXT,
    evaluation INT CHECK (evaluation >= 1 AND evaluation <= 5)
);

INSERT INTO reviews (itemId, userId, content, evaluation) VALUES
(1, 'ユーザー1', 'とても良い商品です。', 5),
(1, 'ユーザー2', '普通の商品です。', 3),
(2, 'ユーザー1', '良い価格です。', 4),
-- 他のレビューを追加
;
(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT COMMENT 'Primary Key',
    create_time DATETIME COMMENT 'Create Time',
    name VARCHAR(255)
) COMMENT '';