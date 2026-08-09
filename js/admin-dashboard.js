/**
 * Admin dashboard Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== DASHBOARD ==========
    window.renderDashboard = function() {
        const stats = ProductDB.getStats();
        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon primary"><i class="fa-solid fa-box-open"></i></div>
                <div class="stat-info">
                    <h3>${stats.totalProducts}</h3>
                    <p>Tá»•ng sáº£n pháº©m</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon success"><i class="fa-solid fa-folder-tree"></i></div>
                <div class="stat-info">
                    <h3>${stats.totalCategories}</h3>
                    <p>Danh má»¥c</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon warning"><i class="fa-solid fa-star"></i></div>
                <div class="stat-info">
                    <h3>${stats.featuredCount}</h3>
                    <p>Sáº£n pháº©m ná»•i báº­t</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon danger"><i class="fa-solid fa-tags"></i></div>
                <div class="stat-info">
                    <h3>${stats.onSaleCount}</h3>
                    <p>Äang Æ°u Ä‘Ã£i</p>
                </div>
            </div>
        `;

        // Featured products table
        const featured = ProductDB.getFeatured();
        const tbody = document.getElementById('featuredTableBody');
        if (featured.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-empty"><i class="fa-solid fa-star"></i>ChÆ°a cÃ³ sáº£n pháº©m ná»•i báº­t</td></tr>';
            return;
        }
        tbody.innerHTML = featured.map(p => {
            const discountedPrice = ProductDB.getDiscountedPrice(p);
            return `
                <tr>
                    <td>
                        <div class="product-cell">
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44?text=Khong+co+anh'">
                            <div class="product-cell-info">
                                <span class="product-cell-name">${p.name}</span>
                                <span class="product-cell-cat">${ProductDB.getCategoryName(p.categoryId)}</span>
                            </div>
                        </div>
                    </td>
                    <td style="text-align: left;"><span class="price-text">${ProductDB.formatPrice(discountedPrice)}</span></td>
                    <td class="hide-mobile" style="text-align: left;">${p.discount > 0 ? `<span class="price-discount">-${p.discount}%</span>` : 'â€”'}</td>
                    <td class="hide-mobile" style="text-align: left;">
                        ${p.featured ? '<span class="badge badge-featured"><i class="fa-solid fa-star"></i> Ná»•i báº­t</span>' : ''}
                        ${p.onSale ? '<span class="badge badge-sale"><i class="fa-solid fa-tag"></i> Æ¯u Ä‘Ã£i</span>' : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }


});
