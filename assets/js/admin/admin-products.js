/**
 * Admin products Module
 */
document.addEventListener('DOMContentLoaded', () => {
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

    window.renderProducts = function(resetPage = false) {
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

        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter && priceFilter.value) {
            const pv = priceFilter.value;
            products = products.filter(p => {
                const finalPrice = ProductDB.getDiscountedPrice(p);
                if (pv === 'under_500') return finalPrice < 500000;
                if (pv === '500_1000') return finalPrice >= 500000 && finalPrice <= 1000000;
                if (pv === '1000_3000') return finalPrice >= 1000000 && finalPrice <= 3000000;
                if (pv === 'above_3000') return finalPrice > 3000000;
                return true;
            });
        }

        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter && sortFilter.value) {
            const sv = sortFilter.value;
            if (sv === 'price_asc') {
                products.sort((a, b) => ProductDB.getDiscountedPrice(a) - ProductDB.getDiscountedPrice(b));
            } else if (sv === 'price_desc') {
                products.sort((a, b) => ProductDB.getDiscountedPrice(b) - ProductDB.getDiscountedPrice(a));
            } else if (sv === 'newest') {
                products.sort((a, b) => b.id - a.id); // Higher ID means newer
            }
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
                    <td style="color:var(--admin-text-dim);font-weight:600;text-align:left;font-size:14px;">${p.sku || '<span style="font-weight:normal;font-style:italic">Đang cập nhật</span>'}</td>
                    <td>
                        <div class="product-cell">
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44?text=Khong+co+anh'">
                            <div class="product-cell-info">
                                <a href="/${p.slug || ''}" target="_blank" class="product-cell-name" style="text-decoration:none;">${p.name}</a>
                                <span class="product-cell-cat">${ProductDB.getCategoryName(p.categoryId)} &bull; ID: ${p.id}</span>
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
    
    const btnTrashProducts = document.getElementById('btnTrashProducts');
    if (btnTrashProducts) {
        btnTrashProducts.addEventListener('click', () => {
            showingTrash = !showingTrash;
            if (showingTrash) {
                btnTrashProducts.innerHTML = '<i class="fa-solid fa-arrow-left"></i> Quay lại';
                btnTrashProducts.style.background = '#64748b';
                document.querySelector('#section-products .table-header-left h3').innerText = 'Thùng rác sản phẩm';
            } else {
                btnTrashProducts.innerHTML = '<i class="fa-solid fa-trash"></i> Thùng rác';
                btnTrashProducts.style.background = '#ef4444';
                document.querySelector('#section-products .table-header-left h3').innerText = 'Danh sách sản phẩm';
            }
            renderProducts(true);
        });
    }

    window.restoreProduct = function(id) {
        if(confirm('Bạn có chắc chắn muốn khôi phục sản phẩm này?')) {
            if(window.ProductDB.restore(id)) {
                showToast('Khôi phục thành công', 'success');
                renderProducts();
            }
        }
    };

    window.permanentDeleteProduct = function(id, name) {
        if(confirm('Bạn có chắc chắn muốn xóa VĨNH VIỄN sản phẩm "' + name + '"? Hành động này không thể hoàn tác!')) {
            if(window.ProductDB.permanentDelete(id)) {
                showToast('Đã xóa vĩnh viễn', 'success');
                renderProducts();
            }
        }
    };

    document.getElementById('productSearch').addEventListener('input', () => renderProducts(true));
    document.getElementById('categoryFilter').addEventListener('change', () => renderProducts(true));
    if (document.getElementById('priceFilter')) {
        document.getElementById('priceFilter').addEventListener('change', () => renderProducts(true));
    }
    if (document.getElementById('sortFilter')) {
        document.getElementById('sortFilter').addEventListener('change', () => renderProducts(true));
    }

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
    if (document.getElementById('comboTotalPriceInput')) {
        document.getElementById('comboTotalPriceInput').addEventListener('input', formatCurrencyInput);
    }

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
        if (document.getElementById('productSku')) document.getElementById('productSku').value = '';
        document.getElementById('productDiscount').value = '0';
        document.getElementById('productFinalPrice').value = '';
        if (document.getElementById('productBadgeText')) document.getElementById('productBadgeText').value = '';
        if (document.getElementById('productBadgeColor')) document.getElementById('productBadgeColor').value = '#ef4444';
        
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
            if (document.getElementById('productSku')) document.getElementById('productSku').value = product.sku || '';
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
            if (document.getElementById('productBadgeText')) document.getElementById('productBadgeText').value = product.badgeText || '';
            if (document.getElementById('productBadgeColor')) document.getElementById('productBadgeColor').value = product.badgeColor || '#ef4444';
            if (document.getElementById('comboProductId')) document.getElementById('comboProductId').value = product.comboProductId || '';
            if (document.getElementById('comboDiscountText')) document.getElementById('comboDiscountText').value = product.comboDiscountText || '';
            
            const recs = product.recommendedProducts || [];
            if (document.getElementById('recProduct1')) document.getElementById('recProduct1').value = recs[0] || '';
            if (document.getElementById('recProduct2')) document.getElementById('recProduct2').value = recs[1] || '';
            if (document.getElementById('recProduct3')) document.getElementById('recProduct3').value = recs[2] || '';
            
            const imgs = product.images || [];
            window.currentAdditionalImages = [...imgs];
            
            if (document.getElementById('comboTotalPriceInput')) document.getElementById('comboTotalPriceInput').value = product.comboTotalPrice ? product.comboTotalPrice.toLocaleString('vi-VN').replace(/,/g, '.') : '';
            
            updateImagePreview();
            renderAdditionalImages();
        } else {
            title.textContent = 'Thêm sản phẩm mới';
            let nextSkuNumber = 1;
            ProductDB.getAll().forEach(p => {
                if (p.sku && p.sku.startsWith('SP-')) {
                    const num = parseInt(p.sku.replace('SP-', ''), 10);
                    if (!isNaN(num) && num >= nextSkuNumber) {
                        nextSkuNumber = num + 1;
                    }
                }
            });
            if (document.getElementById('productSku')) {
                document.getElementById('productSku').value = 'SP-' + nextSkuNumber.toString().padStart(3, '0');
            }
            
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
                window.compressImage(file, 800, function(dataUrl) {
                    if (dataUrl) {
                        document.getElementById('productImage').value = dataUrl;
                        updateImagePreview();
                    }
                });
            }
        });
    }

    // Additional images logic
    window.currentAdditionalImages = [];
    
    window.renderAdditionalImages = function() {
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
                window.compressImage(file, 800, function(dataUrl) {
                    if (dataUrl) {
                        window.currentAdditionalImages.push(dataUrl);
                        renderAdditionalImages();
                    }
                    additionalImageUpload.value = ''; // Reset for next selection
                });
            }
        });
    }

    // Save product
    document.getElementById('btnSaveProduct').addEventListener('click', async (e) => {
        if(e) e.preventDefault();
        const name = document.getElementById('productName').value.trim();
        const categoryId = document.getElementById('productCategory').value;
        const priceRaw = document.getElementById('productPrice').value.replace(/\./g, '');

        if (!name || !categoryId || !priceRaw) {
            showToast('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
            return;
        }

        let mainImage = document.getElementById('productImage').value.trim();
        const btnSave = document.getElementById('btnSaveProduct');
        const originalBtnText = btnSave.innerHTML;
        
        try {
            btnSave.disabled = true;
            btnSave.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Đang lưu...';

            if (mainImage.startsWith('data:image')) {
                const res = await fetch('/upload-image.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: mainImage, type: 'product' })
                });
                const textResponse = await res.text();
                try {
                    const resData = JSON.parse(textResponse);
                    if (resData.success) {
                        mainImage = resData.url;
                    } else {
                        throw new Error(resData.message);
                    }
                } catch (e) {
                    console.warn('PHP upload failed, falling back to Base64 (Local Environment)');
                    // Keep mainImage as Base64
                }
            }

            const processedAdditionalImages = [];
            for (let i = 0; i < window.currentAdditionalImages.length; i++) {
                let img = window.currentAdditionalImages[i];
                if (img.startsWith('data:image')) {
                    const res = await fetch('/upload-image.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ image: img, type: 'product' })
                    });
                    const textResponse = await res.text();
                    try {
                        const resData = JSON.parse(textResponse);
                        if (resData.success) {
                            processedAdditionalImages.push(resData.url);
                        } else {
                            throw new Error(resData.message);
                        }
                    } catch (e) {
                        console.warn('PHP upload failed for additional image, falling back to Base64');
                        processedAdditionalImages.push(img); // Keep as Base64
                    }
                } else {
                    processedAdditionalImages.push(img);
                }
            }

            let savePrice = parseInt(priceRaw);
            let saveDiscount = parseInt(document.getElementById('productDiscount').value) || 0;
            const inputFinalPrice = document.getElementById('productFinalPrice').value ? parseInt(document.getElementById('productFinalPrice').value.replace(/\./g, '')) : 0;
            
            if (inputFinalPrice > savePrice) {
                savePrice = inputFinalPrice;
                saveDiscount = 0;
            } else if (inputFinalPrice === savePrice) {
                saveDiscount = 0;
            }

            
            let autoSeoDesc = document.getElementById('productSeoDesc') ? document.getElementById('productSeoDesc').value.trim() : '';
            if (!autoSeoDesc) {
                let temp = document.createElement('div');
                temp.innerHTML = document.getElementById('productDescription').value.trim();
                let cleanText = temp.textContent || temp.innerText || "";
                autoSeoDesc = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');
            }

            const data = {
                name,
                sku: document.getElementById('productSku') ? document.getElementById('productSku').value.trim() : '',
                categoryId: parseInt(categoryId),
                price: savePrice,
                discount: saveDiscount,
                image: mainImage,
                description: document.getElementById('productDescription').value.trim(),
                specs: document.getElementById('productSpecs').value.trim(),
                featured: document.getElementById('productFeatured').checked,
                onSale: document.getElementById('productOnSale').checked,
                active: document.getElementById('productActive') ? document.getElementById('productActive').checked : true,
                badgeText: document.getElementById('productBadgeText') ? document.getElementById('productBadgeText').value.trim() : '',
                badgeColor: document.getElementById('productBadgeColor') ? document.getElementById('productBadgeColor').value : '#ef4444',
                images: processedAdditionalImages,
                comboProductId: document.getElementById('comboProductId') ? (parseInt(document.getElementById('comboProductId').value) || null) : null,
                comboDiscountText: document.getElementById('comboDiscountText') ? document.getElementById('comboDiscountText').value.trim() : '',
                comboTotalPrice: document.getElementById('comboTotalPriceInput') ? parseInt(document.getElementById('comboTotalPriceInput').value.replace(/\D/g, '')) || 0 : 0,
                recommendedProducts: [
                    document.getElementById('recProduct1') ? parseInt(document.getElementById('recProduct1').value) || null : null,
                    document.getElementById('recProduct2') ? parseInt(document.getElementById('recProduct2').value) || null : null,
                    document.getElementById('recProduct3') ? parseInt(document.getElementById('recProduct3').value) || null : null
                ].filter(id => id !== null),
                slug: document.getElementById('productSlug') ? document.getElementById('productSlug').value.trim() : '',
                seoTitle: document.getElementById('productSeoTitle') ? document.getElementById('productSeoTitle').value.trim() : '',
                seoDesc: autoSeoDesc
            };

            const rec1Val = document.getElementById('recProduct1') ? parseInt(document.getElementById('recProduct1').value) : null;
            const rec2Val = document.getElementById('recProduct2') ? parseInt(document.getElementById('recProduct2').value) : null;
            const rec3Val = document.getElementById('recProduct3') ? parseInt(document.getElementById('recProduct3').value) : null;
            data.recommendedProducts = [rec1Val, rec2Val, rec3Val].filter(v => v);
            
            if (document.getElementById('comboTotalPriceInput') && document.getElementById('comboTotalPriceInput').value) {
                data.comboTotalPrice = parseInt(document.getElementById('comboTotalPriceInput').value.replace(/\./g, ''));
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
        } catch (error) {
            console.error(error);
            showToast('Đã xảy ra lỗi: ' + error.message + ' (Bạn có đang chạy trên môi trường có hỗ trợ PHP không?)', 'error');
        } finally {
            btnSave.disabled = false;
            btnSave.innerHTML = originalBtnText;
        }
    });

    document.getElementById('btnAddProduct').addEventListener('click', () => openProductModal());

    // ========== SALE OFF 50% ==========
    window.renderSaleOff = function() {
        const products = ProductDB.getAll(true).filter(p => p.isSaleOff50);
        const tbody = document.getElementById('saleOffTableBody');
        
        if (!tbody) return;

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="table-empty"><i class="fa-solid fa-tags"></i> Chưa có sản phẩm Sale Off 50%</td></tr>';
            return;
        }

        tbody.innerHTML = products.map((p, index) => {
            const discountedPrice = ProductDB.getDiscountedPrice(p);
            return `
                <tr>
                    <td style="color:var(--admin-text-dim);font-weight:600;text-align:center;">${p.id}</td>
                    <td>
                        <div class="product-cell">
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/44?text=Khong+co+anh'">
                            <div>
                                <a href="/${p.slug || ''}" target="_blank" style="font-weight:600; color:var(--admin-text); text-decoration:none; display:block;">${p.name}</a>
                                <div style="font-size:12px; color:var(--admin-text-dim);">Danh mục: ${ProductDB.getCategoryById(p.categoryId)?.name || 'N/A'}</div>
                            </div>
                        </div>
                    </td>
                    <td style="text-align:right;">
                        <span style="text-decoration:line-through; color:var(--admin-text-dim); font-size:12px; display:block;">
                            ${ProductDB.formatPrice(p.price)}
                        </span>
                        <strong style="color:var(--color-danger);">${ProductDB.formatPrice(discountedPrice)}</strong>
                    </td>
                    <td style="text-align:center;">
                        <span class="status-badge" style="background:#fff0f0; color:var(--color-danger); border:1px solid #ffd0d0;">Sale Off 50%</span>
                    </td>
                    <td style="text-align:center;">
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="openProductModal(${p.id})" title="Sửa sản phẩm">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    };
    if (document.getElementById('saleOffTableBody')) {
        renderSaleOff();
    }
});
