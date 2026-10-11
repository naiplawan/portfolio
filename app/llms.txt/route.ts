import { EDUCATION, EMPLOYMENT, PROFESSIONAL_INFO, SITE_URL, SOCIAL_LINKS } from '@/lib/constants';
import { FAQ_ITEMS } from '@/lib/data/faq-data';
import { getProjects } from '@/lib/data/projects-data';
import { KNOWS_ABOUT, PERSON_SUMMARY } from '@/lib/seo';

export const revalidate = 3600;

/**
 * llms.txt (https://llmstxt.org): a plain-Markdown brief for AI assistants and
 * answer engines, built from the same data the site renders.
 */
export async function GET() {
  const projects = await getProjects();

  const body = `# ${PROFESSIONAL_INFO.name}

> ${PERSON_SUMMARY}

## Facts

- Role: ${EMPLOYMENT.current.title} at ${EMPLOYMENT.current.company} (${EMPLOYMENT.current.period})
- Previously: ${EMPLOYMENT.previous.title} at ${EMPLOYMENT.previous.company} (${EMPLOYMENT.previous.period})
- Education: ${EDUCATION.degree.name} in Biological Sciences, ${EDUCATION.degree.institution} (${EDUCATION.degree.period}); ${EDUCATION.bootcamp.name}, ${EDUCATION.bootcamp.institution} (${EDUCATION.bootcamp.period})
- Location: ${PROFESSIONAL_INFO.location} (UTC+7)
- Skills: ${KNOWS_ABOUT.join(', ')}
- Availability: open to freelance projects and full-time roles
- Contact: ${SOCIAL_LINKS.email}

## Pages

- [Home](${SITE_URL}/): overview, selected projects, skills and career
- [Projects](${SITE_URL}/projects): every public project with live demo and source links
- [About](${SITE_URL}/about): background from biology to software, full timeline
- [Services](${SITE_URL}/services): freelance frontend, backend and mobile work
- [Contact](${SITE_URL}/contact): contact form, email and phone

## Projects

${projects
  .map((project) => {
    const links = [project.liveUrl && `[live](${project.liveUrl})`, `[source](${project.githubUrl})`]
      .filter(Boolean)
      .join(' · ');
    const stack = project.technologies.length > 0 ? ` (${project.technologies.slice(0, 5).join(', ')})` : '';
    return `- ${project.title}${stack}: ${project.description} ${links}`;
  })
  .join('\n')}

## FAQ

${FAQ_ITEMS.map(({ question, answer }) => `### ${question}\n\n${answer}`).join('\n\n')}

## Profiles

- GitHub: ${SOCIAL_LINKS.github}
- LinkedIn: ${SOCIAL_LINKS.linkedin}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
