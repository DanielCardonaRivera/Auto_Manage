import { NextResponse } from 'next/server';

export type GridContribution = {
  date: string;       
  count: number;      
  level: 0 | 1 | 2 | 3 | 4;
};

export async function GET() {
  try {
    // 2. Aquí conectarías tu Base de Datos (ej. Prisma, Mongoose)
    // const data = await db.contributions.findMany();
    
    const mockGridData: GridContribution[] = [
      { date: "2026-03-01", count: 0, level: 0 },
      { date: "2026-03-02", count: 3, level: 1 },
      { date: "2026-03-03", count: 12, level: 4 },
      { date: "2026-03-04", count: 6, level: 2 },
    ];

    return NextResponse.json({ 
      success: true,
      data: mockGridData 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: "Error al obtener los datos del mosaico" 
    }, { status: 500 });
  }
}
