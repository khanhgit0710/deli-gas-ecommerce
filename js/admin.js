/**
 * Admin Panel Logic — Gas Việt
 * Handles all CRUD operations, rendering, and UI interactions
 */
document.addEventListener('DOMContentLoaded', async () => {
    await ProductDB.initAsync();
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
        categories: 'Quản lý danh mục'
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
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44?text=No+Img'">
                            <div class="product-cell-info">
                                <span class="product-cell-name">${p.name}</span>
                                <span class="product-cell-cat">${ProductDB.getCategoryName(p.categoryId)}</span>
                            </div>
                        </div>
                    </td>
                    <td><span class="price-text">${ProductDB.formatPrice(discountedPrice)}</span></td>
                    <td class="hide-mobile">${p.discount > 0 ? `<span class="price-discount">-${p.discount}%</span>` : '—'}</td>
                    <td class="hide-mobile">
                        ${p.featured ? '<span class="badge badge-featured"><i class="fa-solid fa-star"></i> Nổi bật</span>' : ''}
                        ${p.onSale ? '<span class="badge badge-sale"><i class="fa-solid fa-tag"></i> Ưu đãi</span>' : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ========== PRODUCTS ==========
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

    function renderProducts() {
        populateCategoryFilters();
        const searchVal = document.getElementById('productSearch').value.trim();
        const catFilter = document.getElementById('categoryFilter').value;

        let products;
        if (searchVal) {
            products = ProductDB.search(searchVal);
        } else if (catFilter) {
            products = ProductDB.getByCategory(catFilter);
        } else {
            products = ProductDB.getAll();
        }

        const tbody = document.getElementById('productsTableBody');
        const countText = document.getElementById('productCountText');

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="table-empty"><i class="fa-solid fa-box-open"></i>Không tìm thấy sản phẩm nào</td></tr>';
            countText.textContent = '0 sản phẩm';
            return;
        }

        countText.textContent = `${products.length} sản phẩm`;

        tbody.innerHTML = products.map(p => {
            const discountedPrice = ProductDB.getDiscountedPrice(p);
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600">#${p.id}</td>
                    <td>
                        <div class="product-cell">
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44?text=No+Img'">
                            <div class="product-cell-info">
                                <span class="product-cell-name">${p.name}</span>
                                <span class="product-cell-cat">${ProductDB.getCategoryName(p.categoryId)}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="price-text">${ProductDB.formatPrice(discountedPrice)}</span>
                        ${p.discount > 0 ? `<br><s style="font-size:11px;color:var(--admin-text-dim)">${ProductDB.formatPrice(p.price)}</s>` : ''}
                    </td>
                    <td class="hide-mobile">${p.discount > 0 ? `<span class="badge badge-sale">-${p.discount}%</span>` : '<span style="color:var(--admin-text-dim)">—</span>'}</td>
                    <td class="hide-mobile">${p.featured ? '<span class="badge badge-featured"><i class="fa-solid fa-star"></i></span>' : '<span style="color:var(--admin-text-dim)">—</span>'}</td>
                    <td class="hide-mobile">${p.onSale ? '<span class="badge badge-sale"><i class="fa-solid fa-tag"></i></span>' : '<span style="color:var(--admin-text-dim)">—</span>'}</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon success" title="Sửa" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon danger" title="Xóa" onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g, "\\'")}')"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Search & filter events
    document.getElementById('productSearch').addEventListener('input', renderProducts);
    document.getElementById('categoryFilter').addEventListener('change', renderProducts);

    // ========== PRODUCT MODAL ==========
    window.openProductModal = function (product = null) {
        populateCategoryFilters();
        const modal = document.getElementById('productModal');
        const title = document.getElementById('productModalTitle');
        const form = document.getElementById('productForm');

        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('productDiscount').value = '0';
        updateImagePreview();

        if (product) {
            title.textContent = 'Sửa sản phẩm';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.categoryId;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDiscount').value = product.discount || 0;
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productSpecs').value = product.specs || '';
            document.getElementById('productFeatured').checked = product.featured;
            document.getElementById('productOnSale').checked = product.onSale;
            updateImagePreview();
        } else {
            title.textContent = 'Thêm sản phẩm mới';
            document.getElementById('productFeatured').checked = true; // Auto "Mới" tag
            document.getElementById('productOnSale').checked = false;
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
            box.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'><i class=\\'fa-solid fa-image-slash\\'></i>Hình ảnh không hợp lệ</div>'">`;
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

    // Save product
    document.getElementById('btnSaveProduct').addEventListener('click', () => {
        const name = document.getElementById('productName').value.trim();
        const categoryId = document.getElementById('productCategory').value;
        const price = document.getElementById('productPrice').value;

        if (!name || !categoryId || !price) {
            showToast('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
            return;
        }

        const data = {
            name,
            categoryId: parseInt(categoryId),
            price: parseInt(price),
            discount: parseInt(document.getElementById('productDiscount').value) || 0,
            image: document.getElementById('productImage').value.trim(),
            description: document.getElementById('productDescription').value.trim(),
            specs: document.getElementById('productSpecs').value.trim(),
            featured: document.getElementById('productFeatured').checked,
            onSale: document.getElementById('productOnSale').checked
        };

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

        if (category) {
            title.textContent = 'Sửa danh mục';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categorySlug').value = category.slug;
        } else {
            title.textContent = 'Thêm danh mục mới';
        }

        modal.classList.add('active');
    };

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
        const editId = document.getElementById('categoryId').value;

        if (editId) {
            ProductDB.updateCategory(editId, { name, slug });
            showToast('Cập nhật danh mục thành công!', 'success');
        } else {
            ProductDB.addCategory({ name, slug });
            showToast('Thêm danh mục mới thành công!', 'success');
        }

        closeCategoryModal();
        renderCategories();
    });

    document.getElementById('btnAddCategory').addEventListener('click', () => openCategoryModal());

    // ========== RELOAD DATABASE ==========
    document.getElementById('btnResetDB').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.reload();
    });

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

