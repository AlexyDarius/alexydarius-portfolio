import React from "react";
import { Meta } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import * as defaultContent from "@/app/resources/content";
import { AboutContent } from "@/components/about/AboutContent";

export async function generateMetadata() {
  const { about } = defaultContent;
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  return <AboutContent />;
}
