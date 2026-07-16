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
            option.addEventListener('click', function(e) {
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

});