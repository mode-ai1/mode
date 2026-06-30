document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Parallax effect on mouse move for the hero image and orbs
    const heroImage = document.querySelector('.glass-panel');
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');

    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

        if(heroImage) {
            heroImage.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
        
        if(orb1 && orb2) {
            orb1.style.transform = `translate(${xAxis * 2}px, ${yAxis * 2}px)`;
            orb2.style.transform = `translate(${-xAxis * 2}px, ${-yAxis * 2}px)`;
        }
    });

    // Reset transform on mouse leave
    document.addEventListener('mouseleave', () => {
        if(heroImage) {
            heroImage.style.transform = 'perspective(1000px) rotateY(-10deg) rotateX(0deg)';
        }
    });
});
