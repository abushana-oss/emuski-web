import { supabase } from './supabase';

export interface BalloonAnnotation {
  id: string;
  x: number;
  y: number;
  number: number;
  label: string;
  style: 'circle' | 'square' | 'diamond';
  color: string;
  note?: string;
}

export interface BalloonProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  pdf_file_name: string;
  pdf_file_url: string;
  pdf_file_size: number;
  created_at: string;
  updated_at: string;
  annotations?: BalloonAnnotation[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  pdf_file_name: string;
  pdf_file_url: string;
  pdf_file_size: number;
}

export interface CreateAnnotationData {
  project_id: string;
  balloon_number: number;
  label: string;
  x_position: number;
  y_position: number;
  style: 'circle' | 'square' | 'diamond';
  color: string;
  note?: string;
}

export class BalloonAPI {
  // Projects CRUD
  static async createProject(data: CreateProjectData): Promise<BalloonProject | null> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return null;
      }

      const { data: project, error } = await supabase
        .from('balloon_projects')
        .insert([{
          user_id: user.id, // Explicitly set user_id
          name: data.name,
          description: data.description,
          pdf_file_name: data.pdf_file_name,
          pdf_file_url: data.pdf_file_url,
          pdf_file_size: data.pdf_file_size
        }])
        .select()
        .single();

      if (error) {
        return null;
      }

      return project;
    } catch (error) {
      return null;
    }
  }

  static async getProjects(): Promise<BalloonProject[]> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return [];
      }

      // Only fetch projects belonging to the authenticated user
      const { data: projects, error } = await supabase
        .from('balloon_projects_with_stats')
        .select('*')
        .eq('user_id', user.id)  // ✅ SECURITY FIX: Only user's own projects
        .order('updated_at', { ascending: false });

      if (error) {
        // Error('Error fetching balloon projects:', error);
        return [];
      }

      return projects || [];
    } catch (error) {
      // Error('Unexpected error fetching projects:', error);
      return [];
    }
  }

  static async getProject(projectId: string): Promise<BalloonProject | null> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return null;
      }

      // Only fetch project if it belongs to the authenticated user
      const { data: project, error } = await supabase
        .from('balloon_projects')
        .select(`
          *,
          annotations:balloon_annotations(*)
        `)
        .eq('id', projectId)
        .eq('user_id', user.id)  // ✅ SECURITY FIX: Only user's own project
        .single();

      if (error) {
        // Error('Error fetching balloon project:', error);
        return null;
      }

      // Transform annotations to match component format
      if (project && project.annotations) {
        project.annotations = project.annotations.map((annotation: any) => ({
          id: annotation.id,
          x: annotation.x_position,
          y: annotation.y_position,
          number: annotation.balloon_number,
          label: annotation.label,
          style: annotation.style,
          color: annotation.color,
          note: annotation.note || ''
        }));
      }

      return project;
    } catch (error) {
      // Error('Unexpected error fetching project:', error);
      return null;
    }
  }

  static async updateProject(projectId: string, updates: Partial<CreateProjectData>): Promise<boolean> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return false;
      }

      // Only update project if it belongs to the authenticated user
      const { error } = await supabase
        .from('balloon_projects')
        .update(updates)
        .eq('id', projectId)
        .eq('user_id', user.id);  // ✅ SECURITY FIX: Only user's own project

      if (error) {
        // Error('Error updating balloon project:', error);
        return false;
      }

      return true;
    } catch (error) {
      // Error('Unexpected error updating project:', error);
      return false;
    }
  }

  static async deleteProject(projectId: string): Promise<boolean> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return false;
      }

      // Only delete project if it belongs to the authenticated user
      const { error } = await supabase
        .from('balloon_projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);  // ✅ SECURITY FIX: Only user's own project

      if (error) {
        // Error('Error deleting balloon project:', error);
        return false;
      }

      return true;
    } catch (error) {
      // Error('Unexpected error deleting project:', error);
      return false;
    }
  }

  // Annotations CRUD
  static async createAnnotation(data: CreateAnnotationData): Promise<BalloonAnnotation | null> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return null;
      }

      // Verify the project belongs to the authenticated user before creating annotation
      const { data: project, error: projectError } = await supabase
        .from('balloon_projects')
        .select('id')
        .eq('id', data.project_id)
        .eq('user_id', user.id)  // ✅ SECURITY FIX: Verify project ownership
        .single();

      if (projectError || !project) {
        // Error('Project not found or unauthorized');
        return null;
      }

      const { data: annotation, error } = await supabase
        .from('balloon_annotations')
        .insert([{
          project_id: data.project_id,
          balloon_number: data.balloon_number,
          label: data.label,
          x_position: data.x_position,
          y_position: data.y_position,
          style: data.style,
          color: data.color,
          note: data.note || ''
        }])
        .select()
        .single();

      if (error) {
        // Error('Error creating balloon annotation:', error);
        return null;
      }

      // Transform database format to component format
      return {
        id: annotation.id,
        x: annotation.x_position,
        y: annotation.y_position,
        number: annotation.balloon_number,
        label: annotation.label,
        style: annotation.style,
        color: annotation.color,
        note: annotation.note || ''
      };
    } catch (error) {
      // Error('Unexpected error creating annotation:', error);
      return null;
    }
  }

  static async updateAnnotation(annotationId: string, updates: Partial<CreateAnnotationData>): Promise<boolean> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return false;
      }

      // Verify the annotation belongs to a project owned by the authenticated user
      const { data: annotation, error: annotationError } = await supabase
        .from('balloon_annotations')
        .select(`
          id,
          project_id,
          balloon_projects!inner(user_id)
        `)
        .eq('id', annotationId)
        .eq('balloon_projects.user_id', user.id)  // ✅ SECURITY FIX: Verify project ownership
        .single();

      if (annotationError || !annotation) {
        // Error('Annotation not found or unauthorized');
        return false;
      }

      // Transform component format to database format
      const dbUpdates: any = {};
      if (updates.x_position !== undefined) dbUpdates.x_position = updates.x_position;
      if (updates.y_position !== undefined) dbUpdates.y_position = updates.y_position;
      if (updates.balloon_number !== undefined) dbUpdates.balloon_number = updates.balloon_number;
      if (updates.label !== undefined) dbUpdates.label = updates.label;
      if (updates.style !== undefined) dbUpdates.style = updates.style;
      if (updates.color !== undefined) dbUpdates.color = updates.color;

      const { error } = await supabase
        .from('balloon_annotations')
        .update(dbUpdates)
        .eq('id', annotationId);

      if (error) {
        // Error('Error updating balloon annotation:', error);
        return false;
      }

      return true;
    } catch (error) {
      // Error('Unexpected error updating annotation:', error);
      return false;
    }
  }

  static async deleteAnnotation(annotationId: string): Promise<boolean> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return false;
      }

      // Verify the annotation belongs to a project owned by the authenticated user
      const { data: annotation, error: annotationError } = await supabase
        .from('balloon_annotations')
        .select(`
          id,
          project_id,
          balloon_projects!inner(user_id)
        `)
        .eq('id', annotationId)
        .eq('balloon_projects.user_id', user.id)  // ✅ SECURITY FIX: Verify project ownership
        .single();

      if (annotationError || !annotation) {
        // Error('Annotation not found or unauthorized');
        return false;
      }

      const { error } = await supabase
        .from('balloon_annotations')
        .delete()
        .eq('id', annotationId);

      if (error) {
        // Error('Error deleting balloon annotation:', error);
        return false;
      }

      return true;
    } catch (error) {
      // Error('Unexpected error deleting annotation:', error);
      return false;
    }
  }

  static async getProjectAnnotations(projectId: string): Promise<BalloonAnnotation[]> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return [];
      }

      // Verify the project belongs to the authenticated user before fetching annotations
      const { data: project, error: projectError } = await supabase
        .from('balloon_projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)  // ✅ SECURITY FIX: Verify project ownership
        .single();

      if (projectError || !project) {
        // Error('Project not found or unauthorized');
        return [];
      }

      const { data: annotations, error } = await supabase
        .from('balloon_annotations')
        .select('*')
        .eq('project_id', projectId)
        .order('balloon_number');

      if (error) {
        // Error('Error fetching annotations:', error);
        return [];
      }

      // Transform database format to component format
      return (annotations || []).map(annotation => ({
        id: annotation.id,
        x: annotation.x_position,
        y: annotation.y_position,
        number: annotation.balloon_number,
        label: annotation.label,
        style: annotation.style,
        color: annotation.color,
        note: annotation.note || ''
      }));
    } catch (error) {
      // Error('Unexpected error fetching annotations:', error);
      return [];
    }
  }

  // Batch operations for better performance
  static async saveAllAnnotations(projectId: string, annotations: BalloonAnnotation[]): Promise<boolean> {
    try {
      // Check if user is authenticated first
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        return false;
      }

      // Verify the project belongs to the authenticated user
      const { data: project, error: projectError } = await supabase
        .from('balloon_projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)  // ✅ SECURITY FIX: Verify project ownership
        .single();

      if (projectError || !project) {
        // Error('Project not found or unauthorized');
        return false;
      }

      // Delete existing annotations (now safe because we verified ownership)
      await supabase
        .from('balloon_annotations')
        .delete()
        .eq('project_id', projectId);

      if (annotations.length === 0) {
        return true;
      }

      // Insert new annotations
      const dbAnnotations = annotations.map(annotation => ({
        project_id: projectId,
        balloon_number: annotation.number,
        label: annotation.label,
        x_position: annotation.x,
        y_position: annotation.y,
        style: annotation.style,
        color: annotation.color,
        note: annotation.note || ''
      }));

      const { error } = await supabase
        .from('balloon_annotations')
        .insert(dbAnnotations);

      if (error) {
        // Error('Error saving annotations:', error);
        return false;
      }

      return true;
    } catch (error) {
      // Error('Unexpected error saving annotations:', error);
      return false;
    }
  }

  // File upload to Supabase Storage
  static async uploadPDFFile(file: File, fileName: string): Promise<string | null> {
    try {
      // Get current user for folder organization
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Error('User not authenticated');
        return null;
      }

      // Create a unique file path with user folder
      const fileExt = file.name.split('.').pop();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${user.id}/${Date.now()}_${sanitizedFileName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('balloon-diagrams')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // Error('Error uploading PDF file:', error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('balloon-diagrams')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      // Error('Unexpected error uploading file:', error);
      return null;
    }
  }

  static async deletePDFFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('balloon-diagrams')
        .remove([filePath]);

      if (error) {
        // Error('Error deleting PDF file:', error);
        return false;
      }

      return true;
    } catch (error) {
      // Error('Unexpected error deleting file:', error);
      return false;
    }
  }
}