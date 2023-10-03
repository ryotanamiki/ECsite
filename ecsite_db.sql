-- Active: 1695798624080@@localhost@3306
CREATE DATABASE
    ec_db CHARACTER SET = 'utf8mb4';

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

ALTER TABLE products
ADD COLUMN imgUrl VARCHAR(255);

INSERT INTO products (id, name, price) VALUES
(1, 'product01', '3980'),
(2, 'product02', '3980'),
(3, 'product03', '4980'),
(4, 'product04', '2980'),
(5, 'product05', '9980'),
(6, 'product06', '3980'),
(7, 'product07', '5980'),
(8, 'product08', '7980'),
(9, 'product09', '5980'),
(10, 'product10', '12980')
;

UPDATE products SET imgUrl = CASE
    WHEN id = 1 THEN 'images/product01.jpg'
    WHEN id = 2 THEN 'images/product02.jpg'
    WHEN id = 3 THEN 'images/product03.jpg'
    WHEN id = 4 THEN 'images/product04.jpg'
    WHEN id = 5 THEN 'images/product05.jpg'
    WHEN id = 6 THEN 'images/product06.jpg'
    WHEN id = 7 THEN 'images/product07.jpg'
    WHEN id = 8 THEN 'images/product08.jpg'
    WHEN id = 9 THEN 'images/product09.jpg'
    WHEN id = 10 THEN 'images/product10.jpg'
    ELSE imgUrl
END
WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

UPDATE products SET `imgUrl` = 'images/product01.jpg' WHERE id = 1;
---------------------------------------------------------------

CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    itemId INT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    content TEXT,
    evaluation INT CHECK (evaluation >= 1 AND evaluation <= 5)
);

INSERT INTO reviews (itemId, userId, content, evaluation) VALUES
(1, '山田太郎', '素早い対応が好印象でした', 5),
(2, '佐藤花子', '商品の品質には満足していますが、配送が少し遅かったです', 4),
(3, '鈴木一郎', '商品の品揃えが豊富で、いつも利用しています', 5),
(4, '田中美香', '商品の情報が不足しており、購入に迷いました', 3),
(5, '伊藤健太', '親切なカスタマーサポートで助かりました', 5),
(6, '渡辺あやか', '商品の品質が素晴らしく、大満足です', 5),
(7, '山口直人', '価格設定が適切で、満足しています', 4),
(8, '高橋明子', 'ウェブサイトの操作がわかりにくかったです', 2),
(9, '加藤雅人', '商品の発送が迅速で、安心しました', 3),
(10, '小林真理子', '問い合わせへの対応が迅速で、満足しています', 5)
;
INSERT INTO reviews (itemId, userId, content, evaluation) VALUES
(1, '斎藤忠', '値段の割に記事も良さげした', 3);