export default function Credentials() {
    const credentials = [
          "Behavioral health experience in crisis prevention and intervention",
          "Over a decade of tutoring and curriculum design experience",
          "Training in evidence-based therapeutic and coaching approaches",
          "Expertise in adolescent development and educational psychology"
        ];

  return (
        <section className="credentials" id="credentials">
              <h2>Credentials</h2>h2>
              <ul className="credentials-list">
                {credentials.map((credential, index) => (
                    <li key={index}>
                                <span className="checkmark">✓</span>span>
                      {credential}
                    </li>li>
                  ))}
              </ul>ul>
        </section>section>
      );
}</section>
