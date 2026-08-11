/**
 * Admin settings Module
 */
document.addEventListener('DOMContentLoaded', () => {
    let currentSliders = []; // Dynamic array for homepage sliders

    // ========== SETTINGS ==========
    window.renderSettings = function() {
        const settings = ProductDB.getSettings();
        document.getElementById('settingHotline').value = settings.hotline || '';
        document.getElementById('settingZalo').value = settings.zalo || '';
        document.getElementById('settingAddress').value = settings.address || '';
        document.getElementById('settingLogo').value = settings.logo || '';
        if(document.getElementById('settingFavicon')) document.getElementById('settingFavicon').value = settings.favicon || '';
        document.getElementById('settingShowComboSection').checked = settings.showComboSection !== false; // Default true
        
        const banners = settings.banners || {};
        
        // Initialize dynamic sliders
        currentSliders = banners.sliders || [];
        // Backward compatibility for old slider1, slider2, slider3
        if (currentSliders.length === 0) {
            if (banners.slider1) currentSliders.push({url: banners.slider1});
            if (banners.slider2) currentSliders.push({url: banners.slider2});
            if (banners.slider3) currentSliders.push({url: banners.slider3});
        }
        // If still empty, give one empty slot
        if (currentSliders.length === 0) {
            currentSliders.push({url: ''});
        }
        renderDynamicSliders();

        if (document.getElementById('settingBannerAbout')) document.getElementById('settingBannerAbout').value = banners.bannerAbout || banners.pageBanner || '';
        if (document.getElementById('settingBannerContact')) document.getElementById('settingBannerContact').value = banners.bannerContact || banners.pageBanner || '';
        if (document.getElementById('settingBannerNews')) document.getElementById('settingBannerNews').value = banners.bannerNews || banners.pageBanner || '';
        
        if (document.getElementById('settingImgMissionMain')) document.getElementById('settingImgMissionMain').value = banners.imgMissionMain || '/assets/images/local/img_33.jpg';
        if (document.getElementById('settingImgMissionSub')) document.getElementById('settingImgMissionSub').value = banners.imgMissionSub || '/assets/images/local/img_34.jpg';
        if (document.getElementById('settingImgGrid1')) document.getElementById('settingImgGrid1').value = banners.imgGrid1 || '/assets/images/local/img_37.jpg';
        if (document.getElementById('settingImgGrid2')) document.getElementById('settingImgGrid2').value = banners.imgGrid2 || '/assets/images/local/img_38.jpg';
        if (document.getElementById('settingImgGrid3')) document.getElementById('settingImgGrid3').value = banners.imgGrid3 || '/assets/images/local/img_34.jpg';
        if (document.getElementById('settingImgGrid4')) document.getElementById('settingImgGrid4').value = banners.imgGrid4 || '/assets/images/local/img_39.jpg';
        
        updateSettingLogoPreview();
        if(document.getElementById('settingFaviconPreview')) updateSettingFaviconPreview();
        
        updateBannerPreview('settingBannerAbout', 'settingBannerAboutPreview');
        updateBannerPreview('settingBannerContact', 'settingBannerContactPreview');
        updateBannerPreview('settingBannerNews', 'settingBannerNewsPreview');
        updateBannerPreview('settingImgMissionMain', 'settingImgMissionMainPreview');
        updateBannerPreview('settingImgMissionSub', 'settingImgMissionSubPreview');
        updateBannerPreview('settingImgGrid1', 'settingImgGrid1Preview');
        updateBannerPreview('settingImgGrid2', 'settingImgGrid2Preview');
        updateBannerPreview('settingImgGrid3', 'settingImgGrid3Preview');
        updateBannerPreview('settingImgGrid4', 'settingImgGrid4Preview');
    }

    function renderDynamicSliders() {
        const container = document.getElementById('dynamicSlidersContainer');
        if (!container) return;
        
        container.innerHTML = '';
        currentSliders.forEach((slider, index) => {
            const html = `
                <div class="slider-item" style="padding: 15px; border: 1px solid var(--admin-border); border-radius: 6px; margin-bottom: 15px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <strong>Slider ${index + 1}</strong>
                        ${currentSliders.length > 1 ? `<button type="button" class="btn btn-outline btn-remove-slider" data-index="${index}" style="color: #ef4444; border-color: #ef4444; padding: 5px 10px;"><i class="fa-solid fa-trash"></i></button>` : ''}
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <input type="text" class="form-input slider-input-url" data-index="${index}" value="${slider.url || ''}" placeholder="URL hình ảnh">
                        <input type="file" id="settingSliderUpload_${index}" accept="image/*" style="display: none;">
                        <button type="button" class="btn btn-upload-slider" data-index="${index}" style="background: var(--admin-border); color: var(--admin-text); padding: 0 15px;"><i class="fa-solid fa-upload"></i></button>
                    </div>
                    <div class="image-preview" style="height: 100px;">
                        ${slider.url ? `<img src="${slider.url}" style="max-height: 100%; object-fit: contain;">` : '<div class="placeholder">Chưa có ảnh</div>'}
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // Add event listeners for dynamic inputs
        document.querySelectorAll('.slider-input-url').forEach(input => {
            input.addEventListener('input', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                currentSliders[idx].url = this.value;
                const preview = this.parentElement.nextElementSibling;
                if (this.value) {
                    preview.innerHTML = `<img src="${this.value}" style="max-height: 100%; object-fit: contain;">`;
                } else {
                    preview.innerHTML = '<div class="placeholder">Chưa có ảnh</div>';
                }
            });
        });

        document.querySelectorAll('.btn-upload-slider').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = this.getAttribute('data-index');
                document.getElementById('settingSliderUpload_' + idx).click();
            });
        });

        document.querySelectorAll('[id^="settingSliderUpload_"]').forEach(upload => {
            upload.addEventListener('change', function(e) {
                const idx = parseInt(this.id.split('_')[1]);
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentSliders[idx].url = event.target.result;
                    renderDynamicSliders(); // re-render to show preview and update input
                };
                reader.readAsDataURL(file);
            });
        });

        document.querySelectorAll('.btn-remove-slider').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                currentSliders.splice(idx, 1);
                renderDynamicSliders();
            });
        });
    }

    if (document.getElementById('btnAddSlider')) {
        document.getElementById('btnAddSlider').addEventListener('click', () => {
            currentSliders.push({url: ''});
            renderDynamicSliders();
        });
    }

    function updateSettingLogoPreview() {
        const url = document.getElementById('settingLogo').value;
        const box = document.getElementById('settingLogoPreview');
        if (url) {
            box.innerHTML = `<img src="${url}" alt="Logo Preview" style="max-height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\'placeholder\'>Logo không hợp lệ</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder">Xem trước Logo</div>';
        }
    }

    const settingLogoInput = document.getElementById('settingLogo');
    if (settingLogoInput) {
        settingLogoInput.addEventListener('input', updateSettingLogoPreview);
    }

    function updateSettingFaviconPreview() {
        const url = document.getElementById('settingFavicon').value;
        const box = document.getElementById('settingFaviconPreview');
        if (!box) return;
        if (url) {
            box.innerHTML = `<img src="${url}" alt="Favicon Preview" style="max-height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\'placeholder\'>Favicon không hợp lệ</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder" style="font-size:12px;">Favicon</div>';
        }
    }

    const settingFaviconInput = document.getElementById('settingFavicon');
    if (settingFaviconInput) {
        settingFaviconInput.addEventListener('input', updateSettingFaviconPreview);
    }

    ['settingLogo', 'settingFavicon'].forEach(id => {
        const input = document.getElementById(id);
        const uploadInput = document.getElementById(id + 'Upload');
        if (uploadInput && input) {
            uploadInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    input.value = event.target.result;
                    if(id === 'settingLogo') updateSettingLogoPreview();
                    if(id === 'settingFavicon') updateSettingFaviconPreview();
                };
                reader.readAsDataURL(file);
            });
        }
    });

    function updateBannerPreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const box = document.getElementById(previewId);
        if(!box || !input) return;
        const url = input.value;
        if (url) {
            box.innerHTML = `<img src="${url}" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\'placeholder\'>Banner không hợp lệ</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder">Chưa có banner</div>';
        }
    }

    ['settingBannerAbout', 'settingBannerContact', 'settingBannerNews', 'settingImgMissionMain', 'settingImgMissionSub', 'settingImgGrid1', 'settingImgGrid2', 'settingImgGrid3', 'settingImgGrid4'].forEach(id => {
        const input = document.getElementById(id);
        if(input) {
            input.addEventListener('input', () => updateBannerPreview(id, id + 'Preview'));
        }
        
        // Handle file uploads
        const uploadInput = document.getElementById(id + 'Upload');
        if (uploadInput && input) {
            uploadInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    input.value = event.target.result;
                    updateBannerPreview(id, id + 'Preview');
                };
                reader.readAsDataURL(file);
            });
        }
    });

    window.switchSettingTab = function(tabName) {
        document.querySelectorAll('.tab-item').forEach(t => {
            t.classList.remove('active');
            t.style.borderBottom = 'none';
            t.style.fontWeight = 'normal';
            t.style.color = 'var(--admin-text-dim)';
        });
        const activeTab = document.getElementById('tab-setting-' + tabName);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.borderBottom = '2px solid var(--admin-primary)';
            activeTab.style.fontWeight = 'bold';
            activeTab.style.color = 'var(--admin-primary)';
        }

        document.getElementById('setting-content-general').style.display = 'none';
        document.getElementById('setting-content-banner').style.display = 'none';
        
        const activeContent = document.getElementById('setting-content-' + tabName);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    };

    const saveSettingsFn = () => {
        const newSettings = {
            hotline: document.getElementById('settingHotline').value.trim(),
            zalo: document.getElementById('settingZalo').value.trim(),
            address: document.getElementById('settingAddress').value.trim(),
            logo: document.getElementById('settingLogo').value.trim(),
            favicon: document.getElementById('settingFavicon') ? document.getElementById('settingFavicon').value.trim() : '',
            showComboSection: document.getElementById('settingShowComboSection').checked,
            banners: {
                sliders: currentSliders.filter(s => s.url.trim() !== ''), // filter out empty URLs
                bannerAbout: document.getElementById('settingBannerAbout') ? document.getElementById('settingBannerAbout').value.trim() : '',
                bannerContact: document.getElementById('settingBannerContact') ? document.getElementById('settingBannerContact').value.trim() : '',
                bannerNews: document.getElementById('settingBannerNews') ? document.getElementById('settingBannerNews').value.trim() : '',
                imgMissionMain: document.getElementById('settingImgMissionMain') ? document.getElementById('settingImgMissionMain').value.trim() : '',
                imgMissionSub: document.getElementById('settingImgMissionSub') ? document.getElementById('settingImgMissionSub').value.trim() : '',
                imgGrid1: document.getElementById('settingImgGrid1') ? document.getElementById('settingImgGrid1').value.trim() : '',
                imgGrid2: document.getElementById('settingImgGrid2') ? document.getElementById('settingImgGrid2').value.trim() : '',
                imgGrid3: document.getElementById('settingImgGrid3') ? document.getElementById('settingImgGrid3').value.trim() : '',
                imgGrid4: document.getElementById('settingImgGrid4') ? document.getElementById('settingImgGrid4').value.trim() : ''
            },
        };
        ProductDB.updateSettings(newSettings);
        showToast('Lưu cấu hình thành công!', 'success');
    };

    const btnSaveSettings = document.getElementById('btnSaveSettings');
    if (btnSaveSettings) btnSaveSettings.addEventListener('click', saveSettingsFn);
    
    const btnSaveBannerSettings = document.getElementById('btnSaveBannerSettings');
    if (btnSaveBannerSettings) btnSaveBannerSettings.addEventListener('click', saveSettingsFn);

    // ========== EXPORT / IMPORT DATA ==========
    const btnExportData = document.getElementById('btnExportData');
    if (btnExportData) {
        btnExportData.addEventListener('click', () => {
            if (typeof XLSX === 'undefined') {
                showToast('Thư viện Excel đang tải, vui lòng thử lại sau giây lát!', 'warning');
                return;
            }
            try {
                const wb = XLSX.utils.book_new();
                
                const getParsedData = (key) => {
                    try {
                        const raw = localStorage.getItem(key);
                        return raw ? JSON.parse(raw) : [];
                    } catch (e) { return []; }
                };
                
                const products = getParsedData('gasviet_products').map(p => ({
                    'ID': p.id,
                    'SKU': p.sku || '',
                    'Tên Sản Phẩm': p.name || '',
                    'Giá Gốc': p.price || 0,
                    'Giảm Giá (%)': p.discount || 0,
                    'Tồn Kho': p.stock || 0,
                    'Mô Tả SEO': p.seoDesc || '',
                    'Trạng Thái': p.active !== false ? 'Hiển thị' : 'Ẩn'
                }));
                const wsProducts = XLSX.utils.json_to_sheet(products);
                XLSX.utils.book_append_sheet(wb, wsProducts, "Sản Phẩm");
                
                const categories = getParsedData('gasviet_categories');
                const wsCategories = XLSX.utils.json_to_sheet(categories);
                XLSX.utils.book_append_sheet(wb, wsCategories, "Danh Mục");
                
                const rawSettings = localStorage.getItem('gasviet_settings');
                const settings = rawSettings ? [JSON.parse(rawSettings)] : [];
                const wsSettings = XLSX.utils.json_to_sheet(settings);
                XLSX.utils.book_append_sheet(wb, wsSettings, "Cấu Hình");
                
                const news = getParsedData('gasviet_news');
                const wsNews = XLSX.utils.json_to_sheet(news);
                XLSX.utils.book_append_sheet(wb, wsNews, "Tin Tức");
                
                const newsCategories = getParsedData('gasviet_news_categories');
                const wsNewsCategories = XLSX.utils.json_to_sheet(newsCategories);
                XLSX.utils.book_append_sheet(wb, wsNewsCategories, "Danh Mục Tin Tức");
                
                XLSX.writeFile(wb, `gasviet_backup_${new Date().toISOString().slice(0, 10)}.xlsx`);
                showToast('Đã tải xuống file Excel sao lưu!', 'success');
            } catch (err) {
                console.error(err);
                showToast('Lỗi khi xuất file Excel!', 'error');
            }
        });
    }

    const importDataInput = document.getElementById('importDataInput');
    if (importDataInput) {
        importDataInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (typeof XLSX === 'undefined') {
                showToast('Thư viện Excel đang tải, vui lòng thử lại sau giây lát!', 'warning');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const wb = XLSX.read(data, {type: 'array'});
                    
                    const getSheetJSON = (sheetName) => {
                        const ws = wb.Sheets[sheetName];
                        return ws ? XLSX.utils.sheet_to_json(ws) : null;
                    };
                    
                    const products = getSheetJSON("Sản Phẩm");
                    if (products) localStorage.setItem('gasviet_products', JSON.stringify(products));
                    
                    const categories = getSheetJSON("Danh Mục");
                    if (categories) localStorage.setItem('gasviet_categories', JSON.stringify(categories));
                    
                    const settings = getSheetJSON("Cấu Hình");
                    if (settings && settings.length > 0) localStorage.setItem('gasviet_settings', JSON.stringify(settings[0]));
                    
                    const news = getSheetJSON("Tin Tức");
                    if (news) localStorage.setItem('gasviet_news', JSON.stringify(news));
                    
                    const newsCategories = getSheetJSON("Danh Mục Tin Tức");
                    if (newsCategories) localStorage.setItem('gasviet_news_categories', JSON.stringify(newsCategories));
                    
                    showToast('Phục hồi dữ liệu thành công! Đang tải lại trang...', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } catch (error) {
                    console.error(error);
                    showToast('File Excel không hợp lệ hoặc bị lỗi!', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }
});
