import React from "react";

const HomePage = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <img
          src="https://images.unsplash.com/photo-1606226121384-8cbbf0b4c8ef?auto=format&fit=crop&w=1500&q=80"
          alt="Disaster Relief"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center py-24 px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Our Mission: Reconnecting Families
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
            Leveraging Technology with Empathy to reunite missing persons and
            bring hope during disasters.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
            Report a Missing Person
          </button>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 px-6 md:px-20 grid md:grid-cols-2 gap-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            Who We Are
          </h2>
          <p>
            We are a non-profit platform dedicated to helping families reunite
            with missing loved ones during natural or human-made disasters. Our
            mission is to create a secure digital bridge connecting survivors,
            authorities, and volunteers through verified data and technology.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            What We Do
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide a real-time person-tracking and data-matching system</li>
            <li>Notify families instantly on potential matches</li>
            <li>Collaborate with government and rescue forces</li>
            <li>Empower volunteers with digital tools for field operations</li>
          </ul>
        </div>
      </section>

      {/* Recent Disasters in India */}
      <section className="bg-blue-50 py-16 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
          Recent Disasters in India
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-lg">Sikkim Flash Floods (2023)</h3>
            <p className="text-sm mt-2">
              Over 80 people were reported missing after cloudbursts caused
              devastating floods and landslides. Our platform aims to assist
              families in locating their loved ones affected by such disasters.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-lg">Odisha Train Tragedy (2023)</h3>
            <p className="text-sm mt-2">
              The Balasore train accident left hundreds injured and many
              untraceable. Government rescue teams and volunteers worked
              tirelessly to identify victims and reunite families.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-lg">Himachal Landslides (2023)</h3>
            <p className="text-sm mt-2">
              Heavy monsoon rains caused massive landslides, leaving several
              missing. Our initiative provides a space for sharing details and
              locating missing individuals.
            </p>
          </div>
        </div>
      </section>

      {/* Government Initiatives */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
          Indian Government Initiatives
        </h2>
        <ul className="space-y-4 max-w-3xl mx-auto text-center">
          <li>✅ <b>NDMA (National Disaster Management Authority):</b> Coordinates disaster response and preparedness.</li>
          <li>✅ <b>NDRF (National Disaster Response Force):</b> Deployed to rescue and aid during calamities.</li>
          <li>✅ <b>Missing Persons Portal:</b> A government initiative for tracking and reporting missing individuals.</li>
          <li>✅ <b>DISHA Mobile App:</b> Helps women and citizens report emergencies instantly to local authorities.</li>
        </ul>
      </section>

      {/* Our Team */}
      <section className="bg-blue-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-8">Our Team & Partners</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow rounded-2xl p-6">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
            //  src="https://github.com/KB-Bhandari"
              alt="Team member"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h3 className="mt-4 font-bold text-lg">Komal Bhandari</h3>
            <p>Founder & Project Lead</p>
          </div>
          <div className="bg-white shadow rounded-2xl p-6">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Team member"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h3 className="mt-4 font-bold text-lg">Divyanshu </h3>
            <p>Rescue Operations Coordinator</p>
          </div>
          <div className="bg-white shadow rounded-2xl p-6">
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Team member"
              className="w-24 h-24 rounded-full mx-auto"
            />
            <h3 className="mt-4 font-bold text-lg">Charu Bhatt</h3>
            <p>Technical Support Lead</p>
          </div>
        </div>
      </section>

      {/* Embedded Social Videos */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-8">
          Watch Relief Efforts in Action
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <iframe
            className="rounded-xl w-full h-64"
            src="https://www.youtube.com/embed/1lB2BlzM0os"
            title="Flood Relief Efforts"
            allowFullScreen
          ></iframe>
          <iframe
            className="rounded-xl w-full h-64"
            src="https://www.youtube.com/embed/AcZ9xZB1V1E"
            title="NDRF Rescue Operations"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="bg-blue-600 text-white text-center py-10 px-6">
        <h2 className="text-2xl font-semibold mb-4">Emergency Hotlines</h2>
        <p>📞 National Disaster Helpline: <b>1078</b></p>
        <p>📞 NDRF Control Room: <b>011-23438252</b></p>
        <p>📧 Email: <b>help@ndrf.gov.in</b> | <b>missinghelp@india.gov.in</b></p>
      </section>

      {/* Footer
      <footer className="bg-gray-900 text-gray-300 text-center py-6">
        <p>© 2025 Missing Person Reunification Project | Designed with ❤️ by KhojSetu Team</p>
      </footer> */}
    </div>
  );
};

export default HomePage;
