import { supabase } from "./supabase";
import type { TreeNode } from "@/components/dashboard/widgets/CodeTreeWidget";
import type { Database } from "@/types/supabase";

export type ProjectMetrics =
  Database["public"]["Tables"]["project_metrics"]["Row"];
export type AnalysisResult =
  Database["public"]["Tables"]["analysis_results"]["Row"];

export const createDefaultProject = async (userId: string) => {
  const { data: existingProject } = await supabase
    .from("projects")
    .select()
    .eq("user_id", userId)
    .single();

  if (existingProject) return existingProject;

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name: "Default Project",
      type: "python",
    })
    .select()
    .single();

  if (error) throw error;
  return project;
};

export const getProjectMetrics = async (projectId: string) => {
  const { data, error } = await supabase
    .from("project_metrics")
    .select("*")
    .eq("project_id", projectId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

export const getAnalysisResults = async (projectId: string) => {
  const { data, error } = await supabase
    .from("analysis_results")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
};

export const subscribeToProjectMetrics = (
  projectId: string,
  callback: (metrics: ProjectMetrics) => void,
) => {
  return supabase
    .channel(`project_metrics:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "project_metrics",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => {
        if (payload.eventType === "DELETE") return;
        callback(payload.new as ProjectMetrics);
      },
    )
    .subscribe((status) => {
      console.log(`Project metrics subscription status: ${status}`);
    });
};

export const subscribeToAnalysisResults = (
  projectId: string,
  callback: (results: AnalysisResult) => void,
) => {
  return supabase
    .channel(`analysis_results:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "analysis_results",
        filter: `project_id=eq.${projectId}`,
      },
      (payload) => {
        if (payload.eventType === "DELETE") return;
        callback(payload.new as AnalysisResult);
      },
    )
    .subscribe((status) => {
      console.log(`Analysis results subscription status: ${status}`);
    });
};

export const updateProjectMetrics = async (
  projectId: string,
  metrics: Partial<ProjectMetrics>,
) => {
  const { error } = await supabase.from("project_metrics").upsert({
    project_id: projectId,
    ...metrics,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
};

export const saveAnalysisResults = async (
  userId: string,
  results: Partial<AnalysisResult>,
) => {
  const project = await createDefaultProject(userId);

  const { error } = await supabase.from("analysis_results").insert({
    project_id: project.id,
    ...results,
  });

  if (error) throw error;

  // Also update project metrics
  await updateProjectMetrics(project.id, {
    code_tree: [],
    dependency_graph: [],
    performance_metrics: {},
  });
};
