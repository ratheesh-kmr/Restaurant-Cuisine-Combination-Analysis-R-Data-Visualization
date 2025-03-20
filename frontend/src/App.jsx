function App() {
  return (
    <>
      <div className="bg-black text-white min-h-screen max-w-screen">
        {/* Main Section */}
        <div className="h-dvh flex flex-col md:flex-row items-center">
          
          {/* Left Side: Text */}
          <div className="p-4 md:w-1/2 flex flex-col justify-center">
            <h1 className="text-[5rem] mb-4">Cuisine Analysis</h1>
            <p className="text-[2rem]">
              Analyze the density of an area's cuisine combination and structure your business accordingly...
            </p>
          </div>

          {/* Right Side: Background Image */}
          <div className="md:w-1/2 h-full w-full">
            <div 
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/restaurant.png')" }}
            ></div>
          </div>
        </div>

        {/* Second Section */}
        <div className="h-dvh">
          <h1 className="p-4 border-b border-b-gray-500 flex items-center text-4xl">Analyser</h1>
        </div>
      </div>
    </>
  );
}

export default App;
