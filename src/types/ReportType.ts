export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'rejected';
export type ReportReason = 'spam' | 'scam' | 'prohibited_item' | 'false_information' | 'other';

export interface ReportListing {
    _id: string;
    ad: {
        _id: string;
        title: string;
        images: string[];
    };
    reporter: {
        _id: string;
        name: string;
        email: string;
    };
    reportedUser: {
        _id: string;
        name: string;
        email: string;
    };
    reason: ReportReason;
    details: string;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
    reportedAd: string;
}