export default function CanvasParticles() {
    return (
        <div className="absolute inset-0 w-full h-full bg-dark overflow-hidden">
            <div className="orb orb-1 absolute rounded-full w-[200px] h-[200px] md:w-[500px] md:h-[500px] -top-[10%] -right-[5%]"
                style={{ background: 'radial-gradient(circle, rgba(0,112,243,0.3) 0%, rgba(0,112,243,0.08) 40%, transparent 70%)' }}
            />
            <div className="orb orb-2 absolute rounded-full w-[180px] h-[180px] md:w-[450px] md:h-[450px] -bottom-[5%] -left-[5%]"
                style={{ background: 'radial-gradient(circle, rgba(0,194,255,0.25) 0%, rgba(0,194,255,0.06) 40%, transparent 70%)' }}
            />
            <div className="orb orb-3 absolute rounded-full w-[150px] h-[150px] md:w-[350px] md:h-[350px] top-[30%] left-[30%]"
                style={{ background: 'radial-gradient(circle, rgba(0,112,243,0.2) 0%, rgba(0,112,243,0.04) 40%, transparent 70%)' }}
            />
            <div className="orb orb-4 absolute rounded-full w-[120px] h-[120px] md:w-[300px] md:h-[300px] top-[15%] left-[8%]"
                style={{ background: 'radial-gradient(circle, rgba(0,194,255,0.15) 0%, transparent 60%)' }}
            />

            {/* Bottom fade — dissolves orbs into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark to-transparent z-10" />

            <style dangerouslySetInnerHTML={{ __html: `
                .orb {
                    will-change: transform, opacity;
                    filter: blur(30px);
                }
                @media (min-width: 768px) {
                    .orb { filter: blur(40px); }
                }
                .orb-1 { animation: drift1 12s ease-in-out infinite; }
                .orb-2 { animation: drift2 14s ease-in-out infinite; }
                .orb-3 { animation: drift3 13s ease-in-out infinite; }
                .orb-4 { animation: drift4 12s ease-in-out infinite; }
                @keyframes drift1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(-70px, 60px) scale(1.15); }
                    50% { transform: translate(40px, 90px) scale(0.9); }
                    75% { transform: translate(65px, 30px) scale(1.08); }
                }
                @keyframes drift2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(80px, -60px) scale(1.2); }
                    66% { transform: translate(-40px, -85px) scale(0.85); }
                }
                @keyframes drift3 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    30% { transform: translate(-65px, -75px) scale(1.25); opacity: 1; }
                    60% { transform: translate(80px, 45px) scale(0.8); opacity: 0.4; }
                }
                @keyframes drift4 {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
                    40% { transform: translate(90px, 70px) scale(1.2); opacity: 0.9; }
                    70% { transform: translate(-55px, -45px) scale(0.85); opacity: 0.4; }
                }
            `}} />
        </div>
    );
}
