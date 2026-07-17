document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. SLIDER LOGIC
       ========================================================================== */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideIntervalTime = 5000; // 5 seconds
    let slideTimer;

    function goToSlide(index) {
        // Remove active class from current
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        // Update index
        currentSlide = index;

        // Add active class to new
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        goToSlide(newIndex);
    }

    function startSlider() {
        slideTimer = setInterval(nextSlide, slideIntervalTime);
    }

    function resetSlider() {
        clearInterval(slideTimer);
        startSlider();
    }

    // Dot click events
    dots.forEach(dot => {
        dot.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            goToSlide(index);
            resetSlider(); // Reset timer on manual click
        });
    });

    // Start auto slide
    startSlider();


    /* ==========================================================================
       2. MOBILE MENU & SIDEBAR TOGGLE
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const categorySidebar = document.getElementById('categorySidebar');

    if (mobileMenuBtn && categorySidebar) {
        mobileMenuBtn.addEventListener('click', () => {
            // Toggle sidebar visibility on mobile
            categorySidebar.classList.toggle('mobile-active');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            const isClickInsideSidebar = categorySidebar.contains(e.target);
            const isClickOnBtn = mobileMenuBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnBtn && categorySidebar.classList.contains('mobile-active')) {
                categorySidebar.classList.remove('mobile-active');
            }
        }
    });

    /* ==========================================================================
       3. CUSTOM SEARCH CATEGORY DROPDOWN LOGIC
       ========================================================================== */
    const customSelect = document.getElementById('customSearchSelect');
    if (customSelect) {
        const selected = customSelect.querySelector('.search-select-selected');
        const items = customSelect.querySelector('.search-select-items');
        const hiddenInput = document.getElementById('searchCategory');
        const searchInput = document.querySelector('.search-input');
        const optionDivs = items.querySelectorAll('div');

        // Toggle dropdown
        selected.addEventListener('click', function (e) {
            e.stopPropagation();
            items.classList.toggle('select-hide');
            this.classList.toggle('select-arrow-active');
        });

        // Option click
        optionDivs.forEach(div => {
            div.addEventListener('click', function (e) {
                // Update selected text
                selected.innerHTML = this.innerHTML;
                // Update hidden input value
                if (hiddenInput) hiddenInput.value = this.getAttribute('data-value');

                // Update active state
                optionDivs.forEach(opt => opt.classList.remove('same-as-selected'));
                this.classList.add('same-as-selected');

                // Close dropdown
                items.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');

                // Update placeholder
                if (searchInput) {
                    searchInput.placeholder = `Tìm kiếm trong ${this.innerText}...`;
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!customSelect.contains(e.target)) {
                items.classList.add('select-hide');
                selected.classList.remove('select-arrow-active');
            }
        });
    }
    /* ==========================================================================
       4. FEATURED PRODUCTS SLIDER
       ========================================================================== */
    const featuredSlider = document.getElementById('featuredSlider');
    const prevFeaturedBtn = document.getElementById('prevFeaturedBtn');
    const nextFeaturedBtn = document.getElementById('nextFeaturedBtn');

    if (featuredSlider && prevFeaturedBtn && nextFeaturedBtn) {
        let currentFeaturedIndex = 0;

        const updateSliderPosition = () => {
            const card = featuredSlider.querySelector('.product-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap
            featuredSlider.style.transform = `translateX(-${currentFeaturedIndex * cardWidth}px)`;
        };

        nextFeaturedBtn.addEventListener('click', () => {
            const cards = featuredSlider.querySelectorAll('.product-card');
            if (cards.length === 0) return;
            // Calculate visible cards
            const visibleCards = Math.floor(featuredSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentFeaturedIndex < maxIndex) {
                currentFeaturedIndex++;
            } else {
                currentFeaturedIndex = 0; // loop back
            }
            updateSliderPosition();
        });

        prevFeaturedBtn.addEventListener('click', () => {
            if (currentFeaturedIndex > 0) {
                currentFeaturedIndex--;
            } else {
                const cards = featuredSlider.querySelectorAll('.product-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(featuredSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentFeaturedIndex = Math.max(0, cards.length - visibleCards);
            }
            updateSliderPosition();
        });

        // Handle resize
        window.addEventListener('resize', () => {
            currentFeaturedIndex = 0;
            updateSliderPosition();
        });
    }

    // COMBO SLIDER LOGIC
    const comboSlider = document.getElementById('comboSlider');
    const prevComboBtn = document.getElementById('prevComboBtn');
    const nextComboBtn = document.getElementById('nextComboBtn');

    if (comboSlider && prevComboBtn && nextComboBtn) {
        let currentComboIndex = 0;

        const updateComboPosition = () => {
            const card = comboSlider.querySelector('.product-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap
            comboSlider.style.transform = `translateX(-${currentComboIndex * cardWidth}px)`;
        };

        nextComboBtn.addEventListener('click', () => {
            const cards = comboSlider.querySelectorAll('.product-card');
            if (cards.length === 0) return;
            // Calculate visible cards
            const visibleCards = Math.floor(comboSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentComboIndex < maxIndex) {
                currentComboIndex++;
            } else {
                currentComboIndex = 0; // loop back
            }
            updateComboPosition();
        });

        prevComboBtn.addEventListener('click', () => {
            if (currentComboIndex > 0) {
                currentComboIndex--;
            } else {
                const cards = comboSlider.querySelectorAll('.product-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(comboSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentComboIndex = Math.max(0, cards.length - visibleCards);
            }
            updateComboPosition();
        });

        window.addEventListener('resize', () => {
            currentComboIndex = 0;
            updateComboPosition();
        });
    }

    /* ==========================================================================
       5. RELATED PRODUCTS SLIDER
       ========================================================================== */
    const relatedSlider = document.getElementById('relatedSlider');
    const prevRelatedBtn = document.getElementById('prevRelatedBtn');
    const nextRelatedBtn = document.getElementById('nextRelatedBtn');

    if (relatedSlider && prevRelatedBtn && nextRelatedBtn) {
        let currentRelatedIndex = 0;

        const updateRelatedPosition = () => {
            const card = relatedSlider.querySelector('.product-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap
            relatedSlider.style.transform = `translateX(-${currentRelatedIndex * cardWidth}px)`;
        };

        nextRelatedBtn.addEventListener('click', () => {
            const cards = relatedSlider.querySelectorAll('.product-card');
            if (cards.length === 0) return;
            const visibleCards = Math.floor(relatedSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentRelatedIndex < maxIndex) {
                currentRelatedIndex++;
            } else {
                currentRelatedIndex = 0; // loop back
            }
            updateRelatedPosition();
        });

        prevRelatedBtn.addEventListener('click', () => {
            if (currentRelatedIndex > 0) {
                currentRelatedIndex--;
            } else {
                const cards = relatedSlider.querySelectorAll('.product-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(relatedSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentRelatedIndex = Math.max(0, cards.length - visibleCards);
            }
            updateRelatedPosition();
        });

        window.addEventListener('resize', () => {
            currentRelatedIndex = 0;
            updateRelatedPosition();
        });
    }

    /* ==========================================================================
       2. CUSTOM DROPDOWN
       ========================================================================== */
    const sortDropdown = document.getElementById('sortDropdown');
    if (sortDropdown) {
        const selected = sortDropdown.querySelector('.dropdown-selected');
        const selectedText = selected.querySelector('span');
        const options = sortDropdown.querySelectorAll('.dropdown-options li');

        selected.addEventListener('click', (e) => {
            e.stopPropagation();
            sortDropdown.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', function (e) {
                e.stopPropagation();
                // Remove active class from all
                options.forEach(opt => opt.classList.remove('active'));

                // Add active to clicked
                this.classList.add('active');

                // Update selected text
                selectedText.textContent = this.textContent;

                // Close dropdown
                sortDropdown.classList.remove('open');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!sortDropdown.contains(e.target)) {
                sortDropdown.classList.remove('open');
            }
        });
    }

    /* ==========================================================================
       3. FLASH DEAL COUNTDOWN TIMER
       ========================================================================== */
    const flashDealTimer = document.getElementById('flashDealTimer');
    if (flashDealTimer) {
        // Set deal end time (e.g. 2 days, 12 hours from now for demo)
        const dealEndDate = new Date();
        dealEndDate.setDate(dealEndDate.getDate() + 2);
        dealEndDate.setHours(dealEndDate.getHours() + 12);
        dealEndDate.setMinutes(dealEndDate.getMinutes() + 45);
        dealEndDate.setSeconds(dealEndDate.getSeconds() + 30);

        const daysEl = document.getElementById('dealDays');
        const hrsEl = document.getElementById('dealHrs');
        const minsEl = document.getElementById('dealMins');
        const secsEl = document.getElementById('dealSecs');

        function updateTimer() {
            const now = new Date();
            const timeDiff = dealEndDate - now;

            if (timeDiff <= 0) {
                // Timer finished
                daysEl.textContent = '00';
                hrsEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                return;
            }

            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            daysEl.textContent = days.toString().padStart(2, '0');
            hrsEl.textContent = hours.toString().padStart(2, '0');
            minsEl.textContent = minutes.toString().padStart(2, '0');
            secsEl.textContent = seconds.toString().padStart(2, '0');
        }

        updateTimer(); // Initial call
        setInterval(updateTimer, 1000);
    }

    /* ==========================================================================
       4. FLASH DEAL SLIDER LOGIC
       ========================================================================== */
    const flashDealSlider = document.getElementById('flashDealSlider');
    const prevFlashDealBtn = document.getElementById('prevFlashDealBtn');
    const nextFlashDealBtn = document.getElementById('nextFlashDealBtn');

    if (flashDealSlider && prevFlashDealBtn && nextFlashDealBtn) {
        let currentFlashDealIndex = 0;

        const updateFlashDealPosition = () => {
            const card = flashDealSlider.querySelector('.deal-horizontal-card');
            if (!card) return;
            const cardWidth = card.offsetWidth + 20; // card width + gap (20px)
            flashDealSlider.style.transform = `translateX(-${currentFlashDealIndex * cardWidth}px)`;
        };

        nextFlashDealBtn.addEventListener('click', () => {
            const cards = flashDealSlider.querySelectorAll('.deal-horizontal-card');
            if (cards.length === 0) return;
            // Calculate visible cards
            const visibleCards = Math.floor(flashDealSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
            const maxIndex = cards.length - visibleCards;

            if (currentFlashDealIndex < maxIndex) {
                currentFlashDealIndex++;
            } else {
                currentFlashDealIndex = 0; // loop back
            }
            updateFlashDealPosition();
        });

        prevFlashDealBtn.addEventListener('click', () => {
            if (currentFlashDealIndex > 0) {
                currentFlashDealIndex--;
            } else {
                const cards = flashDealSlider.querySelectorAll('.deal-horizontal-card');
                if (cards.length === 0) return;
                const visibleCards = Math.floor(flashDealSlider.parentElement.clientWidth / (cards[0].offsetWidth + 10)) || 1;
                currentFlashDealIndex = Math.max(0, cards.length - visibleCards);
            }
            updateFlashDealPosition();
        });

        window.addEventListener('resize', () => {
            currentFlashDealIndex = 0;
            updateFlashDealPosition();
        });
    }

    /* ==========================================================================
       CONTACT FORM VALIDATION
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameInput = document.getElementById('contactName');
        const phoneInput = document.getElementById('contactPhone');
        const phoneError = document.getElementById('phoneError');

        // Auto capitalize first letter of each word
        nameInput.addEventListener('input', function (e) {
            let val = e.target.value;
            // Split by space, capitalize first letter, join back
            val = val.split(' ').map(word => {
                if (word.length > 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                return word;
            }).join(' ');
            e.target.value = val;
        });

        // Phone number input restriction (only numbers)
        phoneInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        // Form submit validation
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const phoneVal = phoneInput.value;
            const phoneRegex = /^0[0-9]{8,9}$/;

            if (!phoneRegex.test(phoneVal)) {
                phoneError.style.display = 'block';
                phoneInput.style.borderColor = 'red';
                return;
            }

            phoneError.style.display = 'none';
            phoneInput.style.borderColor = '#ddd';

            const btn = contactForm.querySelector('.btn-submit-contact');
            const btnText = btn.querySelector('.text');
            const btnIcon = btn.querySelector('.icon-arrow i');
            const originalText = btnText.textContent;
            
            // Start success animation
            btn.classList.add('success');
            
            // Instantly change text and icon while they slide to their new positions
            btnIcon.className = 'fa-solid fa-check';
            btnText.textContent = 'Thành công!';
            
            // Reset form and button after 3.5 seconds
            setTimeout(() => {
                contactForm.reset();
                btn.classList.remove('success');
                btnIcon.className = 'fa-solid fa-arrow-right';
                btnText.textContent = originalText;
            }, 3500);
        });
    }

    // --- GLOBAL SCROLL ANIMATION ---
    // --- GLOBAL SCROLL ANIMATION ---
    const elementsToAnimate = document.querySelectorAll(`
        .section-header, 
        .section-title,
        .feature-item, 
        .value-card,
        .info-block,
        .contact-title > *,
        .custom-contact-form .form-group,
        .custom-contact-form .btn-submit-contact,
        .qr-col > *,
        .badge-item,
        .image-grid-creative img,
        .mission-list-item,
        .about-story-img,
        .about-story-content > *,
        .hero-content > *,
        .truck-anim,
        .category-card,
        .products-flex,
        .products-grid,
        .step-card,
        .testimonial-card,
        .brand-logo
    `);
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled-in');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('scroll-hidden');
        
        // Add stagger effect based on DOM order for groups of items
        if (el.classList.contains('feature-item') || 
            el.classList.contains('info-block') || 
            el.classList.contains('value-card') || 
            el.classList.contains('badge-item') ||
            el.classList.contains('form-group') ||
            el.classList.contains('mission-list-item') ||
            el.classList.contains('category-card') ||
            el.classList.contains('step-card') ||
            el.classList.contains('testimonial-card') ||
            el.classList.contains('brand-logo') ||
            (el.tagName === 'IMG' && el.parentElement && el.parentElement.classList.contains('image-grid-creative'))) {
            const staggerDelay = (index % 6) + 1; 
            el.classList.add(`stagger-${staggerDelay}`);
        }
        
        // Stagger children of specific parents
        if (el.parentElement) {
            if (el.parentElement.classList.contains('hero-content') || 
                el.parentElement.classList.contains('about-story-content') ||
                el.parentElement.classList.contains('contact-title') ||
                el.parentElement.classList.contains('qr-col')) {
                const siblings = Array.from(el.parentElement.children);
                const childIndex = siblings.indexOf(el);
                el.classList.add(`stagger-${Math.min(childIndex + 1, 6)}`);
            }
        }
        
        scrollObserver.observe(el);
    });

    /* ==========================================================================
       9. HEADER SCROLL LOGIC
       ========================================================================== */
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 150) {
                if (currentScrollY > lastScrollY) {
                    // Kéo xuống -> ẩn header
                    header.classList.add('header-hidden');
                } else {
                    // Kéo lên -> hiện header
                    header.classList.remove('header-hidden');
                }
            } else {
                // Ở trên cùng -> luôn hiện
                header.classList.remove('header-hidden');
            }
            
            lastScrollY = currentScrollY;
        });
    }

});