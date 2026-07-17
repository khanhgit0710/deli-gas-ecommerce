const fs = require('fs');

const categories = [
    { id: 'cat-saigon-petro', name: 'Gas Saigon Petro', count: 124 },
    { id: 'cat-petrolimex', name: 'Gas Petrolimex', count: 85 },
    { id: 'cat-gia-dinh', name: 'Gas Gia Đình', count: 96 },
    { id: 'cat-thu-duc', name: 'Gas Thủ Đức', count: 42 },
    { id: 'cat-elf', name: 'Gas Elf', count: 35 },
    { id: 'cat-bep-hong-ngoai', name: 'Bếp Gas Hồng Ngoại', count: 156 },
    { id: 'cat-bep-am', name: 'Bếp Gas Âm', count: 210 },
    { id: 'cat-phu-kien', name: 'Phụ kiện (Van, Dây)', count: 340 }
];

function generateProductCard(catName, index) {
    const isNew = index % 3 === 0;
    const isSale = index % 4 === 1;
    let badge = '';
    if (isNew) badge = `<div class="product-badge" style="background-color: var(--color-accent); color: var(--color-gray-900);">Mới</div>`;
    else if (isSale) badge = `<div class="product-badge">Giảm 10%</div>`;

    const price = 300000 + (index * 15000);
    const oldPrice = price + 50000;

    return `
                        <div class="product-card">
                            ${badge}
                            <div class="product-img">
                                <a href="chi-tiet-san-pham.html"><img src="https://placehold.co/300x300/f8f9fa/f44531?text=${encodeURIComponent(catName)}+${index + 1}" alt="${catName} ${index + 1}"></a>
                            </div>
                            <div class="product-info">
                                <h3><a href="chi-tiet-san-pham.html" style="color: inherit; text-decoration: none;">Sản phẩm ${catName} ${index + 1}</a></h3>
                                <div class="product-price">
                                    <span class="price-current">${price.toLocaleString('vi-VN')}đ</span>
                                    ${isSale ? `<span class="price-old">${oldPrice.toLocaleString('vi-VN')}đ</span>` : ''}
                                </div>
                                <div class="product-actions">
                                    <button class="buy-now-btn">Mua ngay</button>
                                    <button class="add-to-cart-btn"><i class="fa-solid fa-cart-plus"></i></button>
                                </div>
                            </div>
                        </div>`;
}

function generateCategorySection(cat) {
    let cards = '';
    for (let i = 0; i < 12; i++) {
        cards += generateProductCard(cat.name, i);
    }

    return `
                <div class="category-section" id="${cat.id}" style="margin-bottom: 50px;">
                    <div class="category-section-title-wrapper" style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--color-gray-200);">
                        <h3 class="category-section-title" style="color: var(--color-primary-dark); margin: 0; font-size: 1.5rem;">${cat.name}</h3>
                        <span class="category-count" style="color: var(--color-gray-600); font-weight: 500; font-size: 1rem;">(${cat.count} sản phẩm)</span>
                    </div>
                    <div class="products-grid">
${cards}
                    </div>
                    <div class="text-center" style="margin-top: 30px;">
                        <button class="btn-search" style="padding: 10px 30px; border-radius: 30px; font-size: 1rem; border: none; background-color: var(--color-primary); color: white; cursor: pointer;">Xem thêm ${cat.name}</button>
                    </div>
                </div>`;
}

let sections = '';
for (const cat of categories) {
    sections += generateCategorySection(cat);
}

const indexContent = fs.readFileSync('index.html', 'utf8');

// Extract Header
const headerMatch = indexContent.match(/(<!-- TOP BAR -->[\s\S]*?)<!-- FULL WIDTH BANNER -->/);
let headerHtml = headerMatch ? headerMatch[1] : '';

// Replace "active" link in Header
headerHtml = headerHtml.replace('class="active">Trang Chủ', '>Trang Chủ');
headerHtml = headerHtml.replace('>Sản Phẩm', ' class="active">Sản Phẩm');

