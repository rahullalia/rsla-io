import { useEffect, useRef } from 'react';

export default function CanvasParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let mouse = { x: -9999, y: -9999, vx: 0, vy: 0, prevX: -9999, prevY: -9999 };

        const PARTICLE_COUNT = 200;
        const CONNECTION_DIST = 150;
        const particles = [];

        function resize() {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        function createParticles() {
            particles.length = 0;
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const layer = Math.random() > 0.5 ? 1 : 0.5; // foreground or background
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.3 * layer,
                    vy: (Math.random() - 0.5) * 0.3 * layer,
                    radius: 1 + Math.random() * 1.5,
                    opacity: 0.2 + Math.random() * 0.15,
                    layer,
                });
            }
        }

        function draw() {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);

            // Update mouse velocity
            mouse.vx = mouse.x - mouse.prevX;
            mouse.vy = mouse.y - mouse.prevY;
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;
            const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Scatter on fast mouse movement
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST && mouseSpeed > 5) {
                    const force = Math.min(mouseSpeed * 0.02, 2);
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * 0.1;
                    p.vy += Math.sin(angle) * force * 0.1;
                }

                // Dampen velocity
                p.vx *= 0.99;
                p.vy *= 0.99;

                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();

                // Connect to mouse if close enough
                if (dist < CONNECTION_DIST) {
                    const lineOpacity = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            animationId = requestAnimationFrame(draw);
        }

        function onMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }

        function onVisibilityChange() {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animationId = requestAnimationFrame(draw);
            }
        }

        resize();
        createParticles();
        animationId = requestAnimationFrame(draw);

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full bg-dark"
        />
    );
}
