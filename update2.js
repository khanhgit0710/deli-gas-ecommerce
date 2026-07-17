const fs = require('fs');

try {
    let html = fs.readFileSync('chi-tiet-san-pham.html', 'utf8');
    
    // Replace <h3>...</h3> with a link, ignoring <h3> already having <a
    html = html.replace(/<h3>(?!<a)(.*?)<\/h3>/g, (match, p1) => {
        return `<h3><a href="chi-tiet-san-pham.html" style="color: inherit; text-decoration: none;">${p1}</a></h3>`;
    });

    // Replace product-img content
    html = html.replace(/(<div class="product-img">\s*)(<img[^>]+>)(\s*<\/div>)/g, (match, p1, p2, p3) => {
        return `${p1}<a href="chi-tiet-san-pham.html">${p2}</a>${p3}`;
    });
    
    fs.writeFileSync('chi-tiet-san-pham.html', html);
    console.log('Update chi-tiet-san-pham.html finished successfully');
} catch (e) {
    console.error(e);
}
