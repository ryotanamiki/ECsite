const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = 3000;
const session = require('express-session');

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
}));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'ec_db'
});

// cssファイルの取得
app.use(express.static('assets'));

app.get('/', (req, res) => {
    const sortOption = req.query.sort;

    let orderBy = 'product_price DESC';

    switch (sortOption) {
        case 'price-high':
            orderBy = 'product_price DESC';
            break;
        case 'price-low':
            orderBy = 'product_price ASC';
            break;
        case 'name-az':
            orderBy = 'product_name ASC';
            break;
        case 'review-rating':
            orderBy = 'avg_rating DESC';
            break;
        case 'review-rating-low':
            orderBy = 'avg_rating ASC';
            break;
        case 'review-count':
            orderBy = 'review_count DESC';
            break;
    }

//商品ページ
const sql = `
    SELECT
        products.id AS product_id,
        products.name AS product_name,
        CAST(products.price AS SIGNED) AS product_price,
        products.imgUrl AS product_imgUrl,
        CAST(AVG(reviews.evaluation) AS SIGNED) AS avg_rating,
        COUNT(reviews.id) AS review_count
    FROM products
    LEFT JOIN reviews ON products.id = reviews.itemId
    GROUP BY products.id, products.name, CAST(products.price AS SIGNED), products.imgUrl
    ORDER BY ${orderBy}
`;

    con.query(sql, (err, results) => {
        if (err) {
            console.error('SQLエラー:', err);
            res.status(500).send('サーバーエラーが発生しました');
            return;
        }
        res.render('index', { products: results });
    });
});

const productQuery = `
    SELECT
        products.id AS product_id,
        products.name AS product_name,
        CAST(products.price AS SIGNED) AS product_price,
        products.imgUrl AS product_imgUrl
    FROM products
    WHERE products.id = ?
`;

const reviewQuery = `
    SELECT
        reviews.userId,
        reviews.evaluation,
        reviews.content
    FROM reviews
    WHERE reviews.itemId = ?
`;
//商品詳細ページ
app.get('/:productId', (req, res) => {
    const productId = req.params.productId;
    const sortOption = req.query.sort;


    con.query(productQuery, [productId], (err, productResult) => {
        if (err) {
            console.error('商品情報の取得エラー:', err);
            res.status(500).send('サーバーエラーが発生しました');
            return;
        }

        if (productResult.length === 0) {
            res.status(404).send('商品が見つかりません');
            return;
        }

        con.query(reviewQuery, [productId], (err, reviewResults) => {
            if (err) {
                console.error('レビュー情報の取得エラー:', err);
                res.status(500).send('サーバーエラーが発生しました');
                return;
            }
            if (sortOption === 'high-rating') {
                reviewResults.sort((a, b) => b.evaluation - a.evaluation);
            } else if (sortOption === 'low-rating') {
                reviewResults.sort((a, b) => a.evaluation - b.evaluation);
            }

            res.render('productDetail', {
                product: productResult[0],
                reviews: reviewResults,
            });
        });
    });
});

//カートに商品を追加
const cartItems = [];

// 商品をカートに追加するルート
app.post('/addToCart', (req, res) => {
    const productId = req.body.productId;

    const sql = `
        SELECT
            products.id AS product_id,
            products.name AS product_name,
            CAST(products.price AS SIGNED) AS product_price,
            products.imgUrl AS product_imgUrl
        FROM products
        WHERE products.id = ?
    `;

    con.query(sql, [productId], (err, productResult) => {
        if (err) {
            console.error('商品情報の取得エラー:', err);
            res.status(500).send('サーバーエラーが発生しました');
            return;
        }

        if (productResult.length === 0) {
            res.status(404).send('商品が見つかりません');
            return;
        }

        // カートに商品を追加
        cartItems.push(productResult[0]);

        // カートページを表示
        res.render('cart', {
            cartItems: cartItems,
            totalAmount: calculateTotalAmount(cartItems),
        });
    });
});

// カートから商品を削除するルート
app.post('/removeFromCart', (req, res) => {
    const productId = req.body.productId;

    const updatedCartItems = cartItems.filter(item => item.product_id !== parseInt(productId)); // 商品IDを整数に変換して比較

    res.render('cart', {
        cartItems: updatedCartItems,
        totalAmount: calculateTotalAmount(updatedCartItems),
    });
});

function calculateTotalAmount(cartItems) {
    let total = 0;
    cartItems.forEach(item => {
        total += item.product_price;
    });
    return total;
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

