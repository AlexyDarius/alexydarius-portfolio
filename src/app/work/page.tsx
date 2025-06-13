import { Projects } from "@/components/work/Projects";
import { Meta, Schema } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import * as defaultContent from "@/app/resources/content";
import { getProjects } from "@/app/utils/projects";
import { Column } from "@/once-ui/components";

export async function generateMetadata() {
  const { work } = defaultContent;
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}
export default async function Work() {
  const { work, about, person } = defaultContent;
  const projects = getProjects();
  
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Projects projects={projects} />
    </Column>
  );
}

