import bg from "../assets/hunger.jpg";


function Landing() {
  return (
    <div className="min-h-fit">
      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center text-center px-6 overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <img
          src={bg}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center">
          {/* <img src={logo} className="w-24 mb-6 opacity-90" /> */}

          {/* QUOTE */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-2xl">
            One meal can change a life. <br /> One act can change the world.
          </h1>

          {/* SUBTEXT */}
          <p className="mt-4 text-gray-200 max-w-xl">
            Join Annsetu and help connect surplus food with those who truly need
            it.
          </p>

          {/* BUTTONS
          <div className="mt-8 flex gap-4 flex-wrap justify-center">
            <button className="bg-[#FF9933] text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 transition">
              Donate Now 🍛
            </button>

            <button className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
              Request Food
            </button>
          </div> */}
        </div>
      </section>
    </div>
  );
}

export default Landing;
