export default function Thoughts() {
    const articles = [
      {
              title: "The Connection Between Structure and Healing",
              date: "January 2026",
              excerpt: "In residential behavioral health, I've seen how consistent routines and clear expectations create safety for adolescents navigating crisis. Structure isn't about control—it's about predictability in an unpredictable internal world.",
              slug: "structure-and-healing"
      },
      {
              title: "A New Chapter—And Somehow I'm a Taxi Driver Now",
              date: "January 2026",
              excerpt: "I'm on the move again—and apparently I'm a taxi driver now. Life has shifted fast. This is a short note on transition, resilience, and learning to take the turns without losing direction.",
              slug: "taxi-driver"
      },
      {
              title: "Lessons from Teaching Abroad",
              date: "November 2025",
              excerpt: "Reflections on behavioral health, education, and professional development.",
              slug: "lessons-abroad"
      }
        ];

  return (
        <section className="thoughts" id="thoughts">
              <h2>Thoughts</h2>h2>
              <p>Reflections on behavioral health, education, and professional development.</p>p>
              <div className="articles-list">
                {articles.map((article) => (
                    <article key={article.slug} className="article-preview">
                                <span className="article-date">{article.date}</span>span>
                                <h3>{article.title}</h3>h3>
                                <p>{article.excerpt}</p>p>
                                <a href={`/thoughts/${article.slug}`}>Read more →</a>a>
                    </article>article>
                  ))}
              </div>div>
        </section>section>
      );
}</section>
