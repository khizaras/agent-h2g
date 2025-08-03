import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log('Creating test training cause...');

    // Use database transaction for cause creation
    const result = await Database.transaction(async (connection) => {
      // Insert minimal cause record first
      const causeInsertResult = await connection.execute(`
        INSERT INTO causes (
          title, description, category_id, user_id, cause_type,
          location, priority, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
      `, [
        'Test Training Course',
        'Test description for training course',
        3, // training category ID
        session.user.id,
        'offered',
        'Test Location',
        'medium'
      ]);

      console.log('Cause insert result:', causeInsertResult);
      const causeId = (causeInsertResult as any)[0].insertId;
      console.log('Extracted causeId:', causeId);
      
      if (!causeId) {
        throw new Error('Failed to get cause ID');
      }

      // Insert minimal training details
      console.log('Creating minimal training details...');
      
      await connection.execute(`
        INSERT INTO training_details (
          cause_id, training_type, skill_level, topics, max_participants,
          current_participants, duration_hours, number_of_sessions,
          start_date, end_date, schedule, delivery_method, instructor_name,
          price, is_free, course_language, difficulty_rating, enrollment_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        causeId,
        'course',
        'all-levels',
        JSON.stringify(['general']),
        20,
        0,
        1,
        1,
        new Date().toISOString().split('T')[0],
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        JSON.stringify([]),
        'in-person',
        session.user.name || 'Test Instructor',
        0.00,
        true,
        'English',
        1,
        'open'
      ]);

      return causeId;
    });

    return NextResponse.json({
      success: true,
      data: { causeId: result },
      message: 'Test training cause created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating test training cause:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test cause', details: error.message },
      { status: 500 }
    );
  }
}