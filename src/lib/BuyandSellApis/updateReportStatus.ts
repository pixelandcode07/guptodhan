
import { ReportStatus } from '@/types/ReportType';
import { revalidatePath } from 'next/cache';

export async function updateReportStatus(id: string, status: ReportStatus) {
    const res = await fetch(`/api/v1/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (data.success) {
        revalidatePath('/general/reports');
        return { success: true };
    }

    return { success: false, message: data.message };
}