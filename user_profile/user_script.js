
document.addEventListener('DOMContentLoaded', function() {
  
    const logoutBtn = document.querySelector('.user_logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            if (!confirm('Вы уверены, что хотите выйти?')) {
                e.preventDefault();
            }
        });
    }
    
    setTimeout(function() {
        var alerts = document.querySelectorAll('.user_alert');
        for (var i = 0; i < alerts.length; i++) {
            alerts[i].style.opacity = '0';
            setTimeout(function(alert) {
                if (alert) alert.style.display = 'none';
            }, 500, alerts[i]);
        }
    }, 5000);
});