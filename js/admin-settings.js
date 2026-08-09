/**
 * Admin settings Module
 */
document.addEventListener('DOMContentLoaded', () => {
    // ========== SETTINGS ==========
    window.renderSettings = function() {
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
            box.innerHTML = `<img src="${url}" alt="Logo Preview" style="max-height: 100%; object-fit: contain;" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>Logo khÃ´ng há»£p lá»‡</div>'">`;
        } else {
            box.innerHTML = '<div class="placeholder">Xem trÆ°á»›c Logo</div>';
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
            showToast('LÆ°u cáº¥u hÃ¬nh thÃ nh cÃ´ng!', 'success');
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

    // ========== EXPORT / IMPORT DATA ==========
    const btnExportData = document.getElementById('btnExportData');
    if (btnExportData) {
        btnExportData.addEventListener('click', () => {
            if (typeof XLSX === 'undefined') {
                showToast('ThÆ° viá»‡n Excel Ä‘ang táº£i, vui lÃ²ng thá»­ láº¡i sau giÃ¢y lÃ¡t!', 'warning');
                return;
            }
            try {
                const wb = XLSX.utils.book_new();
                
                // Helper to safely parse JSON from localStorage
                const getParsedData = (key) => {
                    try {
                        const raw = localStorage.getItem(key);
                        return raw ? JSON.parse(raw) : [];
                    } catch (e) { return []; }
                };
                
                // Products
                const products = getParsedData('gasviet_products');
                const wsProducts = XLSX.utils.json_to_sheet(products);
                XLSX.utils.book_append_sheet(wb, wsProducts, "Sáº£n Pháº©m");
                
                // Categories
                const categories = getParsedData('gasviet_categories');
                const wsCategories = XLSX.utils.json_to_sheet(categories);
                XLSX.utils.book_append_sheet(wb, wsCategories, "Danh Má»¥c");
                
                // Settings (is an object, so we wrap it in array)
                const rawSettings = localStorage.getItem('gasviet_settings');
                const settings = rawSettings ? [JSON.parse(rawSettings)] : [];
                const wsSettings = XLSX.utils.json_to_sheet(settings);
                XLSX.utils.book_append_sheet(wb, wsSettings, "Cáº¥u HÃ¬nh");
                
                // News
                const news = getParsedData('gasviet_news');
                const wsNews = XLSX.utils.json_to_sheet(news);
                XLSX.utils.book_append_sheet(wb, wsNews, "Tin Tá»©c");
                
                // News Categories
                const newsCategories = getParsedData('gasviet_news_categories');
                const wsNewsCategories = XLSX.utils.json_to_sheet(newsCategories);
                XLSX.utils.book_append_sheet(wb, wsNewsCategories, "Danh Má»¥c Tin Tá»©c");
                
                XLSX.writeFile(wb, `gasviet_backup_${new Date().toISOString().slice(0, 10)}.xlsx`);
                showToast('ÄÃ£ táº£i xuá»‘ng file Excel sao lÆ°u!', 'success');
            } catch (err) {
                console.error(err);
                showToast('Lá»—i khi xuáº¥t file Excel!', 'error');
            }
        });
    }

    const importDataInput = document.getElementById('importDataInput');
    if (importDataInput) {
        importDataInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (typeof XLSX === 'undefined') {
                showToast('ThÆ° viá»‡n Excel Ä‘ang táº£i, vui lÃ²ng thá»­ láº¡i sau giÃ¢y lÃ¡t!', 'warning');
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
                    
                    const products = getSheetJSON("Sáº£n Pháº©m");
                    if (products) localStorage.setItem('gasviet_products', JSON.stringify(products));
                    
                    const categories = getSheetJSON("Danh Má»¥c");
                    if (categories) localStorage.setItem('gasviet_categories', JSON.stringify(categories));
                    
                    const settings = getSheetJSON("Cáº¥u HÃ¬nh");
                    if (settings && settings.length > 0) localStorage.setItem('gasviet_settings', JSON.stringify(settings[0]));
                    
                    const news = getSheetJSON("Tin Tá»©c");
                    if (news) localStorage.setItem('gasviet_news', JSON.stringify(news));
                    
                    const newsCategories = getSheetJSON("Danh Má»¥c Tin Tá»©c");
                    if (newsCategories) localStorage.setItem('gasviet_news_categories', JSON.stringify(newsCategories));
                    
                    showToast('Phá»¥c há»“i dá»¯ liá»‡u thÃ nh cÃ´ng! Äang táº£i láº¡i trang...', 'success');
                    setTimeout(() => window.location.reload(), 1500);
                } catch (error) {
                    console.error(error);
                    showToast('File Excel khÃ´ng há»£p lá»‡ hoáº·c bá»‹ lá»—i!', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        });
    }

});
