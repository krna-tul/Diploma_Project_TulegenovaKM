export function tokenizeWords(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/ß/g, 'ss')
      .replace(/ς/g, 'σ')
      .match(/[\p{L}\p{N}_]+/gu) || [],
  );
}
export function jaccardSimilarity(firstText, secondText) {
  const firstWords = tokenizeWords(firstText);
  const secondWords = tokenizeWords(secondText);
  let intersectionSize = 0;
  for (const word of firstWords) if (secondWords.has(word)) intersectionSize++;
  const unionSize = firstWords.size + secondWords.size - intersectionSize;
  return unionSize ? intersectionSize / unionSize : 0;
}
export function sparseDotProduct(firstVector, secondVector) {
  let product = 0;
  for (const dimension in firstVector)
    product += firstVector[dimension] * (secondVector[dimension] || 0);
  return product;
}
export function scoreCourseRelevance(model, skill, course) {
  const contentSimilarity = sparseDotProduct(skill.vector, course.contentVector);
  const titleSimilarity = sparseDotProduct(skill.vector, course.titleVector);
  const features = [
    contentSimilarity,
    titleSimilarity,
    Math.min(contentSimilarity, titleSimilarity),
    jaccardSimilarity(course.content, skill.label),
    jaccardSimilarity(course.title, skill.label),
  ];
  const linearScore = features.reduce(
    (total, feature, index) =>
      total + ((feature - model.mean[index]) / model.scale[index]) * model.coef[index],
    model.intercept,
  );
  const probability = 1 / (1 + Math.exp(-linearScore));
  return {
    features,
    probability,
    match: probability >= model.threshold,
  };
}