// Extract Footer
const footerMatch = indexContent.match(/(<!-- FOOTER -->[\s\S]*?)<\/body>/);
const footerHtml = footerMatch ? footerMatch[1] : '';

const htmlTemplate = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Danh mục sản phẩm Gas Việt - Tổng hợp các sản phẩm gas chính hãng, bếp gas, và phụ kiện với giá ưu đãi.">
    <title>Tất cả sản phẩm | Gas Việt</title>
    <!-- FontAwesome cho Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- CSS -->
    <link rel="stylesheet" href="css/main.css?v=3">
    <style>
        .category-sidebar ul li a.active {
            color: var(--color-accent);
            background-color: var(--color-primary);
            padding-left: 25px;
        }
        
        html { scroll-behavior: smooth; }
    </style>
</head>
<body>
    <h1 style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;">Sản phẩm Gas Việt</h1>

    ${headerHtml}

    <div class="container page-content">
        <div class="content-grid">
            <!-- Sidebar -->
            <div class="category-sidebar">
                <div class="sidebar-title">
                    <i class="fa-solid fa-list-ul"></i> Danh mục sản phẩm
                </div>
                <ul class="category-list">
                    <li><a href="#cat-saigon-petro">Gas Saigon Petro <span class="sidebar-count">124</span><i class="fa-solid fa-chevron-right"></i></a></li>
                    <li><a href="#cat-petrolimex">Gas Petrolimex <span class="sidebar-count">85</span><i class="fa-solid fa-chevron-right"></i></a></li>
                    <li><a href="#cat-gia-dinh">Gas Gia Đình <span class="sidebar-count">96</span><i class="fa-solid fa-chevron-right"></i></a></li>
                    <li><a href="#cat-thu-duc">Gas Thủ Đức <span class="sidebar-count">42</span><i class="fa-solid fa-chevron-right"></i></a></li>
                    <li><a href="#cat-elf">Gas Elf <span class="sidebar-count">35</span><i class="fa-solid fa-chevron-right"></i></a></li>
                    <li><a href="#cat-bep-hong-ngoai">Bếp Gas Hồng Ngoại <span class="sidebar-count">156</span><i class="fa-solid fa-chevron-right"></i></a></li>
                    <li><a href="#cat-bep-am">Bếp Gas Âm <span class="sidebar-count">210</span><i class="fa-solid fa-chevron-right"></i></a></li>
                    <li><a href="#cat-phu-kien">Phụ kiện (Van, Dây) <span class="sidebar-count">340</span><i class="fa-solid fa-chevron-right"></i></a></li>
                </ul>
            </div>

            <!-- Product Area -->
            <div class="product-area">
                <div class="section-header-full header-search-only">
                    <div class="section-search search-flex">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" placeholder="Tìm kiếm sản phẩm...">
                        <button class="btn-search">Tìm kiếm</button>
                    </div>
                    <div class="sort-by">
                        <div class="custom-dropdown" id="sortDropdown">
                            <div class="dropdown-selected">
                                <span>Sắp xếp: Mới nhất</span> <i class="fa-solid fa-chevron-down"></i>
                            </div>
                            <ul class="dropdown-options">
                                <li class="active">Mới nhất</li>
                                <li>Giá: Thấp đến Cao</li>
                                <li>Giá: Cao đến Thấp</li>
                                <li>Bán chạy nhất</li>
                            </ul>
                        </div>
                    </div>
                </div>

                ${sections}
            </div>
        </div>
    </div>

    ${footerHtml}

    <script src="js/main.js?v=3"></script>
    <script>
        // JS để active category trên sidebar khi cuộn
        document.addEventListener('DOMContentLoaded', () => {
            const sections = document.querySelectorAll('.category-section');
            const navLinks = document.querySelectorAll('.category-list a');

            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (scrollY >= sectionTop - 150) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(current) && current !== '') {
                        link.classList.add('active');
                    }
                });
            });
        });
    </script>
</body>
</html>`;

fs.writeFileSync('san-pham.html', htmlTemplate, 'utf8');
console.log('Successfully generated san-pham.html');
