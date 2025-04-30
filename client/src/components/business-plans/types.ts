export interface BusinessPlanType {
    businessInfo: {
        name: string;
        industry: string;
        address: string;
        [key: string]: any; // For additional fields like `missionStatement` or `cuisine`
    };
    financialProjections: {
        revenue: number;
        expenses: number;
        profit: number;
    };
    loanRequest: {
        amount: number;
        purpose: string;
    };
    techAndInnovation?: {
        productDescription: string;
        uniqueSellingProposition: string;
    };
    menuAndOperations?: {
        menuHighlights: string;
        seatingCapacity: number;
    };
    marketAnalysis?: {
        targetMarket?: string;
        marketSize?: string;
        targetCustomers?: string;
        competition?: string;
    };
    customData?: Record<string, string>;
}
