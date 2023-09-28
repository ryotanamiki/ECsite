const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = 3000;

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

//商品ページ
app.get('/', (req, res) => {
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


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
