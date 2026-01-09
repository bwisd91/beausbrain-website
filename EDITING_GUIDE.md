# How to Edit Your Articles

Your website is now on GitHub! Here's how to edit your articles:

## Quick Start

1. Go to your repository: https://github.com/bwisd91/beausbrain-website
2. 2. Click on **index.html** to edit it
   3. 3. Find the article you want to edit (look for the comment markers below)
      4. 4. Replace the placeholder text with your full article
         5. 5. Click "Commit changes" when done
           
            6. ## Your Three Articles
           
            7. ### Article 1: Structure and Healing
            8. **Location in index.html:** Line ~83-95 (inside `article-content-1` div)
           
            9. Current preview text:
            10. ```
                In residential behavioral health, I've seen how consistent routines and clear expectations create safety for adolescents navigating crisis. Structure isn't about control—it's about predictability in an unpredictable internal world.
                ```

                To edit: Replace the comment `<!-- Write your full article here -->` with your complete article content wrapped in `<p>` tags.

                ### Article 2: A New Chapter—And Somehow I'm a Taxi Driver Now
                **Location in index.html:** Line ~105-117 (inside `article-content-2` div)

                Current preview text:
                ```
                I'm on the move again—and apparently I'm a taxi driver now. Life has shifted fast. This is a short note on transition, resilience, and learning to take the turns without losing direction.
                ```

                To edit: Replace the comment `<!-- Write your full article here -->` with your complete article content wrapped in `<p>` tags.

                ### Article 3: Lessons from Teaching Abroad
                **Location in index.html:** Line ~127-139 (inside `article-content-3` div)

                Current preview text:
                ```
                Teaching English in Thailand taught me that effective education transcends language. Patience, visual demonstration, and meeting learners where they are work across every culture and classroom.
                ```

                To edit: Replace the comment `<!-- Write your full article here -->` with your complete article content wrapped in `<p>` tags.

                ## How to Format Articles

                Wrap each paragraph in `<p>` tags:

                ```html
                <p>Your first paragraph goes here. Make it compelling and set the tone.</p>

                <p>Your second paragraph continues the thought. Each paragraph should be a complete idea.</p>

                <p>You can have as many paragraphs as you need.</p>
                ```

                ## How the "Read More" Function Works

                - When someone visits your site, they see the preview text
                - - When they click "Read more →", the full article expands
                  - - The text changes to "Show less ←"
                    - - Clicking again collapses the article
                     
                      - **You don't need to do anything special** - this functionality is already built in!
                     
                      - ## After You Edit
                     
                      - 1. After editing index.html, scroll down and click "Commit changes"
                        2. 2. Add a brief commit message (e.g., "Update Structure and Healing article")
                           3. 3. Click "Commit changes" again
                              4. 4. Wait 1-2 minutes for your site to automatically redeploy
                                 5. 5. Visit https://beausbrain.com to see your changes live!
                                   
                                    6. ## Tips
                                   
                                    7. - Keep your preview text (the short summary) to 2-3 sentences
                                       - - Make the full article substantive - this is where you tell the full story
                                         - - Use clear, conversational language
                                           - - Feel free to add multiple paragraphs to your articles
                                             - - You can always come back and edit again anytime
                                              
                                               - ## Questions?
                                              
                                               - Your site is now fully set up. Every time you edit a file on GitHub and commit the changes, Netlify automatically deploys your changes within minutes.
                                              
                                               - Happy writing!
