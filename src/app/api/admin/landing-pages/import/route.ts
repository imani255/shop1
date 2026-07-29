import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import LandingPage from '@/models/LandingPage';
import { auth } from '@/auth';

async function authorizeAdmin() {
  const session = await auth();
  if (!session || !session.user || !(['admin', 'super_admin', 'manager'].includes((session.user as any)?.role))) {
    return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, slug, jsonContent, pixelId } = body;

    if (!title || !slug || !jsonContent) {
      return NextResponse.json({ message: 'Title, Slug, and JSON Content are required' }, { status: 400 });
    }

    // Slug validation
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ 
        message: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.' 
      }, { status: 400 });
    }

    // Parse JSON Content
    let parsedJson: any;
    if (typeof jsonContent === 'string') {
      try {
        parsedJson = JSON.parse(jsonContent);
      } catch (e) {
        return NextResponse.json({ message: 'Invalid JSON string provided' }, { status: 400 });
      }
    } else {
      parsedJson = jsonContent;
    }

    let elementorData = null;
    let importType: 'elementor' | 'cartflows' = 'elementor';

    if (Array.isArray(parsedJson)) {
      // CartFlows Format
      importType = 'cartflows';
      const flow = parsedJson[0];
      if (flow && flow.steps && Array.isArray(flow.steps)) {
        // Try to find checkout or landing step with _elementor_data
        const stepWithData = flow.steps.find((step: any) => step.meta && step.meta._elementor_data);
        if (stepWithData) {
          try {
            const rawData = Array.isArray(stepWithData.meta._elementor_data) 
              ? stepWithData.meta._elementor_data[0] 
              : stepWithData.meta._elementor_data;
            elementorData = JSON.parse(rawData);
          } catch (e) {
            console.error('Failed to parse _elementor_data from CartFlows step:', e);
          }
        }

        // Fallback: check post_content
        if (!elementorData) {
          const stepWithContent = flow.steps.find((step: any) => step.post_content && step.post_content !== '""');
          if (stepWithContent) {
            try {
              elementorData = JSON.parse(stepWithContent.post_content);
            } catch (e) {}
          }
        }
      }
    } else if (parsedJson && typeof parsedJson === 'object') {
      // Elementor single page export
      importType = 'elementor';
      elementorData = parsedJson.content || parsedJson;
    }

    if (!elementorData) {
      return NextResponse.json({ 
        message: 'Could not extract valid Elementor layout structure from the provided JSON file.' 
      }, { status: 400 });
    }

    await connectToDatabase();

    // Check slug duplication
    const existing = await LandingPage.findOne({ slug });
    if (existing) {
      return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }

    // Save landing page
    const newPage = await LandingPage.create({
      title,
      slug,
      importType,
      elementorData,
      pixelId: pixelId || '',
      sections: [], // Empty since we use elementorData for rendering
      isActive: true,
    });

    return NextResponse.json(newPage, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000 || (error.message && error.message.includes('E11000'))) {
      return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }
    console.error('Error importing landing page JSON:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
