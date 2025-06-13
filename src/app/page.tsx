import React from "react";
import { Meta } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";
import * as defaultContent from "@/app/resources/content";
import { HomeContent } from "@/components/home/HomeContent";
import { getProjects } from "@/app/utils/projects";

export async function generateMetadata() {
  const { home } = defaultContent;
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
  });
}
export default async function Home() {
  const projects = getProjects([1, 1]);
  return <HomeContent projects={projects} />;
}

