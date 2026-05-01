document.addEventListener("DOMContentLoaded", function () {
    const triggers = document.querySelectorAll(".question-trigger");

    triggers.forEach(trigger => {
        trigger.addEventListener("click", function () {
            const panel = this.nextElementSibling;
            const isActive = this.classList.contains("active");

            // Close all other panels (optional: remove this if you want multiple open)
            triggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    otherTrigger.classList.remove("active");
                    otherTrigger.setAttribute("aria-expanded", "false");
                    otherTrigger.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current panel
            this.classList.toggle("active");
            const expanded = this.classList.contains("active");
            this.setAttribute("aria-expanded", expanded);

            if (expanded) {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } else {
                panel.style.maxHeight = null;
            }
        });
    });
});

// Tawk.to Integration
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/620e27a81ffac05b1d7a59b9/1ijnnu5i0';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();

// Copy to Clipboard Functionality
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.color = '#10b981';
        
        showToast('تم النسخ إلى الحافظة!');
        
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Toast Notification Logic
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}