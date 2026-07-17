const fs = require('fs');

try {
    let html = fs.readFileSync('index.html', 'utf8');
    console.log('Original size:', html.length);
    
    // Replace <h3>...</h3> with a link, ignoring <h3> already having <a
    let countH3 = 0;
    html = html.replace(/<h3>(?!<a)(.*?)<\/h3>/g, (match, p1) => {
        countH3++;
        return `<h3><a href="chi-tiet-san-pham.html" style="color: inherit; text-decoration: none;">${p1}</a></h3>`;
    });
    console.log('Replaced h3 count:', countH3);

    // Replace product-img content
    let countImg = 0;
    html = html.replace(/(<div class="product-img">\s*)(<img[^>]+>)(\s*<\/div>)/g, (match, p1, p2, p3) => {
        countImg++;
        return `${p1}<a href="chi-tiet-san-pham.html">${p2}</a>${p3}`;
    });
    console.log('Replaced product-img count:', countImg);
    
    // Replace deal-horizontal-img content
    let countDeal = 0;
    html = html.replace(/(<div class="deal-horizontal-img">\s*)(<img[^>]+>)(\s*<\/div>)/g, (match, p1, p2, p3) => {
        countDeal++;
        return `${p1}<a href="chi-tiet-san-pham.html">${p2}</a>${p3}`;
    });
    console.log('Replaced deal-img count:', countDeal);

    fs.writeFileSync('index.html', html);
    console.log('Final size:', html.length);
    console.log('Update finished successfully');
} catch (e) {
    console.error(e);
}
