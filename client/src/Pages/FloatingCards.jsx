// src/components/FloatingCards/FloatingCards.jsx
import React, { useEffect } from "react";
import "./FloatingCards.css";

const FloatingCards = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(".activity-card");

    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.animationPlayState = "paused";
      });

      card.addEventListener("mouseleave", function () {
        this.style.animationPlayState = "running";
      });
    });

    // ambient particles generator
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        createAmbientParticle();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  function createAmbientParticle() {
    const particle = document.createElement("div");
    particle.className = "ambient-particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDuration = 15 + Math.random() * 10 + "s";
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 20000);
  }

  const cards = [
    { icon: "📊", title: "Academic Analytics", desc: "Performance tracking & insights" },
    { icon: "🎓", title: "Certifications Hub", desc: "Digital credential management" },
    { icon: "🎯", title: "Activity Tracker", desc: "Extra-curricular engagement" },
    { icon: "💼", title: "Career Portfolio", desc: "Professional development" },
    { icon: "🏆", title: "Achievement Records", desc: "Awards & recognition" },
    { icon: "📋", title: "Compliance Reports", desc: "NAAC & accreditation ready" },
    { icon: "🤝", title: "Community Service", desc: "Social impact tracking" },
    { icon: "👨‍💼", title: "Leadership Roles", desc: "Position & responsibility logs" },
    { icon: "🔬", title: "Research Projects", desc: "Academic research portfolio" },
    { icon: "🌐", title: "Online Courses", desc: "MOOCs & skill certifications" },
  ];

  return (
    <div className="floating-cards-wrapper">
      <div className="subtle-overlay"></div>

      {cards.map((card, index) => (
        <div key={index} className={`activity-card card${index + 1}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <div className="card-title">{card.title}</div>
            <div className="card-description">{card.desc}</div>
          </div>
        </div>
      ))}

      {/* Particles */}
      <div className="ambient-particle particle1"></div>
      <div className="ambient-particle particle2"></div>
      <div className="ambient-particle particle3"></div>
      <div className="ambient-particle particle4"></div>
      <div className="ambient-particle particle5"></div>
    </div>
  );
};

export default FloatingCards;
