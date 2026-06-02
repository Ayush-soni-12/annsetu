import { useState } from "react";
// 1. Yahan images ko import karein
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";
// Agar image3 bhi hai toh usey bhi import karein (aapke folder me image3.jpg nahi dikh rahi hai, dhyan rakhein)
// import img3 from "../assets/image3.jpg"; 

const Last = () => {
  const [active, setActive] = useState(1);

  // 2. String ki jagah imported variables use karein (Quotes "" hata dein)
  const cards = [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    // { id: 3, img: img3 },
  ];

  return (
    <section className="py-16 px-6 md:px-16 bg-white">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">
          And this is the{" "}
          <span className="text-orange-500">difference</span> you create
        </h2>

        <p className="text-gray-500 mt-3">
          Because of daily meals from, I can now go to school and focus on my dreams.”
        </p>
      </div>

      {/* Cards */}
      <div className="flex gap-6 max-w-6xl mx-auto h-[380px]">

        {cards.map((card) => (
          <div
            key={card.id}
            onMouseEnter={() => setActive(card.id)}
            className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out
              ${active === card.id ? "flex-2" : "flex-1"}
            `}
          >
            {/* Image */}
            <img
              src={card.img}
              className={`w-full h-full object-cover transition-all duration-500
                ${active === card.id ? "grayscale-0" : "grayscale brightness-50"}
              `}
            />
            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-black/60 flex items-end p-6 transition-opacity duration-500
                ${active === card.id ? "opacity-100" : "opacity-0"}
              `}
            >
              {/* 👇 TEXT ONLY FOR MAIN CARD */}
              {card.id === 1 && (
                <div>
                  <p className="text-white text-lg font-medium">
                    Because when no child sleeps hungry{" "}
                    <span className="text-orange-400 font-semibold">
                      Annsetu
                    </span>, we unlock hope, dignity, and a better future for India.
                  </p>

                  <p className="text-gray-300 mt-2 text-sm">
                    Raju • Government School Student
                  </p>
                </div>
              )}


              {card.id === 2 && (
                <div>
                  <p className="text-white text-lg font-medium">
                    "A warm meal doesn't just fill stomachs; "{" "}
                    <span className="text-orange-400 font-semibold">
                      Annsetu
                    </span>, it brings families together at the end of a long day. Thank you, Annsetu.
                  </p>

                  <p className="text-gray-300 mt-2 text-sm">
                    Raju • Government School Student
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}

export default Last;
