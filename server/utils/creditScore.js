const calculateTrustScore = (revenue, debt, foundedYear) => {
    let score = 50; // Base Score

    // Revenue Impact: +1 point for every 10,000 revenue
    const revenuePoints = Math.min(Math.floor(revenue / 10000), 30); // Max 30 points
    score += revenuePoints;

    // Debt Impact: -1 point for every 5,000 debt
    const debtPoints = Math.min(Math.floor(debt / 5000), 20); // Max 20 points penalty
    score -= debtPoints;

    // Experience Impact: +2 points for every year in business
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - foundedYear;
    const experiencePoints = Math.min(yearsInBusiness * 2, 20); // Max 20 points
    score += experiencePoints;

    // Cap at 100, Floor at 0
    return Math.max(0, Math.min(100, score));
};

module.exports = calculateTrustScore;
