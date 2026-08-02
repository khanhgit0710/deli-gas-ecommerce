/**
 * Admin Panel Logic — Gas Việt
 * Handles all CRUD operations, rendering, and UI interactions
 */
document.addEventListener('DOMContentLoaded', async () => {
    await ProductDB.initAsync();
    
    // Apply logo to admin screen if exists
    const adminSettings = ProductDB.getSettings();
    if (adminSettings && adminSettings.logo) {
        const loginLogo = document.querySelector('.login-logo img');
        if (loginLogo) loginLogo.src = adminSettings.logo;
        const sidebarLogo = document.querySelector('.sidebar-header img');
        if (sidebarLogo) sidebarLogo.src = adminSettings.logo;
    }

    // ========== AUTHENTICATION ==========
    const loginOverlay = document.getElementById('adminLoginOverlay');
    const adminLayout = document.getElementById('adminLayout');
    const loginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');

    // Check login state
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        if (loginOverlay) loginOverlay.style.display = 'none';
        if (adminLayout) adminLayout.style.display = 'flex';
    } else {
        if (loginOverlay) loginOverlay.style.display = 'flex';
        if (adminLayout) adminLayout.style.display = 'none';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('loginUsername').value;
            const pass = document.getElementById('loginPassword').value;

            if (user === 'admin' && pass === 'admin') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                loginOverlay.style.display = 'none';
                adminLayout.style.display = 'flex';
                // Trigger dashboard initial render
                switchSection('dashboard');
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    // Add logout functionality
    const topbarRight = document.querySelector('.topbar-right');
    if (topbarRight && !document.getElementById('btnLogout')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.id = 'btnLogout';
        logoutBtn.href = '#';
        logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Đăng xuất';

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('adminLoggedIn');
            window.location.reload();
        });
        topbarRight.appendChild(logoutBtn);
    }

    // ========== NAVIGATION ==========
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    const pageTitle = document.getElementById('pageTitle');

    const sectionTitles = {
        dashboard: 'Bảng điều khiển',
        products: 'Quản lý sản phẩm',
        categories: 'Quản lý danh mục',
        news: 'Quản lý tin tức',
        settings: 'Cấu hình chung'
    };

    function switchSection(sectionId) {
        sections.forEach(s => s.classList.remove('active'));
        sidebarLinks.forEach(l => l.classList.remove('active'));
        const target = document.getElementById('section-' + sectionId);
        const link = document.querySelector(`a[data-section="${sectionId}"]`);
        if (target) target.classList.add('active');
        if (link) link.classList.add('active');
        if (pageTitle) pageTitle.textContent = sectionTitles[sectionId] || sectionId;

        // Refresh data when switching
        if (sectionId === 'dashboard') renderDashboard();
        if (sectionId === 'products') renderProducts();
        if (sectionId === 'categories') renderCategories();
        if (sectionId === 'news') renderNews();
        if (sectionId === 'news-categories') renderNewsCategories();
        if (sectionId === 'settings') renderSettings();
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
            // Close mobile sidebar
            document.getElementById('adminSidebar').classList.remove('open');
        });
    });

    window.openAdminCategoryModalFromSidebar = function(catId) {
        setTimeout(() => {
            switchSection('categories');
            const cat = ProductDB.getCategoryById(catId);
            if (cat) {
                openCategoryModal(cat);
            }
            document.getElementById('adminSidebar').classList.remove('open');
        }, 50);
    };

    function renderSidebarCategories() {
        const tree = document.getElementById('sidebarCategoryTree');
        if (!tree) return;
        const categories = ProductDB.getCategories();
        let html = '';
        categories.forEach(cat => {
            html += `<li><a href="#" onclick="event.preventDefault(); openAdminCategoryModalFromSidebar(${cat.id});"><i class="fa-solid fa-angle-right" style="font-size: 10px;"></i> ${cat.name}</a></li>`;
        });
        tree.innerHTML = html;
    }

    // Mobile toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('adminSidebar');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Click outside to close sidebar on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // ========== TOAST ==========
    window.showToast = function (message, type = 'success') {
        const container = document.getElementById('toastContainer');
        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-xmark',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type]} toast-icon"></i>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ========== CONFIRM DIALOG ==========
    let confirmCallback = null;

    window.showConfirm = function (title, message, callback) {
        const overlay = document.getElementById('confirmDialog');
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        confirmCallback = callback;
        overlay.classList.add('active');
    };

    window.closeConfirm = function () {
        document.getElementById('confirmDialog').classList.remove('active');
        confirmCallback = null;
    };

    document.getElementById('btnConfirmAction').addEventListener('click', () => {
        if (confirmCallback) confirmCallback();
        closeConfirm();
    });

    // ========== DASHBOARD ==========
    function renderDashboard() {
        const stats = ProductDB.getStats();
        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon primary"><i class="fa-solid fa-box-open"></i></div>
                <div class="stat-info">
                    <h3>${stats.totalProducts}</h3>
                    <p>Tổng sản phẩm</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon success"><i class="fa-solid fa-folder-tree"></i></div>
                <div class="stat-info">
                    <h3>${stats.totalCategories}</h3>
                    <p>Danh mục</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon warning"><i class="fa-solid fa-star"></i></div>
                <div class="stat-info">
                    <h3>${stats.featuredCount}</h3>
                    <p>Sản phẩm nổi bật</p>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon danger"><i class="fa-solid fa-tags"></i></div>
                <div class="stat-info">
                    <h3>${stats.onSaleCount}</h3>
                    <p>Đang ưu đãi</p>
                </div>
            </div>
        `;

        // Featured products table
        const featured = ProductDB.getFeatured();
        const tbody = document.getElementById('featuredTableBody');
        if (featured.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-empty"><i class="fa-solid fa-star"></i>Chưa có sản phẩm nổi bật</td></tr>';
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
                    <td class="hide-mobile" style="text-align: left;">${p.discount > 0 ? `<span class="price-discount">-${p.discount}%</span>` : '—'}</td>
                    <td class="hide-mobile" style="text-align: left;">
                        ${p.featured ? '<span class="badge badge-featured"><i class="fa-solid fa-star"></i> Nổi bật</span>' : ''}
                        ${p.onSale ? '<span class="badge badge-sale"><i class="fa-solid fa-tag"></i> Ưu đãi</span>' : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ========== PRODUCTS ==========
    let currentProductPage = 1;
    const productsPerPage = 20;

    window.changeProductPage = function(page) {
        currentProductPage = page;
        renderProducts();
    };

    function populateCategoryFilters() {
        const categories = ProductDB.getCategories();
        
        // Filter dropdown
        const filter = document.getElementById('categoryFilter');
        const currentFilterValue = filter.value;
        filter.innerHTML = '<option value="">Tất cả danh mục</option>' +
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        filter.value = currentFilterValue;

        // Modal dropdown
        const select = document.getElementById('productCategory');
        const currentSelectValue = select.value;
        select.innerHTML = '<option value="">Chọn danh mục</option>' +
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        select.value = currentSelectValue;
    }

    function renderProducts(resetPage = false) {
        if (resetPage === true) currentProductPage = 1;
        populateCategoryFilters();
        const searchVal = document.getElementById('productSearch').value.trim();
        const catFilter = document.getElementById('categoryFilter').value;

        let products;
        if (searchVal) {
            products = ProductDB.search(searchVal, true);
        } else if (catFilter) {
            products = ProductDB.getByCategory(catFilter, true);
        } else {
            products = ProductDB.getAll(true);
        }

        const tbody = document.getElementById('productsTableBody');
        const countText = document.getElementById('productCountText');
        const pagination = document.getElementById('productPagination');

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-empty"><i class="fa-solid fa-box-open"></i>Không tìm thấy sản phẩm nào</td></tr>';
            countText.textContent = '0 sản phẩm';
            if (pagination) pagination.innerHTML = '';
            return;
        }

        countText.textContent = `${products.length} sản phẩm`;

        const totalPages = Math.ceil(products.length / productsPerPage);
        if (currentProductPage > totalPages) currentProductPage = totalPages;
        if (currentProductPage < 1) currentProductPage = 1;

        const startIndex = (currentProductPage - 1) * productsPerPage;
        const endIndex = Math.min(startIndex + productsPerPage, products.length);
        const paginatedProducts = products.slice(startIndex, endIndex);

        if (pagination) {
            let html = '';
            for (let i = 1; i <= totalPages; i++) {
                if (i === currentProductPage) {
                    html += `<button class="btn btn-primary btn-sm" style="padding: 5px 10px; height: 30px; display: inline-flex; align-items: center; justify-content: center;">${i}</button>`;
                } else {
                    html += `<button class="btn btn-outline btn-sm" style="padding: 5px 10px; height: 30px; display: inline-flex; align-items: center; justify-content: center;" onclick="changeProductPage(${i})">${i}</button>`;
                }
            }
            pagination.innerHTML = html;
        }

        tbody.innerHTML = paginatedProducts.map((p, index) => {
            const discountedPrice = ProductDB.getDiscountedPrice(p);
            const serialNumber = startIndex + index + 1;
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600;text-align:left;">${serialNumber}</td>
                    <td>
                        <div class="product-cell">
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44?text=Khong+co+anh'">
                            <div class="product-cell-info">
                                <span class="product-cell-name">${p.name}</span>
                                <span class="product-cell-cat">${ProductDB.getCategoryName(p.categoryId)}</span>
                            </div>
                        </div>
                    </td>
                    <td style="text-align: left;">
                        <span class="price-text">${ProductDB.formatPrice(discountedPrice)}</span>
                        ${p.discount > 0 ? `<br><s style="font-size:14px;color:var(--admin-text-dim)">${ProductDB.formatPrice(p.price)}</s>` : ''}
                    </td>
                    <td class="hide-mobile" style="text-align: left;">${p.discount > 0 ? `<span class="badge badge-sale">-${p.discount}%</span>` : '<span style="color:var(--admin-text-dim)">—</span>'}</td>
                    <td class="hide-mobile" style="text-align: left;">${p.featured ? '<span class="badge badge-featured"><i class="fa-solid fa-star"></i></span>' : '<span style="color:var(--admin-text-dim)">—</span>'}</td>
                    <td class="hide-mobile" style="text-align: left;">${p.onSale ? '<span class="badge badge-sale"><i class="fa-solid fa-tag"></i></span>' : '<span style="color:var(--admin-text-dim)">—</span>'}</td>
                    <td class="hide-mobile" style="text-align: left;">${p.active !== false ? '<span class="badge badge-success" style="background:#d4edda;color:#155724;padding:4px 8px;border-radius:4px;font-size:14px">Đang hiện</span>' : '<span class="badge badge-danger" style="background:#f8d7da;color:#721c24;padding:4px 8px;border-radius:4px;font-size:14px">Đang ẩn</span>'}</td>
                    <td style="text-align: left;">
                        <div class="actions-cell" style="justify-content: flex-start;">
                            <button class="btn-icon success" title="Sửa" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Search & filter events
    document.getElementById('productSearch').addEventListener('input', () => renderProducts(true));
    document.getElementById('categoryFilter').addEventListener('change', () => renderProducts(true));

    // Format Currency Input
    function formatCurrencyInput(e) {
        let val = e.target.value.replace(/[^\d]/g, '');
        if (val) {
            val = parseInt(val, 10).toLocaleString('vi-VN').replace(/,/g, '.');
        }
        e.target.value = val;
    }

    document.getElementById('productPrice').addEventListener('input', formatCurrencyInput);
    document.getElementById('productFinalPrice').addEventListener('input', formatCurrencyInput);

    // Auto-calculate discount
    function calculateDiscount() {
        const rawPrice = document.getElementById('productPrice').value.replace(/\./g, '');
        const rawFinalPrice = document.getElementById('productFinalPrice').value.replace(/\./g, '');
        
        const price = parseFloat(rawPrice) || 0;
        const finalPrice = parseFloat(rawFinalPrice) || 0;
        const discountInput = document.getElementById('productDiscount');
        
        if (price > 0 && finalPrice > 0 && finalPrice < price) {
            const percentage = ((price - finalPrice) / price) * 100;
            discountInput.value = Math.ceil(percentage); // Luôn làm tròn lên
        } else if (finalPrice === price || finalPrice > price || finalPrice === 0) {
            discountInput.value = 0;
        }
    }
    document.getElementById('productPrice').addEventListener('input', calculateDiscount);
    document.getElementById('productFinalPrice').addEventListener('input', calculateDiscount);

    // ========== PRODUCT MODAL ==========
    window.openProductModal = function (product = null) {
        populateCategoryFilters();
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');

        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('productDiscount').value = '0';
        document.getElementById('productFinalPrice').value = '';
        
        // Populate combo select and recommended products
        const comboSelect = document.getElementById('comboProductId');
        const rec1 = document.getElementById('recProduct1');
        const rec2 = document.getElementById('recProduct2');
        const rec3 = document.getElementById('recProduct3');
        
        let comboHTML = '<option value="">Không có ưu đãi</option>';
        let recHTML = '<option value="">-- Chọn sản phẩm --</option>';
        
        ProductDB.getAll().forEach(p => {
            if (!product || p.id !== product.id) {
                const opt = `<option value="${p.id}">${p.name}</option>`;
                comboHTML += opt;
                recHTML += opt;
            }
        });
        
        if (comboSelect) comboSelect.innerHTML = comboHTML;
        if (rec1) rec1.innerHTML = recHTML;
        if (rec2) rec2.innerHTML = recHTML;
        if (rec3) rec3.innerHTML = recHTML;

        updateImagePreview();

        if (product) {
            title.textContent = 'Sửa sản phẩm';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.categoryId;
            document.getElementById('productPrice').value = product.price.toLocaleString('vi-VN').replace(/,/g, '.');
            document.getElementById('productDiscount').value = product.discount || 0;
            const finalPrice = product.price - (product.price * (product.discount || 0) / 100);
            const displayFinalPrice = product.discount ? Math.round(finalPrice) : product.price;
            document.getElementById('productFinalPrice').value = displayFinalPrice.toLocaleString('vi-VN').replace(/,/g, '.');
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productSpecs').value = product.specs || '';
            document.getElementById('productFeatured').checked = product.featured;
            document.getElementById('productOnSale').checked = product.onSale;
            if (document.getElementById('productActive')) document.getElementById('productActive').checked = product.active !== false;
            if (document.getElementById('productSlug')) document.getElementById('productSlug').value = product.slug || '';
            if (document.getElementById('productSeoTitle')) document.getElementById('productSeoTitle').value = product.seoTitle || '';
            if (document.getElementById('productSeoDesc')) document.getElementById('productSeoDesc').value = product.seoDesc || '';
            if (document.getElementById('comboProductId')) document.getElementById('comboProductId').value = product.comboProductId || '';
            if (document.getElementById('comboDiscountText')) document.getElementById('comboDiscountText').value = product.comboDiscountText || '';
            
            const recs = product.recommendedProducts || [];
            if (document.getElementById('recProduct1')) document.getElementById('recProduct1').value = recs[0] || '';
            if (document.getElementById('recProduct2')) document.getElementById('recProduct2').value = recs[1] || '';
            if (document.getElementById('recProduct3')) document.getElementById('recProduct3').value = recs[2] || '';
            
            const imgs = product.images || [];
            window.currentAdditionalImages = [...imgs];
            
            if (document.getElementById('comboTotalPriceInput')) document.getElementById('comboTotalPriceInput').value = product.comboTotalPrice || '';
            
            updateImagePreview();
            renderAdditionalImages();
        } else {
            title.textContent = 'Thêm sản phẩm mới';
            document.getElementById('productFeatured').checked = true; // Auto "Mới" tag
            document.getElementById('productOnSale').checked = false;
            if (document.getElementById('productActive')) document.getElementById('productActive').checked = true;
            if (document.getElementById('productSlug')) document.getElementById('productSlug').value = '';
            if (document.getElementById('productSeoTitle')) document.getElementById('productSeoTitle').value = '';
            if (document.getElementById('productSeoDesc')) document.getElementById('productSeoDesc').value = '';
            if (document.getElementById('comboProductId')) document.getElementById('comboProductId').value = '';
            if (document.getElementById('comboDiscountText')) document.getElementById('comboDiscountText').value = '';
            if (document.getElementById('recProduct1')) document.getElementById('recProduct1').value = '';
            if (document.getElementById('recProduct2')) document.getElementById('recProduct2').value = '';
            if (document.getElementById('recProduct3')) document.getElementById('recProduct3').value = '';
            
            if (document.getElementById('recProduct1')) document.getElementById('recProduct1').value = '';
            if (document.getElementById('recProduct2')) document.getElementById('recProduct2').value = '';
            if (document.getElementById('recProduct3')) document.getElementById('recProduct3').value = '';
            
            window.currentAdditionalImages = [];
            renderAdditionalImages();
            
            if (document.getElementById('comboTotalPriceInput')) document.getElementById('comboTotalPriceInput').value = '';
        }

        modal.classList.add('active');
    };

    window.closeProductModal = function () {
        document.getElementById('productModal').classList.remove('active');
    };

    window.editProduct = function (id) {
        const product = ProductDB.getById(id);
        if (product) openProductModal(product);
    };

    window.deleteProduct = function (id, name) {
        showConfirm('Xóa sản phẩm', `Bạn có chắc muốn xóa "${name}"? Hành động này không thể hoàn tác.`, () => {
            ProductDB.delete(id);
            showToast('Đã xóa sản phẩm thành công!', 'success');
            renderProducts();
        });
    };

    // Image preview
    function updateImagePreview() {
        const url = document.getElementById('productImage').value;
        const box = document.getElementById('imagePreview');
        if (url) {
            box.innerHTML = `<img src="${url}" alt="Xem trước" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fa-solid fa-image-slash\\'></i>Hình ảnh không hợp lệ</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder"><i class="fa-solid fa-image"></i>Xem trước hình ảnh</div>';
        }
    }
    document.getElementById('productImage').addEventListener('input', updateImagePreview);

    const imageUpload = document.getElementById('productImageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Check file size (limit to ~2MB to avoid localStorage quota issues)
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Vui lòng chọn ảnh có kích thước dưới 2MB!', 'error');
                    this.value = ''; // Reset
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const base64Str = evt.target.result;
                    document.getElementById('productImage').value = base64Str;
                    updateImagePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Additional images logic
    window.currentAdditionalImages = [];
    
    function renderAdditionalImages() {
        const previewBox = document.getElementById('additionalImagesPreview');
        if (!previewBox) return;
        previewBox.innerHTML = '';
        window.currentAdditionalImages.forEach((imgSrc, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.width = '70px';
            wrapper.style.height = '70px';
            wrapper.style.border = '1px solid #ddd';
            wrapper.style.borderRadius = '4px';
            wrapper.style.overflow = 'hidden';
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.background = 'white';
            
            const btnRemove = document.createElement('button');
            btnRemove.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            btnRemove.style.position = 'absolute';
            btnRemove.style.top = '2px';
            btnRemove.style.right = '2px';
            btnRemove.style.background = 'rgba(255,0,0,0.7)';
            btnRemove.style.color = 'white';
            btnRemove.style.border = 'none';
            btnRemove.style.borderRadius = '50%';
            btnRemove.style.width = '18px';
            btnRemove.style.height = '18px';
            btnRemove.style.cursor = 'pointer';
            btnRemove.style.display = 'flex';
            btnRemove.style.alignItems = 'center';
            btnRemove.style.justifyContent = 'center';
            btnRemove.style.fontSize = '10px';
            
            btnRemove.onclick = () => {
                window.currentAdditionalImages.splice(index, 1);
                renderAdditionalImages();
            };
            
            wrapper.appendChild(img);
            wrapper.appendChild(btnRemove);
            previewBox.appendChild(wrapper);
        });
    }

    const btnAddAdditionalImage = document.getElementById('btnAddAdditionalImage');
    const inputAdditionalImage = document.getElementById('additionalImageInput');

    function addAdditionalImageFromUrl() {
        if (!inputAdditionalImage) return;
        const val = inputAdditionalImage.value.trim();
        if (val) {
            if (window.currentAdditionalImages.length >= 6) {
                showToast('Chỉ được phép tối đa 6 ảnh đính kèm!', 'error');
                return;
            }
            window.currentAdditionalImages.push(val);
            inputAdditionalImage.value = '';
            renderAdditionalImages();
        }
    }

    if (btnAddAdditionalImage) {
        btnAddAdditionalImage.addEventListener('click', addAdditionalImageFromUrl);
    }
    
    if (inputAdditionalImage) {
        inputAdditionalImage.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission if inside a form
                addAdditionalImageFromUrl();
            }
        });
    }

    const additionalImageUpload = document.getElementById('additionalImageUpload');
    if (additionalImageUpload) {
        additionalImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (window.currentAdditionalImages.length >= 6) {
                    showToast('Chỉ được phép tối đa 6 ảnh đính kèm!', 'error');
                    this.value = '';
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Vui lòng chọn ảnh có kích thước dưới 2MB!', 'error');
                    this.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const base64Str = evt.target.result;
                    window.currentAdditionalImages.push(base64Str);
                    renderAdditionalImages();
                };
                reader.readAsDataURL(file);
                this.value = ''; // Reset for next selection
            }
        });
    }

    // Save product
    document.getElementById('btnSaveProduct').addEventListener('click', () => {
        const name = document.getElementById('productName').value.trim();
        const categoryId = document.getElementById('productCategory').value;
        const priceRaw = document.getElementById('productPrice').value.replace(/\./g, '');

        if (!name || !categoryId || !priceRaw) {
            showToast('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
            return;
        }

        const data = {
            name,
            categoryId: parseInt(categoryId),
            price: parseInt(priceRaw),
            discount: parseInt(document.getElementById('productDiscount').value) || 0,
            image: document.getElementById('productImage').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            specs: document.getElementById('productSpecs').value.trim(),
            featured: document.getElementById('productFeatured').checked,
            onSale: document.getElementById('productOnSale').checked,
            active: document.getElementById('productActive') ? document.getElementById('productActive').checked : true,
            slug: document.getElementById('productSlug') ? document.getElementById('productSlug').value.trim() : '',
            seoTitle: document.getElementById('productSeoTitle') ? document.getElementById('productSeoTitle').value.trim() : '',
            seoDesc: document.getElementById('productSeoDesc') ? document.getElementById('productSeoDesc').value.trim() : '',
            comboProductId: document.getElementById('comboProductId') ? (parseInt(document.getElementById('comboProductId').value) || null) : null,
            comboDiscountText: document.getElementById('comboDiscountText') ? document.getElementById('comboDiscountText').value.trim() : '',
            images: [...window.currentAdditionalImages]
        };

        const rec1Val = document.getElementById('recProduct1') ? parseInt(document.getElementById('recProduct1').value) : null;
        const rec2Val = document.getElementById('recProduct2') ? parseInt(document.getElementById('recProduct2').value) : null;
        const rec3Val = document.getElementById('recProduct3') ? parseInt(document.getElementById('recProduct3').value) : null;
        data.recommendedProducts = [rec1Val, rec2Val, rec3Val].filter(v => v);
        
        if (document.getElementById('comboTotalPriceInput') && document.getElementById('comboTotalPriceInput').value) {
            data.comboTotalPrice = parseInt(document.getElementById('comboTotalPriceInput').value);
        } else {
            data.comboTotalPrice = null;
        }

        const editId = document.getElementById('productId').value;

        if (editId) {
            ProductDB.update(editId, data);
            showToast('Cập nhật sản phẩm thành công!', 'success');
        } else {
            ProductDB.add(data);
            showToast('Thêm sản phẩm mới thành công!', 'success');
        }

        closeProductModal();
        renderProducts();
    });

    document.getElementById('btnAddProduct').addEventListener('click', () => openProductModal());

    // ========== CATEGORIES ==========
    function renderCategories() {
        const categories = ProductDB.getCategories();
        const tbody = document.getElementById('categoriesTableBody');

        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="table-empty"><i class="fa-solid fa-folder-tree"></i>Chưa có danh mục nào</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(c => {
            const count = ProductDB.getProductCountByCategory(c.id);
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600">#${c.id}</td>
                    <td><strong>${c.name}</strong></td>
                    <td style="color:var(--admin-text-dim);font-family:monospace;font-size:12px">${c.slug}</td>
                    <td><span class="cat-product-count">${count}</span></td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon success" title="Sửa" onclick="editCategory(${c.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteCategory(${c.id}, '${c.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        // Keep sidebar category tree in sync
        renderSidebarCategories();
    }

    // Category modal
    window.openCategoryModal = function (category = null) {
        const modal = document.getElementById('categoryModal');
        const title = document.getElementById('categoryModalTitle');

        document.getElementById('categoryId').value = '';
        document.getElementById('categoryName').value = '';
        document.getElementById('categorySlug').value = '';
        document.getElementById('categorySeoDesc').value = '';

        if (category) {
            title.textContent = 'Sửa danh mục';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categorySlug').value = category.slug;
            document.getElementById('categorySeoDesc').value = category.seoDesc || '';
        } else {
            title.textContent = 'Thêm danh mục mới';
        }

        modal.classList.add('active');
    };

    document.getElementById('categoryName').addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/đ/g, 'd')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('categorySlug').value = slug;
    });

    window.closeCategoryModal = function () {
        document.getElementById('categoryModal').classList.remove('active');
    };

    window.editCategory = function (id) {
        const cat = ProductDB.getCategoryById(id);
        if (cat) openCategoryModal(cat);
    };

    window.deleteCategory = function (id, name) {
        showConfirm('Xóa danh mục', `Bạn có chắc muốn xóa danh mục "${name}"?`, () => {
            const result = ProductDB.deleteCategory(id);
            if (result.success) {
                showToast('Đã xóa danh mục thành công!', 'success');
                renderCategories();
            } else {
                showToast(result.message, 'error');
            }
        });
    };

    document.getElementById('btnSaveCategory').addEventListener('click', () => {
        const name = document.getElementById('categoryName').value.trim();
        if (!name) {
            showToast('Vui lòng nhập tên danh mục!', 'error');
            return;
        }

        const slug = document.getElementById('categorySlug').value.trim();
        const seoDesc = document.getElementById('categorySeoDesc').value.trim();
        const editId = document.getElementById('categoryId').value;

        if (editId) {
            ProductDB.updateCategory(editId, { name, slug, seoDesc });
            showToast('Cập nhật danh mục thành công!', 'success');
        } else {
            ProductDB.addCategory({ name, slug, seoDesc });
            showToast('Thêm danh mục mới thành công!', 'success');
        }

        closeCategoryModal();
        renderCategories();
    });

    document.getElementById('btnAddCategory').addEventListener('click', () => openCategoryModal());

    // ========== QUILL JS INIT ==========
    let quillEditor = null;
    if (document.getElementById('newsContentEditor')) {
        quillEditor = new Quill('#newsContentEditor', {
            theme: 'snow',
            modules: {
                toolbar: {
                    container: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    handlers: {
                        image: function() {
                            const value = prompt('Nhập đường dẫn (URL) của hình ảnh:');
                            if (value) {
                                const cursorPosition = this.quill.getSelection()?.index || 0;
                                this.quill.insertEmbed(cursorPosition, 'image', value);
                                this.quill.setSelection(cursorPosition + 1);
                            }
                        }
                    }
                }
            }
        });
        
        quillEditor.on('text-change', function() {
            document.getElementById('newsContent').value = quillEditor.root.innerHTML;
        });
    }

    // ========== NEWS CATEGORIES ==========
    function renderNewsCategories() {
        const categories = ProductDB.getNewsCategories();
        const news = ProductDB.getNews(true); // to count articles per category
        const tbody = document.getElementById('newsCategoriesTableBody');

        if (!tbody) return;

        if (categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="table-empty"><i class="fa-solid fa-tags"></i>Chưa có danh mục tin tức nào</td></tr>';
            return;
        }

        tbody.innerHTML = categories.map(c => {
            const count = news.filter(n => n.categoryId === c.id).length;
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600;">#${c.id}</td>
                    <td style="font-weight:600;color:var(--admin-text);">${c.name}</td>
                    <td style="font-family:monospace;color:var(--admin-text-muted);">${c.slug}</td>
                    <td style="font-weight:500;">${count} bài viết</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon success" title="Sửa" onclick="editNewsCategory(${c.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteNewsCategory(${c.id}, '${c.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    window.openNewsCategoryModal = function(cat = null) {
        const modal = document.getElementById('newsCategoryModal');
        const title = document.getElementById('newsCategoryModalTitle');
        const form = document.getElementById('newsCategoryForm');

        form.reset();
        document.getElementById('newsCategoryId').value = '';

        if (cat) {
            title.textContent = 'Sửa danh mục tin tức';
            document.getElementById('newsCategoryId').value = cat.id;
            document.getElementById('newsCategoryName').value = cat.name;
            document.getElementById('newsCategorySlug').value = cat.slug || '';
        } else {
            title.textContent = 'Thêm danh mục tin tức';
        }
        modal.classList.add('active');
    };

    window.closeNewsCategoryModal = function() {
        document.getElementById('newsCategoryModal').classList.remove('active');
    };

    window.editNewsCategory = function(id) {
        const cat = ProductDB.getNewsCategoryById(id);
        if (cat) openNewsCategoryModal(cat);
    };

    window.deleteNewsCategory = function(id, name) {
        showConfirm('Xóa danh mục', `Bạn có chắc muốn xóa danh mục tin tức "${name}"?`, () => {
            const res = ProductDB.deleteNewsCategory(id);
            if (res.success) {
                showToast('Đã xóa danh mục tin tức!', 'success');
                renderNewsCategories();
            } else {
                showToast(res.message || 'Lỗi khi xóa', 'error');
            }
        });
    };

    document.getElementById('newsCategoryName')?.addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/đ/g, 'd')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('newsCategorySlug').value = slug;
    });

    document.getElementById('btnSaveNewsCategory')?.addEventListener('click', () => {
        const name = document.getElementById('newsCategoryName').value.trim();
        if (!name) {
            showToast('Vui lòng nhập tên danh mục!', 'error');
            return;
        }

        const slug = document.getElementById('newsCategorySlug').value.trim();
        const editId = document.getElementById('newsCategoryId').value;

        let res;
        if (editId) {
            res = ProductDB.updateNewsCategory(editId, { name, slug });
        } else {
            res = ProductDB.addNewsCategory({ name, slug });
        }

        if (res.success) {
            showToast(editId ? 'Cập nhật thành công!' : 'Thêm danh mục mới thành công!', 'success');
            closeNewsCategoryModal();
            renderNewsCategories();
        } else {
            showToast(res.message || 'Lỗi khi lưu danh mục', 'error');
        }
    });

    document.getElementById('btnAddNewsCategory')?.addEventListener('click', () => openNewsCategoryModal());

    // ========== NEWS ==========
    function renderNews() {
        const news = ProductDB.getNews(true); // true means isAdmin (returns all including inactive)
        const searchVal = document.getElementById('newsSearch') ? document.getElementById('newsSearch').value.trim().toLowerCase() : '';
        const tbody = document.getElementById('newsTableBody');

        if (!tbody) return;

        let filteredNews = news;
        if (searchVal) {
            filteredNews = news.filter(n => 
                n.title.toLowerCase().includes(searchVal) || 
                (n.slug && n.slug.toLowerCase().includes(searchVal))
            );
        }

        if (filteredNews.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="table-empty"><i class="fa-solid fa-newspaper"></i>Chưa có tin tức nào</td></tr>';
            return;
        }

        tbody.innerHTML = filteredNews.map(n => {
            const dateStr = n.createdAt ? new Date(n.createdAt).toLocaleDateString('vi-VN') : '—';
            
            const catName = n.categoryId ? (ProductDB.getNewsCategoryById(n.categoryId)?.name || 'Chưa phân loại') : 'Chưa phân loại';
            
            let posBadge = '';
            if (n.position === 'hero_main') posBadge = '<span class="badge" style="background:#e8f4fd;color:#0369a1;padding:4px 8px;border-radius:4px;font-size:12px;">Bài nổi bật (Chính)</span>';
            else if (n.position === 'hero_sub') posBadge = '<span class="badge" style="background:#f0f9ff;color:#0284c7;padding:4px 8px;border-radius:4px;font-size:12px;">Bài nổi bật (Phụ)</span>';
            else if (n.position === 'trending_main') posBadge = '<span class="badge" style="background:#fff7ed;color:#c2410c;padding:4px 8px;border-radius:4px;font-size:12px;">Tin cập nhật (Chính)</span>';
            else posBadge = '<span class="badge" style="background:#f1f5f9;color:#64748b;padding:4px 8px;border-radius:4px;font-size:12px;">Mặc định</span>';

            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600;text-align:left;">#${n.id}</td>
                    <td>
                        <div class="product-cell">
                            <img src="${n.image}" alt="${n.title}" onerror="this.src='https://via.placeholder.com/44?text=No+Img'">
                            <div class="product-cell-info">
                                <span class="product-cell-name">${n.title}</span>
                                <span class="product-cell-cat" style="font-family:monospace;">${n.slug}</span>
                            </div>
                        </div>
                    </td>
                    <td class="hide-mobile" style="text-align: left;"><span class="badge" style="background:#f1f5f9;color:#475569;padding:4px 8px;border-radius:4px;font-size:13px"><i class="fa-solid fa-tag"></i> ${catName}</span></td>
                    <td class="hide-mobile" style="text-align: left;">${posBadge}</td>
                    <td class="hide-mobile" style="text-align: left;">${n.active !== false ? '<span class="badge badge-success" style="background:#d4edda;color:#155724;padding:4px 8px;border-radius:4px;font-size:14px">Đang hiện</span>' : '<span class="badge badge-danger" style="background:#f8d7da;color:#721c24;padding:4px 8px;border-radius:4px;font-size:14px">Đang ẩn</span>'}</td>
                    <td class="hide-mobile" style="text-align: left;">${dateStr}</td>
                    <td style="text-align: left;">
                        <div class="actions-cell" style="justify-content: flex-start;">
                            <button class="btn-icon success" title="Sửa" onclick="editNews(${n.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteNews(${n.id}, '${n.title.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (document.getElementById('newsSearch')) {
        document.getElementById('newsSearch').addEventListener('input', renderNews);
    }

    // News modal
    window.openNewsModal = function (newsItem = null) {
        const modal = document.getElementById('newsModal');
        const title = document.getElementById('newsModalTitle');
        const form = document.getElementById('newsForm');

        form.reset();
        document.getElementById('newsId').value = '';
        updateNewsImagePreview();

        // Populate Categories
        const catSelect = document.getElementById('newsCategorySelect');
        const categories = ProductDB.getNewsCategories();
        catSelect.innerHTML = '<option value="">-- Chọn danh mục --</option>' + 
            categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

        if (newsItem) {
            title.textContent = 'Sửa tin tức';
            document.getElementById('newsId').value = newsItem.id;
            document.getElementById('newsTitle').value = newsItem.title;
            document.getElementById('newsSlug').value = newsItem.slug || '';
            document.getElementById('newsAuthor').value = newsItem.author || '';
            document.getElementById('newsImage').value = newsItem.image || '';
            document.getElementById('newsContent').value = newsItem.content || '';
            if (quillEditor) quillEditor.root.innerHTML = newsItem.content || '';
            
            document.getElementById('newsCategorySelect').value = newsItem.categoryId || '';
            document.getElementById('newsPosition').value = newsItem.position || 'default';
            
            document.getElementById('newsActive').checked = newsItem.active !== false;
            updateNewsImagePreview();
        } else {
            title.textContent = 'Thêm tin tức mới';
            document.getElementById('newsSlug').value = '';
            document.getElementById('newsContent').value = '';
            if (quillEditor) quillEditor.root.innerHTML = '';
            
            document.getElementById('newsCategorySelect').value = '';
            document.getElementById('newsPosition').value = 'default';
            
            document.getElementById('newsActive').checked = true;
        }

        modal.classList.add('active');
    };

    window.closeNewsModal = function () {
        document.getElementById('newsModal').classList.remove('active');
    };

    window.editNews = function (id) {
        const newsItem = ProductDB.getNewsById(id);
        if (newsItem) openNewsModal(newsItem);
    };

    window.deleteNews = function (id, title) {
        showConfirm('Xóa tin tức', `Bạn có chắc muốn xóa tin tức "${title}"?`, () => {
            ProductDB.deleteNews(id);
            showToast('Đã xóa tin tức thành công!', 'success');
            renderNews();
        });
    };

    document.getElementById('newsTitle')?.addEventListener('input', function(e) {
        const slug = e.target.value.toLowerCase()
            .replace(/đ/g, 'd')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        document.getElementById('newsSlug').value = slug;
    });

    function updateNewsImagePreview() {
        const url = document.getElementById('newsImage').value;
        const box = document.getElementById('newsImagePreview');
        if (url) {
            box.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fa-solid fa-image-slash\\'></i>Hình ảnh không hợp lệ</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder"><i class="fa-solid fa-image"></i>Xem trước hình ảnh</div>';
        }
    }
    
    document.getElementById('newsImage')?.addEventListener('input', updateNewsImagePreview);

    const newsImageUpload = document.getElementById('newsImageUpload');
    if (newsImageUpload) {
        newsImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast('Vui lòng chọn ảnh có kích thước dưới 2MB!', 'error');
                    this.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const base64Str = evt.target.result;
                    document.getElementById('newsImage').value = base64Str;
                    updateNewsImagePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    document.getElementById('btnSaveNews')?.addEventListener('click', () => {
        const title = document.getElementById('newsTitle').value.trim();
        if (!title) {
            showToast('Vui lòng nhập tiêu đề tin tức!', 'error');
            return;
        }

        const catId = document.getElementById('newsCategorySelect').value;
        if (!catId) {
            showToast('Vui lòng chọn danh mục tin tức!', 'error');
            return;
        }

        const data = {
            title,
            slug: document.getElementById('newsSlug').value.trim(),
            author: document.getElementById('newsAuthor').value.trim(),
            image: document.getElementById('newsImage').value.trim(),
            content: document.getElementById('newsContent').value.trim(),
            categoryId: parseInt(catId),
            position: document.getElementById('newsPosition').value,
            active: document.getElementById('newsActive').checked
        };

        const editId = document.getElementById('newsId').value;
        if (editId) {
            ProductDB.updateNews(editId, data);
            showToast('Cập nhật tin tức thành công!', 'success');
        } else {
            ProductDB.addNews(data);
            showToast('Thêm tin tức mới thành công!', 'success');
        }

        closeNewsModal();
        renderNews();
    });

    document.getElementById('btnAddNews')?.addEventListener('click', () => openNewsModal());

    // ========== RELOAD DATABASE ==========
    document.getElementById('btnResetDB').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.reload();
    });

    // ========== SETTINGS ==========
    function renderSettings() {
        const settings = ProductDB.getSettings();
        document.getElementById('settingHotline').value = settings.hotline || '';
        document.getElementById('settingZalo').value = settings.zalo || '';
        document.getElementById('settingAddress').value = settings.address || '';
        document.getElementById('settingLogo').value = settings.logo || '';
        updateSettingLogoPreview();
    }

    function updateSettingLogoPreview() {
        const url = document.getElementById('settingLogo').value;
        const box = document.getElementById('settingLogoPreview');
        if (url) {
            box.innerHTML = `<img src="${url}" alt="Logo Preview" style="max-height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>Logo không hợp lệ</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder">Xem trước Logo</div>';
        }
    }

    const settingLogoInput = document.getElementById('settingLogo');
    if (settingLogoInput) {
        settingLogoInput.addEventListener('input', updateSettingLogoPreview);
    }

    const btnSaveSettings = document.getElementById('btnSaveSettings');
    if (btnSaveSettings) {
        btnSaveSettings.addEventListener('click', () => {
            const newSettings = {
                hotline: document.getElementById('settingHotline').value.trim(),
                zalo: document.getElementById('settingZalo').value.trim(),
                address: document.getElementById('settingAddress').value.trim(),
                logo: document.getElementById('settingLogo').value.trim()
            };
            ProductDB.updateSettings(newSettings);
            showToast('Lưu cấu hình thành công!', 'success');
        });
    }

    // ========== CLOSE MODALS ON OVERLAY CLICK ==========
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // ========== INIT ==========
    renderSidebarCategories();
    renderDashboard();
});

