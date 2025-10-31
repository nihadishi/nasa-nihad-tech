export default function InfoSection() {
  return (
    <div className="bg-white dark:bg-[#333333] p-8 rounded-lg shadow-md">
      <h3 className="text-xl font-light mb-4">Available APIs</h3>
      <div className="space-y-4 text-gray-700 dark:text-gray-300">
        <div>
          <strong>CME:</strong> Coronal Mass Ejections - large expulsions of plasma and magnetic field from the Sun&apos;s corona
        </div>
        <div>
          <strong>GST:</strong> Geomagnetic Storms - disturbances in Earth&apos;s magnetosphere
        </div>
        <div>
          <strong>IPS:</strong> Interplanetary Shocks - shock waves traveling through interplanetary space
        </div>
        <div>
          <strong>FLR:</strong> Solar Flares - sudden brightening of the Sun&apos;s atmosphere
        </div>
        <div>
          <strong>SEP:</strong> Solar Energetic Particles - high-energy particles from the Sun
        </div>
        <div>
          <strong>MPC:</strong> Magnetopause Crossings - boundary between Earth&apos;s magnetosphere and solar wind
        </div>
        <div>
          <strong>RBE:</strong> Radiation Belt Enhancements - increases in radiation belt particle populations
        </div>
        <div>
          <strong>HSS:</strong> High Speed Streams - fast-moving streams of solar wind
        </div>
        <div>
          <strong>WSA+Enlil:</strong> Simulations combining coronal and heliospheric models
        </div>
        <div>
          <strong>Notifications:</strong> Space weather alerts and warnings
        </div>
      </div>
    </div>
  );
}

