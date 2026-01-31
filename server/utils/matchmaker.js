const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

const calculateMatchScore = (investorPrefs, company) => {
    // 1. Prepare Documents
    const tfidf = new TfIdf();

    // Investor "Document"
    const investorText = investorPrefs.join(' ');
    tfidf.addDocument(investorText);

    // Company "Document"
    const companyText = `${company.businessName} ${company.sector} ${company.description}`;
    tfidf.addDocument(companyText);

    // 2. Calculate Similarity
    // Since we only have 2 docs in this specific comparison instance, 
    // we can check the vector similarity or just check term frequency overlap weighted by IDF.
    // However, 'natural' doesn't give a direct "cosine similarity between doc 0 and doc 1" easily without extracting vectors.
    // Simpler approach for this specific 1-to-1 comparison:
    // Check how many of the investor tokens appear in the company document, weighted.

    let score = 0;
    const items = investorText.split(' ');

    // We'll iterate over investor preference terms
    items.forEach(term => {
        tfidf.tfidfs(term, function (i, measure) {
            if (i === 1) { // Checking against Company Document (index 1)
                score += measure;
            }
        });
    });

    // Normalize: A score > 5 is very high in TF-IDF for short texts.
    // Let's map it to a 0-100 percentage roughly.
    // This is a heuristic normalization.
    let percentage = (score * 20);

    // Boost if Sector matches exactly
    if (investorPrefs.some(p => p.toLowerCase() === company.sector.toLowerCase())) {
        percentage += 30;
    }

    return Math.min(Math.floor(percentage), 100);
};

module.exports = calculateMatchScore;
