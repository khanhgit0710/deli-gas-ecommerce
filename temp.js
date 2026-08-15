
        document.addEventListener('DOMContentLoaded', () => {
            // Get product ID or Slug from URL
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            let productSlug = urlParams.get('slug');

            // Nên ta cần bóc tách slug trực tiếp từ đường dẫn (VD: /gas-saigon-petro-xanh-12kg)
            if (!productSlug) {
                const pathSegments = window.location.pathname.split('/').filter(Boolean);
                if (pathSegments.length > 0) {
                    // Nếu URL là /san-pham/slug
                    if (pathSegments.length >= 2 && (pathSegments[0] === 'chi-tiet-san-pham' || pathSegments[0] === 'san-pham')) {
                        productSlug = pathSegments[1].replace('.html', '');
                    } else {
                        // Nếu URL là /slug (Root URL)
                        productSlug = pathSegments[pathSegments.length - 1].replace('.html', '');
                    }
                }
            }

            let currentProduct = null;

            if (productSlug) {
                const product = ProductDB.getBySlug(productSlug);
                if (product) {
                    loadProductDetails(product.id);
                } else {
                    loadProductDetails(0); // Not found
                }
            } else if (productId) {
                loadProductDetails(parseInt(productId));
            } else {
                // If no ID or valid slug, fallback to demo ID 1
                loadProductDetails(1);
            }

            function loadProductDetails(id) {
                const product = ProductDB.getById(id);
                if (!product) {
                    document.querySelector('.container').innerHTML = `
                        <div style="text-align:center; padding: 100px 20px;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size: 64px; color: var(--color-danger); margin-bottom: 20px;"></i>
                            <h2 style="font-size: 24px; color: var(--color-primary-dark); margin-bottom: 10px;">Sản phẩm không tồn tại</h2>
                            <p style="color: var(--color-gray-600); margin-bottom: 30px;">Xin lỗi, sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                            <a href="/san-pham" class="pd-btn pd-btn-primary" style="text-decoration: none; display: inline-block;">Quay lại cửa hàng</a>
                        </div>
                    `;
                    return;
                }

                currentProduct = product;

                // Set Breadcrumb
                const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
                if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;

                const breadcrumbCategory = document.getElementById('breadcrumbCategory');
                if (breadcrumbCategory) {
                    const category = ProductDB.getCategories().find(c => c.id === product.categoryId);
                    if (category) {
                        breadcrumbCategory.textContent = category.name;
                        breadcrumbCategory.href = `/${category.slug || category.id}`;
                    }
                }

                // Set Title & Badge
                const title = document.querySelector('.pd-title');
                if (title) title.textContent = product.name;

                const badge = document.querySelector('.pd-badge');
                if (badge) {
                    if (product.discount > 0) {
                        badge.textContent = `Giảm ${product.discount}%`;
                        badge.style.display = 'inline-block';
                    } else {
                        badge.style.display = 'none';
                    }
                }

                // Render dynamic reviews
                renderReviews(product.id);

                // Set Images
                const mainImg = document.getElementById('pdMainImage');
                if (mainImg) mainImg.src = product.image;

                const lightboxMain = document.getElementById('lightboxMainImage');
                if (lightboxMain) lightboxMain.src = product.image;

                // Update Thumbnails
                const thumbnailsContainer = document.getElementById('pdThumbnails');
                if (thumbnailsContainer) {
                    window.imageLightboxImages = [product.image];
                    let thumbsHTML = `<img loading="lazy" src="${product.image}" class="pd-thumb-img active" onclick="document.getElementById('pdMainImage').src=this.src; document.querySelectorAll('.pd-thumb-img').forEach(el=>el.classList.remove('active')); this.classList.add('active');">`;

                    const imgs = product.images || product.thumbnails;
                    if (imgs && imgs.length > 0) {
                        const additionalImgs = imgs.slice(0, 6);
                        window.imageLightboxImages = [...window.imageLightboxImages, ...additionalImgs];

                        additionalImgs.forEach((img, idx) => {
                            thumbsHTML += `<img loading="lazy" src="${img}" class="pd-thumb-img" onclick="document.getElementById('pdMainImage').src=this.src; document.querySelectorAll('.pd-thumb-img').forEach(el=>el.classList.remove('active')); this.classList.add('active');">`;
                        });
                    }

                    // Hide thumbnails container entirely if there's only 1 image
                    if (window.imageLightboxImages.length <= 1) {
                        thumbnailsContainer.style.display = 'none';
                    } else {
                        thumbnailsContainer.style.display = 'flex';
                        // Update onclick handlers to also change lightbox index
                        thumbnailsContainer.innerHTML = thumbsHTML;
                        const renderedThumbs = thumbnailsContainer.querySelectorAll('.pd-thumb-img');
                        renderedThumbs.forEach((el, index) => {
                            const originalClick = el.onclick;
                            el.onclick = function (e) {
                                originalClick.call(this, e);
                                document.getElementById('pdMainImage').onclick = () => openImageLightbox(index);
                            };
                        });
                    }
                    document.getElementById('pdMainImage').onclick = () => openImageLightbox(0);
                }

                // Set Prices
                const discountedPrice = ProductDB.getDiscountedPrice(product);
                const priceCurrent = document.querySelector('.pd-price');
                const priceOld = document.querySelector('.pd-price-old');
                const saveBadge = document.querySelector('.pd-save-badge');

                if (priceCurrent) priceCurrent.textContent = ProductDB.formatPrice(discountedPrice);

                if (product.discount > 0) {
                    if (priceOld) {
                        priceOld.textContent = ProductDB.formatPrice(product.price);
                        priceOld.style.display = 'inline-block';
                    }
                    if (saveBadge) {
                        saveBadge.textContent = `(Tiết kiệm ${ProductDB.formatPrice(product.price - discountedPrice)})`;
                        saveBadge.style.display = 'inline-block';
                    }
                } else {
                    if (priceOld) priceOld.style.display = 'none';
                    if (saveBadge) saveBadge.style.display = 'none';
                }

                // Set Description
                const desc = document.querySelector('.pd-desc-short');
                if (desc) desc.textContent = product.description || 'Sản phẩm chính hãng chất lượng cao.';
                
                const fullDesc = document.querySelector('#description .pd-tab-pane');
                if (fullDesc) fullDesc.innerHTML = '<p>' + (product.description || 'Sản phẩm chính hãng chất lượng cao.') + '</p>';

                // Set Meta Data
                const pdBrand = document.getElementById('pdBrand');
                if (pdBrand) {
                    pdBrand.textContent = `Mã SKU: ${product.sku || 'Đang cập nhật'}`;
                }

                const pdWeight = document.getElementById('pdWeight');
                const pdWeightDivider = document.getElementById('pdWeightDivider');
                const pdVariations = document.getElementById('pdVariations');

                // Check if the product is a Gas cylinder (Categories 1-5 usually represent Gas Cylinders)
                if (product.categoryId <= 5) {
                    // It's a gas cylinder, show weight and variations
                    // Extract weight from product name if possible, else default 12kg
                    const weightMatch = product.name.match(/\b(12|12\.5|45)kg\b/i);
                    const weightText = weightMatch ? weightMatch[0] : '12kg';

                    if (pdWeight) {
                        pdWeight.style.display = 'inline-block';
                        pdWeight.textContent = `Trọng lượng: ${weightText}`;
                    }
                    if (pdWeightDivider) pdWeightDivider.style.display = 'inline-block';
                    if (pdVariations) {
                        pdVariations.style.display = 'block';
                        const varOptions = pdVariations.querySelector('.variation-options');
                        if (varOptions) {
                            varOptions.innerHTML = `<button type="button" class="var-btn active">${weightText}</button>`;
                        }
                    }
                } else {
                    // Not a gas cylinder, hide weight and variations
                    if (pdWeight) pdWeight.style.display = 'none';
                    if (pdWeightDivider) pdWeightDivider.style.display = 'none';
                    if (pdVariations) pdVariations.style.display = 'none';
                }

                // Set Specs Tab & Summary
                const specsTab = document.querySelector('#specs .pd-tab-pane');
                const pdSpecsSummary = document.getElementById('pdSpecsSummary');
                
                if (product.specs) {
                    const specLines = product.specs.split('\n').filter(line => line.trim() !== '');
                    
                    // Specs Tab
                    if (specsTab && specLines.length > 0) {
                        specsTab.innerHTML = '<ul>' + specLines.map(line => `<li>${line}</li>`).join('') + '</ul>';
                    }
                    
                    // Specs Summary Grid
                    if (pdSpecsSummary && specLines.length > 0) {
                        let gridHtml = '';
                        // Always include SKU if not in specs
                        if (!product.specs.toLowerCase().includes('sku')) {
                             gridHtml += `<div style="color: var(--color-gray-500);">Mã SKU:</div><div style="font-weight: 500;">${product.sku || 'Đang cập nhật'}</div>`;
                        }
                        
                        specLines.forEach(line => {
                            const parts = line.split(':');
                            if (parts.length >= 2) {
                                const key = parts[0].trim() + ':';
                                const value = parts.slice(1).join(':').trim();
                                gridHtml += `<div style="color: var(--color-gray-500);">${key}</div><div style="font-weight: 500;">${value}</div>`;
                            } else {
                                // If no colon, just show as value spanning 2 cols or something, but standard is key: value
                                gridHtml += `<div style="color: var(--color-gray-500); grid-column: span 2;">${line}</div>`;
                            }
                        });
                        
                        // Default "Tình trạng" if not exist in specs
                        if (!product.specs.toLowerCase().includes('tình trạng')) {
                            gridHtml += `<div style="color: var(--color-gray-500);">Tình trạng:</div><div style="font-weight: 500; color: #10b981;">Còn mới</div>`;
                        }
                        
                        pdSpecsSummary.innerHTML = `
                            <div style="font-weight: 600; font-size: 16px; margin-bottom: 10px; color: var(--color-gray-800);">
                                Thông số kỹ thuật</div>
                            <div style="display: grid; grid-template-columns: 120px 1fr; gap: 8px; font-size: 15px;">
                                ${gridHtml}
                            </div>
                        `;
                        pdSpecsSummary.style.display = 'block';
                    } else if (pdSpecsSummary) {
                        pdSpecsSummary.style.display = 'none';
                    }
                } else {
                    if (specsTab) specsTab.innerHTML = '<p>Chưa có thông số kỹ thuật.</p>';
                    if (pdSpecsSummary) pdSpecsSummary.style.display = 'none';
                }

                // Document Title
                document.title = `${product.name} | Gas Lê Mạnh`;

                // ===== FLASH DEAL =====
                const flashDealEl = document.querySelector('.pd-flash-deal');
                if (flashDealEl) {
                    if (product.onSale || product.discount > 0) {
                        flashDealEl.style.display = 'flex';

                        let unit = 'sản phẩm';
                        if (product.categoryId >= 1 && product.categoryId <= 5) unit = 'bình';
                        else if (product.categoryId === 6 || product.categoryId === 7) unit = 'chiếc';
                        else if (product.categoryId === 8) unit = 'cái';
                        else if (product.categoryId === 9) unit = 'bộ';

                        const progressText = document.querySelector('.progress-text');
                        const progressFill = document.querySelector('.progress-fill');
                        if (progressText && progressFill) {
                            const maxSold = 30 + (product.id % 20);
                            const sold = Math.floor(maxSold * 0.7) + (product.id % 5);
                            const percent = Math.round((sold / maxSold) * 100);
                            progressFill.style.width = percent + '%';
                            progressText.textContent = `🔥 Đã bán ${sold}/${maxSold} ${unit}`;
                        }
                    } else {
                        flashDealEl.style.display = 'none';
                    }
                }

                // ===== COMBO DEAL =====
                const giftBox = document.querySelector('.pd-gift-box');
                if (giftBox) {
                    if (product.comboProductId) {
                        const comboProduct = ProductDB.getById(product.comboProductId);
                        if (comboProduct) {
                            const comboText = product.comboDiscountText || `Tặng kèm ${comboProduct.name} hoặc giảm giá đặc biệt`;
                            const comboPriceHtml = product.comboTotalPrice ? `<div style="font-weight: bold; color: var(--color-accent); margin-top: 5px;">Giá ưu đãi chung: ${ProductDB.formatPrice(product.comboTotalPrice)}</div>` : '';
                            giftBox.innerHTML = `
                                <div class="gift-header">
                                    <i class="fa-solid fa-gift"></i> Ưu Đãi Mua Kèm (SL có hạn)
                                </div>
                                <div class="gift-item">
                                    <img loading="lazy" src="${comboProduct.image}" onerror="this.src='https://via.placeholder.com/80'" alt="${comboProduct.name}">
                                    <div class="gift-info">
                                        <p>${comboText}</p>
                                        ${comboPriceHtml}
                                    </div>
                                    <input type="checkbox" checked>
                                </div>
                            `;
                            giftBox.style.display = 'block';
                        } else {
                            giftBox.style.display = 'none';
                        }
                    } else {
                        giftBox.style.display = 'none';
                    }
                }

                renderRelatedProducts(product.categoryId, product.id);
            }

            function renderRelatedProducts(categoryId, currentId) {
                const slider = document.getElementById('relatedSlider');
                if (!slider) return;

                // Fetch related products based on logic: Gas (1-5) -> Gas; Stove (6-7) -> Stove
                let isGas = categoryId >= 1 && categoryId <= 5;
                let isStove = categoryId >= 6 && categoryId <= 7;

                let related = ProductDB.getAll().filter(p => {
                    if (p.id === currentId) return false;
                    if (isGas) return p.categoryId >= 1 && p.categoryId <= 5;
                    if (isStove) return p.categoryId >= 6 && p.categoryId <= 7;
                    return p.categoryId === categoryId;
                });

                related = related.sort(() => 0.5 - Math.random());

                // If not enough related, add random
                if (related.length < 8) {
                    let others = ProductDB.getAll().filter(p => p.id !== currentId && !related.find(r => r.id === p.id));
                    others = others.sort(() => 0.5 - Math.random());
                    related = related.concat(others.slice(0, 8 - related.length));
                }

                related = related.slice(0, 8); // Take top 8

                let html = related.map(p => {
                    const discountedPrice = ProductDB.getDiscountedPrice(p);
                    const hasDiscount = p.discount > 0;
                    return `
                        <div class="product-card">
                            ${hasDiscount ? `<div class="product-badge badge-discount">Giảm ${p.discount}%</div>` : (p.onSale ? '<div class="product-badge badge-discount" style="background-color: var(--color-accent); color: white;">Ưu đãi</div>' : (p.featured ? '<div class="product-badge badge-new">Mới</div>' : ''))}
                            <div class="product-img">
                                <a href="/${p.slug || p.id}"><img loading="lazy" src="${p.image}" alt="${p.name}"></a>
                            </div>
                            <div class="product-info">
                                <h3><a href="/${p.slug || p.id}" style="color: inherit; text-decoration: none;">${p.name}</a></h3>
                                <div class="product-price">
                                    <span class="price-current">${ProductDB.formatPrice(discountedPrice)}</span>
                                    ${hasDiscount ? `<span class="price-old">${ProductDB.formatPrice(p.price)}</span>` : ''}
                                </div>
                                <div class="product-actions">
                                    <button class="buy-now-btn" onclick="window.location.href='/${p.slug || p.id}'">Mua ngay</button>
                                    <button class="add-to-cart-btn"><i class="fa-solid fa-cart-plus"></i> Giỏ hàng</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');

                // Add "View All" card
                html += `
                    <div class="product-card view-all-card" style="display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; text-align: center; background-color: var(--color-gray-50); border: 2px dashed var(--color-gray-300);" onclick="window.location.href='/san-pham'">
                        <div class="view-all-icon" style="font-size: 3rem; color: var(--color-primary); margin-bottom: 15px; transition: transform 0.3s ease;">
                            <i class="fa-solid fa-arrow-right-long"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; color: var(--color-gray-900); font-weight: 600; margin-bottom: 10px;">Xem tất cả</h3>
                        <p style="color: var(--color-gray-600); font-size: 0.9rem; padding: 0 15px;">Khám phá thêm hàng trăm sản phẩm khác</p>
                    </div>
                `;

                slider.innerHTML = html;

                setTimeout(() => {
                    document.body.classList.add('loaded');
                }, 50);
            }
        });

        let currentRating = 0;
        const ratingTexts = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];

        function setRating(rating) {
            currentRating = rating;
            document.getElementById('reviewRating').value = rating;
            updateStars(rating);
        }

        function hoverRating(rating) {
            updateStars(rating);
        }

        function resetRating() {
            updateStars(currentRating);
        }

        function updateStars(rating) {
            const stars = document.querySelectorAll('#starRatingContainer i');
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.className = 'fa-solid fa-star';
                } else {
                    star.className = 'fa-regular fa-star';
                }
            });
            const text = rating > 0 ? ratingTexts[rating] : 'Vui lòng chọn sao';
            const textEl = document.getElementById('ratingText');
            if (textEl) textEl.textContent = text;
        }

        function submitReview() {
            const ratingInput = document.getElementById('reviewRating');
            if (ratingInput && parseInt(ratingInput.value) === 0) {
                if (typeof showToast === 'function') showToast('Vui lòng chọn số sao đánh giá!', 'error');
                else alert('Vui lòng chọn số sao đánh giá!');
                return;
            }
            
            const nameInput = document.getElementById('reviewName');
            const phoneInput = document.getElementById('reviewPhone');
            const contentInput = document.getElementById('reviewText');
            const imagesInput = document.getElementById('reviewImages');
            
            // Collect images as Data URLs
            const imagePromises = [];
            if (imagesInput && imagesInput.files.length > 0) {
                for (let i = 0; i < imagesInput.files.length; i++) {
                    const file = imagesInput.files[i];
                    imagePromises.push(new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.readAsDataURL(file);
                    }));
                }
            }
            
            Promise.all(imagePromises).then(imagesBase64 => {
                if (typeof currentProduct !== 'undefined' && currentProduct) {
                    ProductDB.addReview({
                        productId: currentProduct.id,
                        rating: parseInt(ratingInput.value),
                        name: nameInput ? nameInput.value.trim() : 'Khách hàng',
                        phone: phoneInput ? phoneInput.value.trim() : '',
                        content: contentInput ? contentInput.value.trim() : '',
                        images: imagesBase64
                    });
                }

                // Hide the form
                const formContainer = document.getElementById('reviewFormContainer');
                if (formContainer) {
                    formContainer.classList.remove('review-form-visible');
                    formContainer.classList.add('review-form-hidden');
                }

                // Reset form
                document.getElementById('reviewForm').reset();
                resetRating();
                setRating(0);
                if (document.getElementById('reviewImagePreviewContainer')) {
                    document.getElementById('reviewImagePreviewContainer').innerHTML = '';
                }

                // Show the write button again
                const writeBtn = document.getElementById('writeReviewBtn');
                if (writeBtn) {
                    writeBtn.style.display = 'inline-block';
                    setTimeout(() => writeBtn.style.opacity = '1', 50);
                }

                // Create and show success popup
                const popup = document.createElement('div');
                popup.innerHTML = `
                    <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 9999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;" id="successOverlay">
                        <div style="background: white; padding: 30px 20px; border-radius: 16px; text-align: center; max-width: 400px; width: 90%; transform: translateY(20px) scale(0.95); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 15px 30px rgba(0,0,0,0.1);" id="successModal">
                            <div style="width: 70px; height: 70px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 35px; margin: 0 auto 20px; box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);">
                                <i class="fa-solid fa-check"></i>
                            </div>
                            <h3 style="margin-bottom: 12px; font-size: 24px; color: var(--color-primary-dark); font-weight: 700;">Gửi thành công!</h3>
                            <p style="color: var(--color-gray-600); margin-bottom: 25px; line-height: 1.5; font-size: 15px;">Cảm ơn bạn đã đánh giá sản phẩm. Đánh giá của bạn sẽ được hiển thị sau khi kiểm duyệt.</p>
                            <button class="pd-btn pd-btn-primary" style="padding: 12px 30px; border-radius: 10px; font-weight: 600; width: 100%;" onclick="closeSuccessPopup()">Hoàn tất</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(popup);

                // Animate in
                setTimeout(() => {
                    document.getElementById('successOverlay').style.opacity = '1';
                    const modal = document.getElementById('successModal');
                    if (modal) modal.style.transform = 'translateY(0) scale(1)';
                }, 50);
            });
        }

        window.closeSuccessPopup = function () {
            const overlay = document.getElementById('successOverlay');
            const modal = document.getElementById('successModal');
            if (overlay && modal) {
                overlay.style.opacity = '0';
                modal.style.transform = 'translateY(20px) scale(0.95)';
                setTimeout(() => {
                    overlay.parentElement.remove();
                }, 300);
            }
        }
        
        function renderReviews(productId) {
            let reviews = ProductDB.getReviewsByProductId(productId);
            reviews = reviews.filter(r => r.status === 'approved');
            
            const reviewList = document.getElementById('reviewListContainer') || document.querySelector('.pd-review-list');
            const ugcSection = document.getElementById('ugcSection');
            const ugcTitle = document.getElementById('ugcTitle');
            const ugcGallery = document.getElementById('ugcGallery');
            
            let avgRating = 0;
            let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            if (reviews.length > 0) {
                const sum = reviews.reduce((acc, r) => {
                    let rate = parseInt(r.rating || 5);
                    if(rate > 5) rate = 5; if(rate < 1) rate = 1;
                    ratingCounts[rate] = (ratingCounts[rate] || 0) + 1;
                    return acc + rate;
                }, 0);
                avgRating = (sum / reviews.length).toFixed(1);
            } else {
                avgRating = '0';
            }
            
            const totalReviewCountEl = document.getElementById('totalReviewCount');
            const headerReviewCountEl = document.getElementById('headerReviewCount');
            const headerRatingTextEl = document.getElementById('headerRatingText');
            const headerRatingStarsHtml = document.getElementById('headerRatingStarsHtml');
            const averageRatingTextEl = document.getElementById('averageRatingText');
            const averageRatingStarsHtml = document.getElementById('averageRatingStars');
            
            if (totalReviewCountEl) totalReviewCountEl.textContent = reviews.length;
            if (headerReviewCountEl) headerReviewCountEl.textContent = reviews.length;
            if (headerRatingTextEl) headerRatingTextEl.textContent = avgRating;
            if (averageRatingTextEl) averageRatingTextEl.textContent = avgRating;
            
            let starsHtml = '';
            const numAvg = parseFloat(avgRating);
            const fullStars = Math.floor(numAvg);
            const hasHalfStar = (numAvg - fullStars) >= 0.5;
            for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
            if (hasHalfStar) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
            for (let i = 0; i < emptyStars; i++) starsHtml += '<i class="fa-regular fa-star"></i>';
            
            if (headerRatingStarsHtml) headerRatingStarsHtml.innerHTML = starsHtml;
            if (averageRatingStarsHtml) averageRatingStarsHtml.innerHTML = starsHtml;
            
            for (let i = 1; i <= 5; i++) {
                const count = ratingCounts[i];
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                const barEl = document.getElementById(`bar-${i}`);
                const pctEl = document.getElementById(`percent-${i}`);
                if (barEl) barEl.style.width = `${pct}%`;
                if (pctEl) pctEl.textContent = `${pct}%`;
            }
            
            let allImages = [];
            reviews.forEach(r => {
                if (r.images && r.images.length > 0) {
                    allImages = allImages.concat(r.images);
                }
            });
            
            if (ugcSection && ugcTitle && ugcGallery) {
                if (allImages.length > 0) {
                    ugcTitle.innerHTML = `<i class="fa-solid fa-camera" style="margin-right: 8px; color: var(--color-accent);"></i> Hình ảnh thực tế từ người mua (${allImages.length})`;
                    ugcGallery.innerHTML = allImages.map((img, idx) => `
                        <img loading="lazy" src="${img}" alt="Khách hàng ${idx+1}" onclick="openLightboxForUGC(this.src)">
                    `).join('');
                    ugcSection.style.display = 'block';
                } else {
                    ugcSection.style.display = 'none';
                    ugcGallery.innerHTML = '';
                }
            }
            
            if (reviews.length === 0) {
                reviewList.innerHTML = '<p style="text-align: center; color: var(--color-gray-500); margin: 20px 0;">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!</p>';
                return;
            }
            
            let html = '';
            reviews.forEach(r => {
                const avatarChar = r.name.charAt(0).toUpperCase();
                const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                const bgColor = colors[r.name.charCodeAt(0) % colors.length];
                const date = new Date(r.createdAt).toLocaleDateString('vi-VN');
                
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= r.rating) starsHtml += '<i class="fa-solid fa-star"></i>';
                    else starsHtml += '<i class="fa-regular fa-star"></i>';
                }
                
                let imagesHtml = '';
                if (r.images && r.images.length > 0) {
                    imagesHtml = '<div class="pd-review-images" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">';
                    r.images.forEach(img => {
                        imagesHtml += `<img loading="lazy" src="${img}" alt="Review Image" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 1px solid var(--color-gray-200);" onclick="openLightboxForUGC(this.src)">`;
                    });
                    imagesHtml += '</div>';
                }
                
                html += `
                    <div class="pd-review-item">
                        <div class="pd-review-header">
                            <div class="pd-reviewer-info">
                                <div class="pd-reviewer-avatar" style="background-color: ${bgColor}; color: white;">${avatarChar}</div>
                                <div>
                                    <div class="pd-reviewer-name">${r.name}</div>
                                    <div class="pd-reviewer-stars">${starsHtml}</div>
                                </div>
                            </div>
                            <div class="pd-review-date">${date}</div>
                        </div>
                        <div class="pd-review-content">
                            <p>${r.content}</p>
                            ${imagesHtml}
                        </div>
                    </div>
                `;
            });
            reviewList.innerHTML = html;
        }

        // Image preview logic
        document.addEventListener('DOMContentLoaded', () => {
            const reviewImagesInput = document.getElementById('reviewImages');
            const previewContainer = document.getElementById('reviewImagePreviewContainer');
            
            if (reviewImagesInput && previewContainer) {
                reviewImagesInput.addEventListener('change', function() {
                    previewContainer.innerHTML = '';
                    if (this.files && this.files.length > 0) {
                        Array.from(this.files).forEach(file => {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const img = document.createElement('img');
                                img.src = e.target.result;
                                img.style.width = '60px';
                                img.style.height = '60px';
                                img.style.objectFit = 'cover';
                                img.style.borderRadius = '6px';
                                img.style.border = '1px solid #ddd';
                                previewContainer.appendChild(img);
                            }
                            reader.readAsDataURL(file);
                        });
                    }
                });
            }
        });

        // === DYNAMIC PRODUCT LOADING ===
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof ProductDB === 'undefined') return;
            if (typeof ProductDB.init === 'function') ProductDB.init();
            else if (typeof ProductDB.initAsync === 'function') ProductDB.initAsync();
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');
            if (!productId) return;

            const product = ProductDB.getById(productId);
            if (!product) return;

            // Update Page Title and Breadcrumb
            document.title = product.name + ' | Gas Lê Mạnh';
            const breadcrumbs = document.querySelectorAll('.pd-breadcrumbs a');
            const breadcrumbCurrent = document.querySelector('.pd-breadcrumbs .current');
            if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;
            if (breadcrumbs.length > 2) {
                if (product.categoryId === 9) {
                    breadcrumbs[2].textContent = 'Combo Khuyến Mãi';
                    breadcrumbs[2].href = '/san-pham';
                }
            }

            // Update Title
            const titleEl = document.querySelector('.pd-title');
            if (titleEl) titleEl.textContent = product.name;

            // Update Brand/Weight if combo
            if (product.categoryId === 9) {
                const brandEl = document.getElementById('pdBrand');
                if (brandEl) brandEl.textContent = `Mã SKU: ${product.sku || 'Đang cập nhật'}`;
                const weightEl = document.getElementById('pdWeight');
                if (weightEl) weightEl.style.display = 'none';
                const weightDivider = document.getElementById('pdWeightDivider');
                if (weightDivider) weightDivider.style.display = 'none';
                const variations = document.getElementById('pdVariations');
                if (variations) variations.style.display = 'none';
            }

            // Update Image
            if (product.image) {
                const mainImg = document.getElementById('pdMainImage');
                if (mainImg) mainImg.src = product.image;

                // Update Thumbnails
                const thumbnailsContainer = document.getElementById('pdThumbnails');
                if (thumbnailsContainer) {
                    window.imageLightboxImages = [product.image];
                    let thumbsHTML = `<img loading="lazy" src="${product.image}" class="pd-thumb-img active" onclick="document.getElementById('pdMainImage').src=this.src; document.querySelectorAll('.pd-thumb-img').forEach(el=>el.classList.remove('active')); this.classList.add('active');">`;

                    const imgs = product.images || product.thumbnails;
                    if (imgs && imgs.length > 0) {
                        const additionalImgs = imgs.slice(0, 6);
                        window.imageLightboxImages = [...window.imageLightboxImages, ...additionalImgs];

                        additionalImgs.forEach((img, idx) => {
                            thumbsHTML += `<img loading="lazy" src="${img}" class="pd-thumb-img" onclick="document.getElementById('pdMainImage').src=this.src; document.querySelectorAll('.pd-thumb-img').forEach(el=>el.classList.remove('active')); this.classList.add('active');">`;
                        });
                    }


                    // Hide thumbnails container entirely if there's only 1 image
                    if (window.imageLightboxImages.length <= 1) {
                        thumbnailsContainer.style.display = 'none';
                    } else {
                        thumbnailsContainer.style.display = 'flex';
                        // Update onclick handlers to also change lightbox index
                        thumbnailsContainer.innerHTML = thumbsHTML;
                        const renderedThumbs = thumbnailsContainer.querySelectorAll('.pd-thumb-img');
                        renderedThumbs.forEach((el, index) => {
                            const originalClick = el.onclick;
                            el.onclick = function (e) {
                                originalClick.call(this, e);
                                document.getElementById('pdMainImage').onclick = () => openImageLightbox(index);
                            };
                        });
                    }
                    document.getElementById('pdMainImage').onclick = () => openImageLightbox(0);
                }
            }

            // Update Price
            const priceEl = document.querySelector('.pd-price');
            const oldPriceEl = document.querySelector('.pd-price-old');
            const saveBadge = document.querySelector('.pd-save-badge');

            if (priceEl) priceEl.textContent = product.price.toLocaleString('vi-VN') + 'đ';
            if (product.oldPrice || product.discount) {
                const oldPrice = product.oldPrice || Math.round(product.price / (1 - product.discount / 100));
                if (oldPriceEl) {
                    oldPriceEl.textContent = oldPrice.toLocaleString('vi-VN') + 'đ';
                    oldPriceEl.style.display = 'inline-block';
                }
                if (saveBadge) {
                    saveBadge.textContent = '(Tiết kiệm ' + (oldPrice - product.price).toLocaleString('vi-VN') + 'đ)';
                    saveBadge.style.display = 'inline-block';
                }
            } else {
                if (oldPriceEl) oldPriceEl.style.display = 'none';
                if (saveBadge) saveBadge.style.display = 'none';
            }

            // Update Flash Deal Section
            const flashDealEl = document.querySelector('.pd-flash-deal');
            if (flashDealEl) {
                if (product.onSale || product.discount > 0) {
                    flashDealEl.style.display = 'flex';

                    let unit = 'sản phẩm';
                    if (product.categoryId >= 1 && product.categoryId <= 5) unit = 'bình';
                    else if (product.categoryId === 6 || product.categoryId === 7) unit = 'chiếc';
                    else if (product.categoryId === 8) unit = 'cái';
                    else if (product.categoryId === 9) unit = 'bộ';

                    const progressText = document.querySelector('.progress-text');
                    const progressFill = document.querySelector('.progress-fill');
                    if (progressText && progressFill) {
                        const maxSold = 30 + (product.id % 20);
                        const sold = Math.floor(maxSold * 0.7) + (product.id % 5);
                        const percent = Math.round((sold / maxSold) * 100);
                        progressFill.style.width = percent + '%';
                        progressText.textContent = `🔥 Đã bán ${sold}/${maxSold} ${unit}`;
                    }
                } else {
                    flashDealEl.style.display = 'none';
                }
            }

            // Update Description
            const shortDesc = document.querySelector('.pd-desc-short');
            if (shortDesc) shortDesc.textContent = product.description;

            const fullDesc = document.querySelector('#description .pd-tab-pane');
            if (fullDesc) fullDesc.innerHTML = '<p>' + product.description + '</p>';
            // Update Gift Box (Ưu Đãi Mua Kèm)
            const giftBox = document.getElementById('pdGiftBox');
            if (giftBox) {
                if (product.comboProductId) {
                    const comboProduct = ProductDB.getById(product.comboProductId);
                    if (comboProduct) {
                        giftBox.style.display = 'block';
                        giftBox.innerHTML = `
                            <div class="gift-header">
                                <i class="fa-solid fa-gift"></i> Ưu Đãi Mua Kèm (SL có hạn)
                            </div>
                            <div class="gift-item">
                                <img loading="lazy" src="${comboProduct.image}" alt="${comboProduct.name}">
                                <div class="gift-info">
                                    <p>${product.comboDiscountText || 'Mua kèm ' + comboProduct.name + ' với giá ưu đãi'}</p>
                                </div>
                                <input type="checkbox" checked>
                            </div>
                        `;
                    } else {
                        giftBox.style.display = 'none';
                    }
                } else {
                    giftBox.style.display = 'none';
                }
            }

            // Update Specs
            const specsSummary = document.getElementById('pdSpecsSummary');
            if (specsSummary && product.specs) {
                const specLines = product.specs.split('\n');
                let html = `
                    <div class="specs-accordion-header" onclick="toggleSpecs()">
                        <div class="specs-heading">Thông số kỹ thuật</div>
                        <i class="fa-solid fa-angles-right specs-toggle-icon" style="transform: rotate(90deg);"></i>
                    </div>
                    <div class="specs-accordion-content" id="specsContent" style="display: block;">
                `;
                specLines.forEach(line => {
                    const parts = line.split(':');
                    if (parts.length >= 2) {
                        html += `<div class="spec-row"><div class="spec-title">${parts[0].trim()}</div><div class="spec-desc">${parts.slice(1).join(':').trim()}</div></div>`;
                    } else {
                        html += `<div class="spec-row"><div class="spec-desc" style="width: 100%">${line}</div></div>`;
                    }
                });
                html += `</div>`;
                specsSummary.innerHTML = html;
            }
        });

        function toggleSpecs() {
            const content = document.getElementById('specsContent');
            const icon = document.querySelector('.specs-toggle-icon');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                icon.style.transform = 'rotate(90deg)';
            } else {
                content.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            }
        }

        window.currentImageLightboxIndex = 0;
        window.imageLightboxImages = [];

        function openImageLightbox(index = 0) {
            const modal = document.getElementById("imageLightbox");
            window.currentImageLightboxIndex = index;
            modal.style.display = "flex";
            updateImageLightboxContent();

            // Prevent scrolling
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
        }

        function updateImageLightboxContent() {
            const lightboxImg = document.getElementById("imageLightboxImg");
            if (window.imageLightboxImages.length === 0) {
                lightboxImg.src = document.getElementById("pdMainImage").src;
                return;
            }

            lightboxImg.src = window.imageLightboxImages[window.currentImageLightboxIndex];

            const thumbsContainer = document.getElementById("imageLightboxThumbnails");
            if (thumbsContainer) {
                if (window.imageLightboxImages.length <= 1) {
                    thumbsContainer.style.display = 'none';
                } else {
                    thumbsContainer.style.display = 'flex';
                    let html = '';
                    window.imageLightboxImages.forEach((img, idx) => {
                        const isActive = idx === window.currentImageLightboxIndex;
                        html += `<img loading="lazy" src="${img}" onclick="event.stopPropagation(); updateImageLightboxContentForIndex(${idx})" style="width: 70px; height: 70px; object-fit: cover; cursor: pointer; border: 2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}; opacity: ${isActive ? '1' : '0.5'}; background: white; margin: 0 5px; border-radius: 4px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.5); flex-shrink: 0; pointer-events: auto;">`;
                    });
                    thumbsContainer.innerHTML = html;

                    // Keep active thumbnail in view if scrollable
                    setTimeout(() => {
                        const activeThumb = thumbsContainer.children[window.currentImageLightboxIndex];
                        if (activeThumb) {
                            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }
                    }, 100);
                }
            }

            // Update counter
            const counter = document.getElementById("imageLightboxCounter");
            if (counter && window.imageLightboxImages.length > 0) {
                if (window.imageLightboxImages.length > 1) {
                    counter.style.display = 'block';
                    counter.textContent = `${window.currentImageLightboxIndex + 1} / ${window.imageLightboxImages.length}`;
                } else {
                    counter.style.display = 'none';
                }
            }
        }

        function updateImageLightboxContentForIndex(idx) {
            window.currentImageLightboxIndex = idx;
            updateImageLightboxContent();
        }

        function imageLightboxPrev(e) {
            e.stopPropagation();
            if (window.currentImageLightboxIndex > 0) {
                window.currentImageLightboxIndex--;
                updateImageLightboxContent();
            } else if (window.imageLightboxImages.length > 0) {
                window.currentImageLightboxIndex = window.imageLightboxImages.length - 1;
                updateImageLightboxContent();
            }
        }

        function imageLightboxNext(e) {
            e.stopPropagation();
            if (window.currentImageLightboxIndex < window.imageLightboxImages.length - 1) {
                window.currentImageLightboxIndex++;
                updateImageLightboxContent();
            } else if (window.imageLightboxImages.length > 0) {
                window.currentImageLightboxIndex = 0;
                updateImageLightboxContent();
            }
        }

        function closeImageLightbox(e) {
            if (e.target.id === 'imageLightbox' || e.target.className === 'lightbox-close') {
                const modal = document.getElementById("imageLightbox");
                modal.style.display = "none";
                document.body.style.overflow = "auto";
                document.documentElement.style.overflow = "auto";
            }
        }

        // Tabs functionality
        function scrollToSection(targetId) {
            // Force "Mô tả sản phẩm" to remain active always
            document.querySelectorAll('.pd-tab').forEach(tab => {
                if (tab.getAttribute('data-target') === 'description') {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Scroll to the section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const offset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    </script>
    <script defer src="/assets/js/client/product-db.js?v=6">