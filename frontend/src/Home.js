import React from "react";
import "./App.css";
import { FitnessCard } from "./components/FitnessCard";
import { NutritionCard } from "./components/NutritionCard";

function Home() {
  return (
    <div>
      <nav className="fg-nav">
        <h1>FitLife Guide</h1>
        <div>
          <a href="#fitness">Fitness</a>
          <a href="#nutrition">Nutrition</a>
        </div>
      </nav>

      <header>
        <div className="overlay">
          <h2>Your Journey to a Healthier You</h2>
          <p>Get expert fitness and nutritional guidance tailored to your goals.</p>
        </div>
      </header>

      <section id="fitness">
        <h3>Fitness Tips</h3>
        <div className="card-grid">
          <FitnessCard title="Full Body Workouts" image="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.muscleandfitness.com%2Froutine%2Fworkouts%2Fworkout-routines%2Fthe-best-full-body-muscle-workout%2F&psig=AOvVaw3SirGfgXTvw7IjGWUXgKCJ&ust=1750400019707000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCJDqgvnq_I0DFQAAAAAdAAAAABAE" description="Build strength and endurance with balanced training routines." />
          <FitnessCard title="Yoga & Flexibility" image="https://images.unsplash.com/photo-1554306274-f2070f45c6e4" description="Improve posture, breathing, and flexibility through yoga." />
          <FitnessCard title="HIIT & Cardio" image="https://images.unsplash.com/photo-1583454110550-5be3c78c63b2" description="Burn fat fast with high-intensity interval training." />
        </div>
      </section>

      <section id="nutrition">
        <h3>Nutritional Guidance</h3>
        <div className="card-grid">
          <NutritionCard title="Balanced Diet Plans" image="https://images.unsplash.com/photo-1512058564366-c9e7b4a2a112" description="Customized meal plans based on your body type and goals." />
          <NutritionCard title="Superfoods" image="https://images.unsplash.com/photo-1584270354949-1b213a5aaf03" description="Discover foods that boost immunity, energy, and metabolism." />
          <NutritionCard title="Hydration & Supplements" image="https://images.unsplash.com/photo-1605296867301-0c5ed3c87f4a" description="Learn how to hydrate effectively and choose the right supplements." />
        </div>
      </section>

      <footer>
        © 2025 FitLife Guide. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;
