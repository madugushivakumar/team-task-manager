import Particles from "react-tsparticles";

const ParticleBg = () => {
  return (
    <Particles
      options={{
        particles: {
          number: { value: 40 },
          size: { value: 3 },
          move: { speed: 1 },
        },
      }}
    />
  );
};

export default ParticleBg;