import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-3">About KhojSetu</h1>
          <p className="text-lg text-gray-600 mb-6">
            Connecting hearts, reuniting families — one step closer to humanity.
          </p>
          <img
            src="https://img.freepik.com/premium-vector/flood-rescue-teams-are-helping-children-women-out-floods_353206-207.jpg?w=996"
            alt="Disaster Relief Volunteers"
            className="rounded-2xl shadow-lg mx-auto w-full max-h-96 object-cover"
          />
        </section>

        {/* Introduction */}
        <section className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-3 text-blue-700">Who We Are</h2>
            <p className="leading-relaxed text-gray-700">
              <strong>KhojSetu</strong> is a volunteer-driven digital initiative aimed at helping
              people reconnect with their loved ones during disasters and emergencies.
              Our platform bridges the gap between missing individuals and families by
              using verified volunteer networks and technology for rapid communication
              and reunification.
            </p>
          </div>
          <img
            src="https://static.vecteezy.com/system/resources/previews/004/449/833/original/volunteers-2d-isolated-illustration-contributing-to-humanitarian-aid-smiling-man-and-woman-social-service-worker-flat-characters-on-cartoon-background-charity-work-colourful-scene-vector.jpg"
            alt="Volunteers Helping"
            className="rounded-xl shadow-md w-full md:w-1/2 object-cover"
          />
        </section>

        {/* Recent Disaster & Response */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src="https://www.financialexpress.com/wp-content/uploads/2023/07/Punjab-Floods-PTI.jpg?w=1024"
              alt="Flood Relief Efforts"
              className="rounded-xl shadow-md w-full md:w-1/2 object-cover"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-3 text-blue-700">
                Recent Disaster Event: The 2025 Assam Floods
              </h2>
              <p className="leading-relaxed text-gray-700 mb-3">
                In July 2025, heavy monsoon rains caused devastating floods in Assam,
                affecting more than 20 districts and displacing thousands of families.
                KhojSetu collaborated with the <strong>National Disaster Response Force (NDRF)</strong>,
                local NGOs, and district administrations to assist in identifying missing persons,
                coordinating volunteer rescue efforts, and creating digital family reunification records.
              </p>
              <p className="text-gray-700">
                The communities showed exceptional resilience — with local youth volunteering
                in relief camps, medical units, and digital tracking. Government agencies
                provided shelters, food assistance, and psychological support. Technology-driven
                coordination helped reunite over <strong>1,200 individuals</strong> with their families.
              </p>
            </div>
          </div>
        </section>

        {/* Government Policies and Support */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            Government Policies & Relief Measures
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>National Disaster Management Act (2005):</strong> Framework for
                coordinated disaster preparedness and response.
              </li>
              <li>
                <strong>Prime Minister’s National Relief Fund (PMNRF):</strong> Provides
                immediate financial assistance to disaster victims.
              </li>
              <li>
                <strong>NDMA & SDRF (State Disaster Response Fund):</strong> Support states
                in mitigation, rescue, and rehabilitation.
              </li>
              <li>
                <strong>Mission LiFE (Lifestyle for Environment):</strong> Encourages
                sustainable practices to prevent disaster risks.
              </li>
            </ul>
            <img
              src="https://static.pib.gov.in/WriteReadData/userfiles/image/G20-1Y4CE.jpg"
              alt="Disaster Policy Meeting"
              className="rounded-xl shadow-md object-cover w-full h-56"
            />
          </div>
        </section>

        {/* Emergency Contact Table */}
        <section className="bg-white p-6 rounded-2xl shadow overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            State-wise Emergency Helpline Numbers
          </h2>
          <img
            src="https://3.bp.blogspot.com/-GZOFiQ4NVE0/WK8CG_7gtQI/AAAAAAAAAJ0/AMKv-JrmxGghWmZbnFHopC8sP1v81Op0ACLcB/s1600/Disaster%2BManagement.jpg"
            alt="Emergency Response"
            className="rounded-xl shadow-md mb-4 w-full max-h-72 object-cover"
          />
          <table className="min-w-full border border-gray-200 rounded-lg text-sm text-gray-700">
            <thead className="bg-blue-100">
              <tr>
                <th className="py-2 px-4 border-b">State</th>
                <th className="py-2 px-4 border-b">Disaster Helpline</th>
                <th className="py-2 px-4 border-b">Relief Control Room</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Assam", "1070 / 0361-2237211", "0361-2237498"],
                ["Bihar", "1070 / 0612-2217305", "0612-2294204"],
                ["Maharashtra", "1070 / 022-22027990", "022-22025399"],
                ["Odisha", "1070 / 0674-2395398", "0674-2395399"],
                ["Uttarakhand", "1070 / 0135-2710334", "0135-2716201"],
                ["Tamil Nadu", "1070 / 044-28593990", "044-28593997"],
                ["West Bengal", "1070 / 033-22143526", "033-22145656"],
                ["Kerala", "1070 / 0471-2325190", "0471-2325191"],
              ].map(([state, helpline, control]) => (
                <tr key={state} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{state}</td>
                  <td className="py-2 px-4 border-b">{helpline}</td>
                  <td className="py-2 px-4 border-b">{control}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Training & Technology */}
        <section className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row items-center gap-6">
          <img
            src="https://img.freepik.com/premium-vector/rescuers-team-saves-people-from-flood-rescued-group-floating-safety-boat-natural-disaster-storm-typhoon-city-water-flooded-houses-flat-isolated-vector-illustration-white-background_633472-3579.jpg?w=2000"
            alt="Rescue Training"
            className="rounded-xl shadow-md w-full md:w-1/2 object-cover"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-3 text-blue-700">
              New Training & Preparedness Techniques
            </h2>
            <p className="text-gray-700 mb-3">
              To build a resilient nation, KhojSetu and other partners organize
              <strong> capacity-building workshops</strong> focusing on:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use of drones for rapid area assessment during floods and earthquakes.</li>
              <li>Training volunteers in First Aid, CPR, and psychological support.</li>
              <li>Mobile-based early warning systems and GPS tracking for missing persons.</li>
              <li>Workshops on climate-resilient housing and community disaster drills.</li>
            </ul>
          </div>
        </section>

        {/* Government Apps & Initiatives */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-3 text-blue-700">
            Government Apps & Initiatives for Disaster Management
          </h2>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>NDMA Mobile App:</strong> Real-time alerts, emergency contacts, and
                safety guidelines during disasters.
              </li>
              <li>
                <strong>MyGov Portal:</strong> Provides verified updates, citizen reporting,
                and volunteer coordination during crises.
              </li>
              <li>
                <strong>Bhuvan App (ISRO):</strong> Satellite-based maps for disaster impact
                assessment and resource planning.
              </li>
              <li>
                <strong>INCOIS & IMD Alerts:</strong> Tsunami and weather alerts for coastal
                safety and evacuation planning.
              </li>
            </ul>
            <img
              src="https://sc0.blr1.cdn.digitaloceanspaces.com/inline/adeepqxakv-1578395050.jpg"
              alt="Disaster Management Apps"
              className="rounded-xl shadow-md object-cover w-full h-56"
            />
          </div>
        </section>

        {/* Closing Section */}
        <section className="bg-blue-50 p-6 rounded-2xl shadow text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Together for a Safer Tomorrow
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-4">
            KhojSetu stands for empathy, technology, and community action.
            With your support and awareness, we can ensure that no one remains
            missing, and every life finds its way back home.
          </p>
          <img
            src="https://cdn1.byjus.com/wp-content/uploads/2016/04/disaster-management-in-india-disaster-management.jpeg"
            alt="Unity for Disaster Relief"
            className="rounded-2xl shadow-lg mx-auto  max-h-100 object-cover"
          />
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
