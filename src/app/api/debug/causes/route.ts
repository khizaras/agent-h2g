import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check if we have any causes with training details
    const trainingCauses = await Database.query(`
      SELECT 
        c.id,
        c.title,
        c.category_id,
        cat.name as category_name,
        td.id as training_details_id,
        td.training_type,
        td.skill_level,
        td.topics,
        td.learning_objectives,
        td.schedule,
        td.instructor_name
      FROM causes c
      JOIN categories cat ON c.category_id = cat.id
      LEFT JOIN training_details td ON c.id = td.cause_id
      WHERE cat.name = 'training'
      LIMIT 5
    `);

    console.log('Training causes found:', trainingCauses);

    // Test individual cause fetch like the detail page does
    if (trainingCauses.length > 0) {
      const testCauseId = trainingCauses[0].id;
      
      const causeQuery = `
        SELECT 
          c.*,
          u.name as user_name,
          u.email as user_email,
          u.avatar as user_avatar,
          u.bio as user_bio,
          cat.name as category_name,
          cat.display_name as category_display_name,
          cat.description as category_description,
          cat.color as category_color
        FROM causes c
        LEFT JOIN users u ON c.user_id = u.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE c.id = ?
      `;

      const [cause] = await Database.query(causeQuery, [testCauseId]) as any[];
      
      // Get training details for this cause
      const trainingQuery = `SELECT * FROM training_details WHERE cause_id = ?`;
      const [trainingDetails] = await Database.query(trainingQuery, [testCauseId]) as any[];
      
      console.log('Test cause:', cause);
      console.log('Training details:', trainingDetails);

      return NextResponse.json({
        success: true,
        data: {
          trainingCauses,
          testCause: {
            cause,
            trainingDetails
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        trainingCauses,
        message: 'No training causes found'
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { success: false, error: 'Debug failed', details: error.message },
      { status: 500 }
    );
  }
}