
-- Role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Hero content (single row)
CREATE TABLE public.hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Rajneesh Pant',
  tagline TEXT NOT NULL DEFAULT 'Aspiring Educator | Passionate About Teaching',
  intro TEXT NOT NULL DEFAULT 'A dedicated education student committed to creating meaningful learning experiences.',
  image_url TEXT,
  button1_text TEXT NOT NULL DEFAULT 'View Portfolio',
  button2_text TEXT NOT NULL DEFAULT 'Download Resume',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read hero" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Admin update hero" ON public.hero_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin insert hero" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- About content (single row)
CREATE TABLE public.about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read about" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Admin update about" ON public.about_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin insert about" ON public.about_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Education entries
CREATE TABLE public.education_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT,
  start_year TEXT,
  end_year TEXT,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.education_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read education" ON public.education_entries FOR SELECT USING (true);
CREATE POLICY "Admin insert education" ON public.education_entries FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update education" ON public.education_entries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete education" ON public.education_entries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'teaching',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admin insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update skills" ON public.skills FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete skills" ON public.skills FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT,
  date_range TEXT,
  description TEXT,
  image_url TEXT,
  link TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admin insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update projects" ON public.projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete projects" ON public.projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Contact info (single row)
CREATE TABLE public.contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  github TEXT,
  twitter TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read contact" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Admin update contact" ON public.contact_info FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin insert contact" ON public.contact_info FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON public.hero_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_education_entries_updated_at BEFORE UPDATE ON public.education_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default data
INSERT INTO public.hero_content (name, tagline, intro, button1_text, button2_text) VALUES
('Rajneesh Pant', 'Aspiring Educator | Passionate About Teaching', 'A dedicated education student committed to creating meaningful learning experiences and inspiring young minds through innovative and inclusive teaching practices.', 'View Portfolio', 'Download Resume');

INSERT INTO public.about_content (description) VALUES
('I am a passionate education student pursuing my B.Sc B.Ed at Azim Premji University, Bangalore. My journey in education is driven by a deep belief that every child deserves access to quality, inclusive, and engaging learning experiences. I am particularly interested in activity-based pedagogies, science education, and building strong teacher-student relationships.');

INSERT INTO public.education_entries (degree, institution, location, start_year, end_year, description, sort_order) VALUES
('B.Sc B.Ed (Integrated)', 'Azim Premji University', 'Bangalore, Karnataka', '2021', '2025', 'An integrated four-year program combining Science education with teacher preparation.', 0);

INSERT INTO public.skills (name, category, sort_order) VALUES
('Classroom Management', 'teaching', 0), ('Lesson Planning', 'teaching', 1), ('Student Assessment', 'teaching', 2),
('Communication', 'teaching', 3), ('Curriculum Design', 'teaching', 4), ('Differentiated Instruction', 'teaching', 5),
('MS Office Suite', 'technical', 0), ('Google Workspace', 'technical', 1), ('EdTech Tools', 'technical', 2),
('Presentation Design', 'technical', 3), ('Basic Data Analysis', 'technical', 4), ('Digital Content Creation', 'technical', 5);

INSERT INTO public.projects (title, organization, date_range, description, sort_order) VALUES
('Teaching Internship', 'Government Higher Primary School, Bangalore', 'Jan 2024 – Mar 2024', 'Completed a 10-week teaching internship working with Grade 5 students.', 0),
('Community Volunteer Teaching', 'Teach For Change Foundation', 'Jun 2023 – Aug 2023', 'Volunteered as a teaching assistant in an after-school program.', 1),
('Curriculum Development Project', 'Azim Premji University', 'Sep 2023 – Nov 2023', 'Collaborated with peers to design an integrated Science-EVS curriculum unit.', 2);

INSERT INTO public.contact_info (email, phone, linkedin, github, twitter) VALUES
('rajneesh@email.com', '+91 98765 43210', 'https://linkedin.com/in/rajneeshpant', '#', '#');
