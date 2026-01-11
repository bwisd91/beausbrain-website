export default function Services() {
    const services = [
      {
              title: "Tutoring & Coaching",
              description: "Individual and group tutoring in biology, psychology, writing, and study skills."
      },
      {
              title: "Academic Writing Support",
              description: "Guidance through every stage of the writing process from brainstorming to editing."
      },
      {
              title: "Curriculum & Workshop Design",
              description: "Design of courses, lesson plans, and facilitator guides."
      },
      {
              title: "Study Systems Coaching",
              description: "Non-clinical coaching for organization and follow-through."
      }
        ];

  return (
        <section className="services" id="services">
              <h2>Services</h2>h2>
              <div className="services-grid">
                {services.map((service, index) => (
                    <div key={index} className="service-card">
                                <h3>{service.title}</h3>h3>
                                <p>{service.description}</p>p>
                    </div>div>
                  ))}
              </div>div>
        </section>section>
      );
}</section>
