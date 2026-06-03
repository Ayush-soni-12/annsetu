
import aboutImage from '../assets/mission.jpg';             

const About = () => {
  return (
    <div className="bg-[#FFF5E1] min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="py-20 px-6 md:px-16 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Bridging the Gap Between <span className="text-[#8B0000]">Surplus and Need</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
          Annsetu is more than just a platform; it&apos;s a movement. We believe that in a country that produces enough food to feed everyone, no one should have to sleep hungry. We are the bridge connecting those who have surplus food with those who need it the most.
        </p>
      </section>

      {/* 2. OUR MISSION & VISION SECTION */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To eradicate hunger and reduce food waste by creating a transparent, tech-driven network. We empower restaurants, caterers, and individuals to donate surplus food safely and efficiently to verified NGOs and community centers.
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                A hunger-free India where every meal is valued, and every citizen has access to safe, nutritious, and dignified food.
              </p>
            </div>
          </div>

          {/* Placeholder Image Box (Aap yahan apni image laga sakte hain) */}
          <div className="bg-gray-200 h-80 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
             <img src={aboutImage} alt="Volunteers packing food" className="w-full h-full object-cover" />
             
          </div>

        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="py-16 px-6 md:px-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">What Drives Us</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Value 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-[#8B0000]">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Dignity First</h3>
            <p className="text-gray-600">
              We ensure that every meal served is fresh, hygienic, and given with absolute respect and dignity to the receiver.
            </p>
          </div>

          {/* Value 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-[#8B0000]">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transparency</h3>
            <p className="text-gray-600">
              Through our real-time tracking, donors know exactly where their food goes and the direct impact they are making.
            </p>
          </div>

          {/* Value 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-[#8B0000]">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
            <p className="text-gray-600">
              We are building a robust community of volunteers, donors, and partners working together for a common cause.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;