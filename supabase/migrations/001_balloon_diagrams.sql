-- Balloon Diagrams Schema
-- Create tables for storing balloon diagram projects and annotations

-- Create balloon_projects table
CREATE TABLE IF NOT EXISTS balloon_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pdf_file_name VARCHAR(500) NOT NULL,
    pdf_file_url TEXT NOT NULL,
    pdf_file_size BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create balloon_annotations table
CREATE TABLE IF NOT EXISTS balloon_annotations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES balloon_projects(id) ON DELETE CASCADE,
    balloon_number INTEGER NOT NULL,
    label VARCHAR(50) NOT NULL,
    x_position DECIMAL(5,2) NOT NULL, -- Percentage position (0-100)
    y_position DECIMAL(5,2) NOT NULL, -- Percentage position (0-100)
    style VARCHAR(20) NOT NULL DEFAULT 'circle' CHECK (style IN ('circle', 'square', 'diamond')),
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6', -- Hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_balloon_projects_user_id ON balloon_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_balloon_projects_created_at ON balloon_projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_balloon_annotations_project_id ON balloon_annotations(project_id);
CREATE INDEX IF NOT EXISTS idx_balloon_annotations_balloon_number ON balloon_annotations(balloon_number);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_balloon_projects_updated_at 
    BEFORE UPDATE ON balloon_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_balloon_annotations_updated_at 
    BEFORE UPDATE ON balloon_annotations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE balloon_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE balloon_annotations ENABLE ROW LEVEL SECURITY;

-- Policies for balloon_projects
CREATE POLICY "Users can view their own balloon projects" 
    ON balloon_projects FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create balloon projects" 
    ON balloon_projects FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own balloon projects" 
    ON balloon_projects FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own balloon projects" 
    ON balloon_projects FOR DELETE 
    USING (auth.uid() = user_id);

-- Policies for balloon_annotations
CREATE POLICY "Users can view annotations for their projects" 
    ON balloon_annotations FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM balloon_projects 
            WHERE balloon_projects.id = balloon_annotations.project_id 
            AND balloon_projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create annotations for their projects" 
    ON balloon_annotations FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM balloon_projects 
            WHERE balloon_projects.id = balloon_annotations.project_id 
            AND balloon_projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update annotations for their projects" 
    ON balloon_annotations FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM balloon_projects 
            WHERE balloon_projects.id = balloon_annotations.project_id 
            AND balloon_projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete annotations for their projects" 
    ON balloon_annotations FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM balloon_projects 
            WHERE balloon_projects.id = balloon_annotations.project_id 
            AND balloon_projects.user_id = auth.uid()
        )
    );

-- Create a view for easy querying of projects with annotation counts
CREATE OR REPLACE VIEW balloon_projects_with_stats AS
SELECT 
    bp.*,
    COUNT(ba.id) as annotation_count,
    MAX(ba.updated_at) as last_annotation_update
FROM balloon_projects bp
LEFT JOIN balloon_annotations ba ON bp.id = ba.project_id
GROUP BY bp.id;

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON TABLE balloon_projects TO authenticated;
GRANT ALL ON TABLE balloon_annotations TO authenticated;
GRANT SELECT ON TABLE balloon_projects_with_stats TO authenticated;