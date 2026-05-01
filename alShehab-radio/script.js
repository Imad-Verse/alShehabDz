// Initialize visit counter
let count = localStorage.getItem('visits') || 0;
count++;
localStorage.setItem('visits', count);
const localCounterEl = document.getElementById('localCounter');
if (localCounterEl) localCounterEl.textContent = count;

// Visitor counter fetch from API
const fetchGlobalCounter = async () => {
    try {
        const namespace = "livevideo_haramain_pro_v1";
        const response = await fetch(`https://api.counterapi.dev/v1/${namespace}/counter/up`);
        const data = await response.json();
        
        if (data && data.count) {
            animateNumber('globalCounter', data.count);
        }
    } catch (error) {
        console.error("Error fetching global counter:", error);
        // في حال فشل جلب الرقم من السيرفر (بسبب مانع الإعلانات أو تشغيل الملف محلياً)
        // سيتم عرض رقم إجمالي افتراضي يضاف إليه زيارات المستخدم الحالية ليبقى العداد احترافياً
        let localVisits = parseInt(localStorage.getItem('visits')) || 1;
        let baseCount = 85240; // رقم أساسي للزيارات
        animateNumber('globalCounter', baseCount + localVisits);
    }
};

const animateNumber = (id, target) => {
    const el = document.getElementById(id);
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    
    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target.toString().padStart(4, '0');
            clearInterval(interval);
        } else {
            el.textContent = Math.floor(current).toString().padStart(4, '0');
        }
    }, stepDuration);
};

fetchGlobalCounter();

// Audio state management
let currentAudio = null;
let currentCard = null;
let currentBtn = null;

function toggleCategory(header) {
    const category = header.parentElement;
    const isActive = category.classList.contains('active');
    
    // إغلاق جميع القوائم المفتوحة
    document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
    
    // فتح القائمة المختارة إذا لم تكن مفتوحة
    if (!isActive) {
        category.classList.add('active');
        
        // التمرير إلى القائمة بسلاسة لتجنب ضياعها من الشاشة عند إغلاق القوائم الطويلة
        setTimeout(() => {
            const yOffset = -20; 
            const y = category.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 10);
    }
}

function playRadio(card, src, subtitle = '') {
    const playBtn = card.querySelector('.play-button');
    const radioTitle = card.querySelector('.radio-title').textContent;
    const nowPlayingBar = document.getElementById('nowPlayingBar');
    const mainToggle = document.getElementById('togglePlayPause');

    // If clicking the same station that's already playing -> Toggle Pause/Play
    if (currentAudio && currentAudio._rawSrc === src) {
        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
        return;
    }

    // New station selection
    showLoader();

    if (currentAudio) {
        currentAudio.pause();
        resetCurrentUI();
    }

    currentAudio = new Audio(src);
    currentAudio._rawSrc = src;
    currentCard = card;
    currentBtn = playBtn;

    // Use saved volume
    const savedVolume = localStorage.getItem('volume') || 1;
    currentAudio.volume = savedVolume;
    document.getElementById('volumeControl').value = savedVolume;

    currentAudio.play().then(() => {
        hideLoader();
        updateUIOnPlay(radioTitle, subtitle);
    }).catch(err => {
        hideLoader();
        console.error("Playback failed:", err);
        alert("تعذر تشغيل الإذاعة، قد يكون الرابط غير متاح حالياً.");
    });

    // Event Listeners
    currentAudio.addEventListener('play', () => {
        updateUIOnPlay(radioTitle, subtitle);
    });

    currentAudio.addEventListener('pause', () => {
        updateUIOnPause();
    });

    currentAudio.addEventListener('error', () => {
        hideLoader();
        alert("حدث خطأ في الاتصال بالبث المباشر.");
        resetCurrentUI();
        nowPlayingBar.style.display = 'none';
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) scrollToTopBtn.classList.remove('lifted');
    });
}

function updateUIOnPlay(title, subtitle = '') {
    if (currentBtn) {
        currentBtn.innerHTML = '⏸'; // Pause icon
        currentBtn.classList.add('playing');
    }
    if (currentCard) currentCard.classList.add('active-playing');

    const nowPlayingBar = document.getElementById('nowPlayingBar');
    nowPlayingBar.style.display = 'block';
    
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) scrollToTopBtn.classList.add('lifted');
    
    document.getElementById('currentRadioName').textContent = title;
    document.getElementById('currentRadioSubtitle').textContent = subtitle;
    
    const mainToggle = document.getElementById('togglePlayPause');
    mainToggle.textContent = 'إيقاف مؤقت';
    mainToggle.classList.add('playing');
}

function updateUIOnPause() {
    if (currentBtn) {
        currentBtn.innerHTML = '▶'; // Play icon
        currentBtn.classList.remove('playing');
    }
    const mainToggle = document.getElementById('togglePlayPause');
    mainToggle.textContent = 'تشغيل';
    mainToggle.classList.remove('playing');
}

function resetCurrentUI() {
    if (currentBtn) {
        currentBtn.innerHTML = '▶';
        currentBtn.classList.remove('playing');
    }
    if (currentCard) currentCard.classList.remove('active-playing');
}

// Global controls
document.getElementById('togglePlayPause').addEventListener('click', function () {
    if (!currentAudio) return;
    if (currentAudio.paused) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
});

function setVolume(value) {
    if (currentAudio) {
        currentAudio.volume = value;
    }
    localStorage.setItem('volume', value);
}

// Year update logic
const yearSpan = document.getElementById('currentYear');
if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;
}

// Loader helpers
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// Restore volume on load
window.addEventListener('load', () => {
    const savedVolume = localStorage.getItem('volume') || 1;
    const volCtrl = document.getElementById('volumeControl');
    if (volCtrl) volCtrl.value = savedVolume;
});

// Scroll to Top logic
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Active Listeners Simulation
function updateActiveListeners() {
    const el = document.getElementById('onlineListenersCounter');
    if (!el) return;
    
    let current = parseInt(el.textContent) || 124;
    // إضافة أو تنقيص رقم عشوائي بسيط بين -3 إلى 5
    let variation = Math.floor(Math.random() * 9) - 3;
    let next = current + variation;
    
    // الحفاظ على الرقم ضمن نطاق واقعي
    if (next < 50) next = 65 + Math.floor(Math.random() * 10);
    if (next > 450) next = 420 - Math.floor(Math.random() * 20);
    
    el.textContent = next;
}

// تغيير الرقم العشوائي كل 10 إلى 20 ثانية للحيوية
setInterval(updateActiveListeners, 15000);
document.addEventListener('DOMContentLoaded', updateActiveListeners);